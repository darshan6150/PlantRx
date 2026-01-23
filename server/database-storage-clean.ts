// Clean Database Storage Implementation for PlantRx
import { db } from './db';
import { users, remedies, reviews, comments, chatSessions } from '../shared/schema';
import { eq, lt, and, or, sql } from 'drizzle-orm';

export class DatabaseStorageClean {
  // Clean up expired sessions
  static async cleanExpiredSessions(olderThanDays: number = 30): Promise<{ deleted: number }> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

    const result = await db
      .delete(chatSessions)
      .where(lt(chatSessions.updatedAt, cutoffDate))
      .returning({ id: chatSessions.id });

    return { deleted: result.length };
  }

  // Clean up unverified users
  static async cleanUnverifiedUsers(olderThanDays: number = 7): Promise<{ deleted: number }> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

    const result = await db
      .delete(users)
      .where(and(eq(users.isVerified, false), lt(users.createdAt, cutoffDate)))
      .returning({ id: users.id });

    return { deleted: result.length };
  }

  // Clean orphaned data
  static async cleanOrphanedData(): Promise<{ orphaned: number }> {
    const orphanedReviews = await db
      .delete(reviews)
      .where(sql`NOT EXISTS (SELECT 1 FROM users WHERE users.id = reviews.user_id)`)
      .returning({ id: reviews.id });

    return { orphaned: orphanedReviews.length };
  }

  // Get storage statistics
  static async getStorageStats(): Promise<{ totalUsers: number; totalRemedies: number }> {
    const userCount = await db.select({ count: sql<number>`COUNT(*)` }).from(users);
    const remedyCount = await db.select({ count: sql<number>`COUNT(*)` }).from(remedies);

    return {
      totalUsers: userCount[0].count,
      totalRemedies: remedyCount[0].count
    };
  }
}

export default DatabaseStorageClean;