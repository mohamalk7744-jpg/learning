import { integer, pgEnum, pgTable, serial, text, timestamp, varchar, boolean, smallint } from "drizzle-orm/pg-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = pgTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: serial("id").primaryKey(),
  /** Custom identifier (openId) for user. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  passwordHash: varchar("passwordHash", { length: 255 }), // For custom auth
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: pgEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().$onUpdate(() => new Date()).notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Subjects (المواد الدراسية)
export const subjects = pgTable("subjects", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  createdBy: integer("createdBy").notNull(),
  numberOfDays: integer("numberOfDays").notNull().default(30),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().$onUpdate(() => new Date()).notNull(),
});

export type Subject = typeof subjects.$inferSelect;
export type InsertSubject = typeof subjects.$inferInsert;

// Lessons (الدروس)
export const lessons = pgTable("lessons", {
  id: serial("id").primaryKey(),
  subjectId: integer("subjectId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  dayNumber: integer("dayNumber").notNull(), // اليوم الدراسي (1-30)
  order: integer("order").notNull().default(1),
  createdBy: integer("createdBy").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().$onUpdate(() => new Date()).notNull(),
});

export type Lesson = typeof lessons.$inferSelect;
export type InsertLesson = typeof lessons.$inferInsert;

// Quizzes (الاختبارات)
export const quizzes = pgTable("quizzes", {
  id: serial("id").primaryKey(),
  subjectId: integer("subjectId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  type: pgEnum("quiz_type", ["daily", "monthly", "semester"]).notNull(), // يومي أو شهري أو فصلي
  dayNumber: integer("dayNumber"), // لـ daily quizzes
  scheduledDate: timestamp("scheduledDate"),
  createdBy: integer("createdBy").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().$onUpdate(() => new Date()).notNull(),
});

export type Quiz = typeof quizzes.$inferSelect;
export type InsertQuiz = typeof quizzes.$inferInsert;

// Quiz Questions (أسئلة الاختبار)
export const quizQuestions = pgTable("quiz_questions", {
  id: serial("id").primaryKey(),
  quizId: integer("quizId").notNull(),
  question: text("question").notNull(),
  questionType: pgEnum("question_type", ["multiple_choice", "short_answer", "essay"]).notNull(),
  order: integer("order").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type QuizQuestion = typeof quizQuestions.$inferSelect;
export type InsertQuizQuestion = typeof quizQuestions.$inferInsert;

// Quiz Question Options (خيارات الأسئلة)
export const quizOptions = pgTable("quiz_options", {
  id: serial("id").primaryKey(),
  questionId: integer("questionId").notNull(),
  text: text("text").notNull(),
  isCorrect: boolean("isCorrect").notNull().default(false),
  order: integer("order").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type QuizOption = typeof quizOptions.$inferSelect;
export type InsertQuizOption = typeof quizOptions.$inferInsert;

// Student Answers (إجابات الطلاب)
export const studentAnswers = pgTable("student_answers", {
  id: serial("id").primaryKey(),
  quizId: integer("quizId").notNull(),
  studentId: integer("studentId").notNull(),
  questionId: integer("questionId").notNull(),
  selectedOptionId: integer("selectedOptionId"), // للأسئلة متعددة الخيارات
  textAnswer: text("textAnswer"), // للإجابات النصية
  imageUrl: varchar("imageUrl", { length: 512 }), // لصور الحلول
  score: integer("score"), // الدرجة المعطاة
  feedback: text("feedback"), // التعليقات من المعلم
  submittedAt: timestamp("submittedAt").defaultNow().notNull(),
  gradedAt: timestamp("gradedAt"),
  gradedBy: integer("gradedBy"), // المعلم الذي صحح
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type StudentAnswer = typeof studentAnswers.$inferSelect;
export type InsertStudentAnswer = typeof studentAnswers.$inferInsert;

// Discounts (الحسومات والعروض)
export const discounts = pgTable("discounts", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  discountType: pgEnum("discount_type", ["percentage", "fixed"]).notNull(), // نسبة أو مبلغ ثابت
  discountValue: integer("discountValue").notNull(), // القيمة (نسبة أو مبلغ)
  company: varchar("company", { length: 255 }).notNull(), // اسم الشركة أو المعهد
  imageUrl: varchar("imageUrl", { length: 512 }),
  isActive: boolean("isActive").notNull().default(true),
  createdBy: integer("createdBy").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().$onUpdate(() => new Date()).notNull(),
});

export type Discount = typeof discounts.$inferSelect;
export type InsertDiscount = typeof discounts.$inferInsert;

// Access Permissions (صلاحيات الوصول)
export const accessPermissions = pgTable("access_permissions", {
  id: serial("id").primaryKey(),
  studentId: integer("studentId").notNull(),
  subjectId: integer("subjectId").notNull(),
  hasAccess: boolean("hasAccess").notNull().default(true),
  startDate: timestamp("startDate"),
  endDate: timestamp("endDate"),
  createdBy: integer("createdBy").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().$onUpdate(() => new Date()).notNull(),
});

export type AccessPermission = typeof accessPermissions.$inferSelect;
export type InsertAccessPermission = typeof accessPermissions.$inferInsert;

// Student Progress (تقدم الطالب)
export const studentProgress = pgTable("student_progress", {
  id: serial("id").primaryKey(),
  studentId: integer("studentId").notNull(),
  subjectId: integer("subjectId").notNull(),
  lessonId: integer("lessonId").notNull(),
  isCompleted: boolean("isCompleted").notNull().default(false),
  completedAt: timestamp("completedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().$onUpdate(() => new Date()).notNull(),
});

export type StudentProgress = typeof studentProgress.$inferSelect;
export type InsertStudentProgress = typeof studentProgress.$inferInsert;

// Chat History (سجل الدردشة مع البوت)
export const chatHistory = pgTable("chat_history", {
  id: serial("id").primaryKey(),
  studentId: integer("studentId").notNull(),
  subjectId: integer("subjectId").notNull(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ChatHistory = typeof chatHistory.$inferSelect;
export type InsertChatHistory = typeof chatHistory.$inferInsert;

// Notifications (الإشعارات)
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message").notNull(),
  type: pgEnum("notification_type", ["lesson", "quiz", "discount", "grade", "general"]).notNull(),
  relatedId: integer("relatedId"), // ID of related entity (lesson, quiz, discount, etc)
  isRead: boolean("isRead").notNull().default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;

// Update users table to add userType field
export const usersExtended = pgTable("users_extended", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull().unique(),
  userType: pgEnum("user_type", ["student", "teacher", "admin"]).notNull().default("student"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().$onUpdate(() => new Date()).notNull(),
});

export type UserExtended = typeof usersExtended.$inferSelect;
export type InsertUserExtended = typeof usersExtended.$inferInsert;
