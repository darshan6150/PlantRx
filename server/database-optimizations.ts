// Database Query Optimization System for PlantRx
import { eq, and, or, desc, asc, ilike, inArray, sql } from 'drizzle-orm';
import { db } from './db';
import { users, remedies, reviews, products, orders } from '../shared/schema';

// Query optimization utilities and caching
export class DatabaseOptimizer {
  private static queryCache = new Map<string, { data: any; timestamp: number; ttl: number }>();

  // Cache wrapper for frequently accessed data
  static async cachedQuery<T>(
    cacheKey: string,
    queryFn: () => Promise<T>,
    ttlMs: number = 5 * 60 * 1000 // 5 minutes default
  ): Promise<T> {
    const cached = this.queryCache.get(cacheKey);
    const now = Date.now();

    if (cached && now - cached.timestamp < cached.ttl) {
      return cached.data as T;
    }

    const data = await queryFn();
    this.queryCache.set(cacheKey, { data, timestamp: now, ttl: ttlMs });
    return data;
  }

  // Clear cache entries
  static clearCache(pattern?: string) {
    if (!pattern) {
      this.queryCache.clear();
      return;
    }

    for (const key of this.queryCache.keys()) {
      if (key.includes(pattern)) {
        this.queryCache.delete(key);
      }
    }
  }

  // Optimized user queries
  static async getUserWithStats(userId: number) {
    return this.cachedQuery(
      `user-stats-${userId}`,
      async () => {
        return await db
          .select({
            user: users,
            reviewCount: sql<number>`COUNT(DISTINCT ${reviews.id})`,
            averageRating: sql<number>`COALESCE(AVG(${reviews.rating}), 0)`
          })
          .from(users)
          .leftJoin(reviews, eq(reviews.userId, users.id))
          .where(eq(users.id, userId))
          .groupBy(users.id)
          .limit(1);
      },
      10 * 60 * 1000 // 10 minutes
    );
  }

  // Optimized remedy search with pagination
  static async searchRemedies({
    query,
    category,
    limit = 20,
    offset = 0,
    sortBy = 'relevance'
  }: {
    query?: string;
    category?: string;
    limit?: number;
    offset?: number;
    sortBy?: 'relevance' | 'rating' | 'recent' | 'name';
  }) {
    const cacheKey = `remedies-${JSON.stringify({ query, category, limit, offset, sortBy })}`;

    return this.cachedQuery(
      cacheKey,
      async () => {
        let baseQuery = db
          .select({
            id: remedies.id,
            name: remedies.name,
            slug: remedies.slug,
            description: remedies.description,
            category: remedies.category,
            averageRating: remedies.averageRating,
            reviewCount: remedies.reviewCount,
            imageUrl: remedies.imageUrl,
            createdAt: remedies.createdAt
          })
          .from(remedies)
          .where(and(
            eq(remedies.isActive, true),
            query ? or(
              ilike(remedies.name, `%${query}%`),
              ilike(remedies.description, `%${query}%`),
              sql`${remedies.ingredients}::text ILIKE ${`%${query}%`}`
            ) : undefined,
            category ? eq(remedies.category, category) : undefined
          ));

        // Apply sorting
        switch (sortBy) {
          case 'rating':
            baseQuery = baseQuery.orderBy(desc(remedies.averageRating), desc(remedies.reviewCount));
            break;
          case 'recent':
            baseQuery = baseQuery.orderBy(desc(remedies.createdAt));
            break;
          case 'name':
            baseQuery = baseQuery.orderBy(asc(remedies.name));
            break;
          default: // relevance
            if (query) {
              baseQuery = baseQuery.orderBy(
                sql`CASE 
                  WHEN ${remedies.name} ILIKE ${`%${query}%`} THEN 1
                  WHEN ${remedies.description} ILIKE ${`%${query}%`} THEN 2
                  ELSE 3
                END`,
                desc(remedies.averageRating)
              );
            } else {
              baseQuery = baseQuery.orderBy(desc(remedies.averageRating), desc(remedies.reviewCount));
            }
        }

        return await baseQuery.limit(limit).offset(offset);
      },
      2 * 60 * 1000 // 2 minutes for search results
    );
  }

  // Batch operations for better performance
  static async batchUpdateRemedyStats(remedyIds: number[]) {
    const updates = await Promise.all(
      remedyIds.map(async (remedyId) => {
        const stats = await db
          .select({
            averageRating: sql<number>`COALESCE(AVG(${reviews.rating}), 0)`,
            reviewCount: sql<number>`COUNT(${reviews.id})`
          })
          .from(reviews)
          .where(eq(reviews.remedyId, remedyId));

        return { remedyId, stats: stats[0] };
      })
    );

    // Batch update all at once
    await Promise.all(
      updates.map(({ remedyId, stats }) =>
        db
          .update(remedies)
          .set({
            averageRating: stats.averageRating,
            reviewCount: stats.reviewCount
          })
          .where(eq(remedies.id, remedyId))
      )
    );

    // Clear relevant cache
    this.clearCache('remedies');
  }

  // Connection pool optimization
  static async healthCheck() {
    try {
      await db.select({ count: sql<number>`COUNT(*)` }).from(users).limit(1);
      return { status: 'healthy', timestamp: new Date().toISOString() };
    } catch (error) {
      return { status: 'error', error: error instanceof Error ? error.message : 'Unknown error', timestamp: new Date().toISOString() };
    }
  }

  // Database maintenance utilities
  static async getQueryStats() {
    const cacheStats = {
      entries: this.queryCache.size,
      keys: Array.from(this.queryCache.keys())
    };

    return {
      cache: cacheStats,
      timestamp: new Date().toISOString()
    };
  }
}

// Database indexing recommendations (for manual application)
export const indexRecommendations = {
  users: [
    'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_email ON users(email);',
    'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_role ON users(role);',
    'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_created_at ON users(created_at);'
  ],
  remedies: [
    'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_remedies_slug ON remedies(slug);',
    'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_remedies_category ON remedies(category);',
    'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_remedies_active ON remedies(is_active);',
    'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_remedies_rating ON remedies(average_rating DESC);',
    'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_remedies_name_gin ON remedies USING gin(to_tsvector(\'english\', name));',
    'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_remedies_description_gin ON remedies USING gin(to_tsvector(\'english\', description));'
  ],
  reviews: [
    'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_reviews_remedy_id ON reviews(remedy_id);',
    'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);',
    'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_reviews_rating ON reviews(rating);',
    'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_reviews_created_at ON reviews(created_at);'
  ]
};

export default DatabaseOptimizer;