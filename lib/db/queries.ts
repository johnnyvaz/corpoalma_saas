
import { desc, eq, and, gte, lte, sql } from 'drizzle-orm';
import { db } from './drizzle';
import {
  users,
  teams,
  teamMembers,
  activityLogs,
  weeklyThemes,
  dailyTasks,
  userProgress,
  weightTracking,
  testimonials,
  type User,
  type Team,
  type TeamMember,
  type ActivityLog,
  type WeeklyTheme,
  type DailyTask,
  type UserProgress,
  type WeightTracking,
  type Testimonial,
} from './schema';

// Existing user queries
export async function getUser(email: string): Promise<User | null> {
  const user = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return user.length > 0 ? user[0] : null;
}

export async function createUser(email: string, passwordHash: string, name: string): Promise<User> {
  const [user] = await db.insert(users).values({
    email,
    passwordHash,
    name,
    programStartDate: new Date(),
  }).returning();
  return user;
}

export async function getUserById(id: number): Promise<User | null> {
  const user = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return user.length > 0 ? user[0] : null;
}

// Program-specific queries

// Weekly themes
export async function getWeeklyTheme(weekNumber: number): Promise<WeeklyTheme | null> {
  const theme = await db.select().from(weeklyThemes).where(eq(weeklyThemes.weekNumber, weekNumber)).limit(1);
  return theme.length > 0 ? theme[0] : null;
}

export async function getAllWeeklyThemes(): Promise<WeeklyTheme[]> {
  return await db.select().from(weeklyThemes).orderBy(weeklyThemes.weekNumber);
}

// Daily tasks
export async function getDailyTask(weekNumber: number, dayNumber: number): Promise<DailyTask | null> {
  const task = await db.select().from(dailyTasks)
    .where(and(eq(dailyTasks.weekNumber, weekNumber), eq(dailyTasks.dayNumber, dayNumber)))
    .limit(1);
  return task.length > 0 ? task[0] : null;
}

export async function getWeeklyTasks(weekNumber: number): Promise<DailyTask[]> {
  return await db.select().from(dailyTasks)
    .where(eq(dailyTasks.weekNumber, weekNumber))
    .orderBy(dailyTasks.dayNumber);
}

export async function createDailyTask(task: Omit<DailyTask, 'id' | 'createdAt'>): Promise<DailyTask> {
  const [newTask] = await db.insert(dailyTasks).values(task).returning();
  return newTask;
}

// User progress
export async function getUserProgress(userId: number, weekNumber: number): Promise<UserProgress[]> {
  return await db.select().from(userProgress)
    .where(and(eq(userProgress.userId, userId), eq(userProgress.weekNumber, weekNumber)))
    .orderBy(userProgress.dayNumber);
}

export async function markTaskCompleted(userId: number, weekNumber: number, dayNumber: number, notes?: string): Promise<UserProgress> {
  const existing = await db.select().from(userProgress)
    .where(and(
      eq(userProgress.userId, userId),
      eq(userProgress.weekNumber, weekNumber),
      eq(userProgress.dayNumber, dayNumber)
    )).limit(1);

  if (existing.length > 0) {
    const [updated] = await db.update(userProgress)
      .set({
        completed: true,
        notes,
        completedAt: new Date(),
      })
      .where(eq(userProgress.id, existing[0].id))
      .returning();
    return updated;
  } else {
    const [newProgress] = await db.insert(userProgress).values({
      userId,
      weekNumber,
      dayNumber,
      completed: true,
      notes,
      completedAt: new Date(),
    }).returning();
    return newProgress;
  }
}

// Weight tracking
export async function getUserWeightHistory(userId: number): Promise<WeightTracking[]> {
  return await db.select().from(weightTracking)
    .where(eq(weightTracking.userId, userId))
    .orderBy(desc(weightTracking.recordedAt));
}

export async function addWeightRecord(userId: number, weight: number, weekNumber: number): Promise<WeightTracking> {
  const [record] = await db.insert(weightTracking).values({
    userId,
    weight: weight.toString(),
    weekNumber,
  }).returning();
  return record;
}

export async function getLatestWeight(userId: number): Promise<WeightTracking | null> {
  const weight = await db.select().from(weightTracking)
    .where(eq(weightTracking.userId, userId))
    .orderBy(desc(weightTracking.recordedAt))
    .limit(1);
  return weight.length > 0 ? weight[0] : null;
}

// Testimonials
export async function createTestimonial(userId: number, weekNumber: number, content: string, isPublic: boolean = false): Promise<Testimonial> {
  const [testimonial] = await db.insert(testimonials).values({
    userId,
    weekNumber,
    content,
    isPublic,
  }).returning();
  return testimonial;
}

