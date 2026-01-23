// Comprehensive Comment Seeding System for PlantRx Community
import { db } from './db';
import { comments, users, remedies } from '../shared/schema';
import { sql } from 'drizzle-orm';

export interface CommentSeedData {
  content: string;
  authorName: string;
  remedyName?: string;
  rating?: number;
  isExpert?: boolean;
}

// Rich, diverse comment dataset for seeding
const commentSeedData: CommentSeedData[] = [
  // Expert comments
  {
    content: "This remedy combines traditional wisdom with modern understanding. Turmeric's curcumin content has been extensively studied for its anti-inflammatory properties. I recommend taking it with black pepper to enhance bioavailability.",
    authorName: "Dr. Sarah Chen",
    remedyName: "Golden Milk Anti-Inflammatory Blend",
    rating: 5,
    isExpert: true
  },
  {
    content: "From a clinical perspective, chamomile's apigenin compound binds to benzodiazepine receptors, which explains its calming effects. This traditional remedy has solid scientific backing.",
    authorName: "Dr. Michael Torres",
    remedyName: "Sleepy Time Chamomile Tea",
    rating: 5,
    isExpert: true
  },
  {
    content: "Ginger's gingerol compounds are particularly effective for digestive issues. I've seen excellent results with patients using this remedy for nausea and morning sickness during pregnancy.",
    authorName: "Dr. Emma Williams",
    remedyName: "Digestive Ginger Tonic",
    rating: 4,
    isExpert: true
  },

  // User testimonials
  {
    content: "I've been struggling with sleep issues for months. This chamomile blend has been a game-changer! I fall asleep faster and wake up more refreshed. Highly recommend!",
    authorName: "Jessica M.",
    remedyName: "Sleepy Time Chamomile Tea",
    rating: 5
  },
  {
    content: "As someone dealing with chronic inflammation, this turmeric blend has significantly reduced my joint pain. The taste took some getting used to, but the results speak for themselves.",
    authorName: "Robert K.",
    remedyName: "Golden Milk Anti-Inflammatory Blend",
    rating: 4
  },
  {
    content: "This ginger tonic saved my morning commute! I used to get car sick regularly, but now I take this before traveling and feel much better. Natural and effective.",
    authorName: "Maria S.",
    remedyName: "Digestive Ginger Tonic",
    rating: 5
  },
  {
    content: "I was skeptical at first, but after using this echinacea blend during cold season, I haven't gotten sick once! My immune system feels stronger.",
    authorName: "David L.",
    remedyName: "Immune Boost Echinacea Tea",
    rating: 4
  },
  {
    content: "The ashwagandha blend has helped me manage stress so much better. I feel more balanced and less anxious throughout the day. Worth every penny!",
    authorName: "Lisa T.",
    remedyName: "Stress Relief Ashwagandha Blend",
    rating: 5
  },

  // Mixed experiences
  {
    content: "Good product overall, but the taste is quite strong. I mix it with honey which helps. The effects are noticeable after about a week of consistent use.",
    authorName: "Alex P.",
    remedyName: "Golden Milk Anti-Inflammatory Blend",
    rating: 3
  },
  {
    content: "Works well for mild digestive issues, though I needed to increase the dosage slightly. The quality seems excellent and it's much better than commercial alternatives.",
    authorName: "Jennifer R.",
    remedyName: "Digestive Ginger Tonic",
    rating: 4
  },
  {
    content: "Helped with my sleep, but took about 2-3 weeks to see full effects. Patience is key with natural remedies. Now I sleep much better!",
    authorName: "Thomas H.",
    remedyName: "Sleepy Time Chamomile Tea",
    rating: 4
  },

  // Detailed reviews
  {
    content: "I've tried numerous natural sleep aids, and this chamomile blend is by far the most effective. The combination of chamomile, lavender, and passionflower creates a synergistic effect that promotes deep, restful sleep without grogginess the next day.",
    authorName: "Amanda K.",
    remedyName: "Sleepy Time Chamomile Tea",
    rating: 5
  },
  {
    content: "As someone who's dealt with digestive issues for years, I can confidently say this ginger blend has improved my quality of life. The organic ingredients and traditional preparation method make a noticeable difference compared to synthetic alternatives.",
    authorName: "Carlos M.",
    remedyName: "Digestive Ginger Tonic",
    rating: 5
  }
];

export async function seedComments(): Promise<{ success: boolean; seeded: number; errors?: string[] }> {
  try {
    console.log('Starting comment seeding process...');
    
    let seededCount = 0;
    const errors: string[] = [];

    for (const commentData of commentSeedData) {
      try {
        // Find or create user
        let userId: number;
        
        const existingUsers = await db
          .select({ id: users.id })
          .from(users)
          .where(sql`${users.username} = ${commentData.authorName} OR ${users.firstName} || ' ' || ${users.lastName} = ${commentData.authorName}`)
          .limit(1);

        if (existingUsers.length > 0) {
          userId = existingUsers[0].id;
        } else {
          // Create new user
          const newUsers = await db
            .insert(users)
            .values({
              username: commentData.authorName.toLowerCase().replace(/\s+/g, ''),
              email: `${commentData.authorName.toLowerCase().replace(/\s+/g, '')}@plantrx.demo`,
              firstName: commentData.authorName.split(' ')[0],
              lastName: commentData.authorName.split(' ').slice(1).join(' ') || '',
              password: 'demo-password-hash',
              role: commentData.isExpert ? 'expert' : 'customer',
              isVerified: true,
              expertStatus: commentData.isExpert ? 'approved' : 'pending'
            })
            .returning({ id: users.id });
          
          userId = newUsers[0].id;
        }

        // Find remedy if specified
        let remedyId: number | undefined;
        if (commentData.remedyName) {
          const remedyResults = await db
            .select({ id: remedies.id })
            .from(remedies)
            .where(sql`${remedies.name} ILIKE ${`%${commentData.remedyName}%`}`)
            .limit(1);
          
          if (remedyResults.length > 0) {
            remedyId = remedyResults[0].id;
          }
        }

        // Create comment
        await db.insert(comments).values({
          content: commentData.content,
          userId: userId,
          remedyId: remedyId,
          rating: commentData.rating || null,
          isApproved: true,
          createdAt: new Date()
        });

        seededCount++;
        console.log(`✓ Seeded comment by ${commentData.authorName}`);

      } catch (error) {
        const errorMsg = `Failed to seed comment by ${commentData.authorName}: ${error instanceof Error ? error.message : 'Unknown error'}`;
        errors.push(errorMsg);
        console.error(errorMsg);
      }
    }

    console.log(`Comment seeding completed: ${seededCount} comments seeded`);
    
    return {
      success: errors.length === 0,
      seeded: seededCount,
      errors: errors.length > 0 ? errors : undefined
    };

  } catch (error) {
    console.error('Comment seeding failed:', error);
    return {
      success: false,
      seeded: 0,
      errors: [error instanceof Error ? error.message : 'Unknown seeding error']
    };
  }
}

export async function clearComments(): Promise<void> {
  console.log('Clearing existing comments...');
  await db.delete(comments);
  console.log('Comments cleared');
}

export default { seedComments, clearComments, commentSeedData };