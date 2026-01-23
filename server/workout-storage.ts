import { drizzle } from "drizzle-orm/neon-serverless";
import { workouts, workoutSessions, userWorkoutProgress } from "../shared/schema";
import { eq, desc, and } from "drizzle-orm";

const db = drizzle(process.env.DATABASE_URL!);

export const workoutStorage = {
  // Get workouts by muscle group
  async getWorkoutsByMuscle(muscle: string) {
    try {
      const workoutList = await db
        .select()
        .from(workouts)
        .where(eq(workouts.primaryMuscle, muscle));
      return workoutList;
    } catch (error) {
      console.error("Error fetching workouts by muscle:", error);
      return [];
    }
  },

  // Get all workouts
  async getAllWorkouts() {
    try {
      const workoutList = await db
        .select()
        .from(workouts)
        .where(eq(workouts.isActive, true))
        .orderBy(desc(workouts.createdAt));
      return workoutList;
    } catch (error) {
      console.error("Error fetching all workouts:", error);
      return [];
    }
  },

  // Create workout session
  async createWorkoutSession(sessionData: any) {
    try {
      const [session] = await db
        .insert(workoutSessions)
        .values(sessionData)
        .returning();
      return session;
    } catch (error) {
      console.error("Error creating workout session:", error);
      throw error;
    }
  },

  // Complete workout session
  async completeWorkoutSession(sessionId: number, updateData: any) {
    try {
      const [session] = await db
        .update(workoutSessions)
        .set({
          completedAt: new Date(),
          duration: updateData.duration,
          caloriesBurned: updateData.caloriesBurned,
          completedSets: updateData.completedSets,
          notes: updateData.notes
        })
        .where(eq(workoutSessions.id, sessionId))
        .returning();
      return session;
    } catch (error) {
      console.error("Error completing workout session:", error);
      throw error;
    }
  },

  // Get user workout progress
  async getUserWorkoutProgress(userId: number) {
    try {
      const progress = await db
        .select()
        .from(userWorkoutProgress)
        .where(eq(userWorkoutProgress.userId, userId));
      return progress;
    } catch (error) {
      console.error("Error fetching user workout progress:", error);
      return [];
    }
  },

  // Update workout progress
  async updateWorkoutProgress(userId: number, muscleGroup: string, progressData: any) {
    try {
      await db
        .insert(userWorkoutProgress)
        .values({
          userId,
          muscleGroup,
          ...progressData
        })
        .onConflictDoUpdate({
          target: [userWorkoutProgress.userId, userWorkoutProgress.muscleGroup],
          set: progressData
        });
    } catch (error) {
      console.error("Error updating workout progress:", error);
    }
  },

  // Get workout recommendations
  async getWorkoutRecommendations(userId: number, progress: any[]) {
    try {
      // Simple recommendation logic - return popular workouts
      const recommendations = await db
        .select()
        .from(workouts)
        .where(eq(workouts.isActive, true))
        .limit(6);
      return recommendations;
    } catch (error) {
      console.error("Error fetching workout recommendations:", error);
      return [];
    }
  },

  // Get recent workout sessions
  async getRecentWorkoutSessions(userId: number) {
    try {
      const sessions = await db
        .select()
        .from(workoutSessions)
        .where(eq(workoutSessions.userId, userId))
        .orderBy(desc(workoutSessions.startedAt))
        .limit(10);
      return sessions;
    } catch (error) {
      console.error("Error fetching recent workout sessions:", error);
      return [];
    }
  }
};