export async function getUserTestimonials(userId: number): Promise<Testimonial[]> {
  return await db.select().from(testimonials)
    .where(eq(testimonials.userId, userId))
    .orderBy(desc(testimonials.createdAt));
}

export async function getPublicTestimonials(): Promise<Testimonial[]> {
  return await db.select().from(testimonials)
    .where(eq(testimonials.isPublic, true))
    .orderBy(desc(testimonials.createdAt))
    .limit(10);
}

// User program management
export async function updateUserWeek(userId: number, weekNumber: number): Promise<User> {
  const [user] = await db.update(users)
    .set({ currentWeek: weekNumber })
    .where(eq(users.id, userId))
    .returning();
  return user;
}

export async function completeProgram(userId: number): Promise<User> {
  const [user] = await db.update(users)
    .set({ programCompleted: true })
    .where(eq(users.id, userId))
    .returning();
  return user;
}

// Analytics
export async function getUserCompletionRate(userId: number): Promise<number> {
  const totalTasks = await db.select({ count: sql<number>`count(*)` })
    .from(dailyTasks);
  
  const completedTasks = await db.select({ count: sql<number>`count(*)` })
    .from(userProgress)
    .where(and(eq(userProgress.userId, userId), eq(userProgress.completed, true)));

  if (totalTasks[0].count === 0) return 0;
  return (completedTasks[0].count / totalTasks[0].count) * 100;
}

export async function getAverageWeightLoss(): Promise<number> {
  const result = await db.execute(sql`
    SELECT AVG(first_weight.weight - last_weight.weight) as avg_loss
    FROM (
      SELECT DISTINCT ON (user_id) user_id, weight
      FROM weight_tracking
      ORDER BY user_id, recorded_at ASC
    ) first_weight
    JOIN (
      SELECT DISTINCT ON (user_id) user_id, weight
      FROM weight_tracking
      ORDER BY user_id, recorded_at DESC
    ) last_weight ON first_weight.user_id = last_weight.user_id
    WHERE first_weight.weight > last_weight.weight
  `);
  
  return result.rows[0]?.avg_loss || 0;
}

// Team/admin queries (keeping existing structure)
export async function getTeamByStripeCustomerId(customerId: string): Promise<Team | null> {
  const team = await db.select().from(teams).where(eq(teams.stripeCustomerId, customerId)).limit(1);
  return team.length > 0 ? team[0] : null;
}

export async function createTeam(data: { name: string; userId: number }): Promise<Team> {
  const [team] = await db.insert(teams).values({ name: data.name }).returning();
  
  await db.insert(teamMembers).values({
    teamId: team.id,
    userId: data.userId,
    role: 'owner',
  });

  return team;
}

export async function getTeamByUserId(userId: number): Promise<Team | null> {
  const teamMember = await db
    .select({ team: teams })
    .from(teamMembers)
    .innerJoin(teams, eq(teamMembers.teamId, teams.id))
    .where(eq(teamMembers.userId, userId))
    .limit(1);

  return teamMember.length > 0 ? teamMember[0].team : null;
}

export async function updateTeamSubscription(
  teamId: number,
  subscriptionData: {
    stripeCustomerId?: string;
    stripeSubscriptionId?: string;
    stripeProductId?: string;
    planName?: string;
    subscriptionStatus?: string;
  }
): Promise<Team> {
  const [team] = await db.update(teams).set(subscriptionData).where(eq(teams.id, teamId)).returning();
  return team;
}

export async function getActivityLogs(): Promise<
  Array<ActivityLog & { user: { name: string; email: string } | null; team: { name: string } }>
> {
  return await db
    .select({
      id: activityLogs.id,
      teamId: activityLogs.teamId,
      userId: activityLogs.userId,
      action: activityLogs.action,
      timestamp: activityLogs.timestamp,
      ipAddress: activityLogs.ipAddress,
      user: {
        name: users.name,
        email: users.email,
      },
      team: {
        name: teams.name,
      },
    })
    .from(activityLogs)
    .leftJoin(users, eq(activityLogs.userId, users.id))
    .innerJoin(teams, eq(activityLogs.teamId, teams.id))
    .orderBy(desc(activityLogs.timestamp))
    .limit(10);
}

export async function logActivity(teamId: number, userId: number | null, action: string, ipAddress?: string): Promise<ActivityLog> {
  const [log] = await db.insert(activityLogs).values({
    teamId,
    userId,
    action,
    ipAddress,
  }).returning();
  return log;
}
