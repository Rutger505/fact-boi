import {
  bigint,
  boolean,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const DIFFICULTY = {
  EASY: "easy",
  MEDIUM: "medium",
  HARD: "hard",
} as const;
export type Difficulty = (typeof DIFFICULTY)[keyof typeof DIFFICULTY];
export const difficultyEnum = pgEnum("difficulty", ["easy", "medium", "hard"]);

export const QUESTION_TYPE = {
  MULTIPLE_CHOICE: "multiple_choice",
  BOOLEAN: "boolean",
} as const;
export type QuestionType = (typeof QUESTION_TYPE)[keyof typeof QUESTION_TYPE];
export const questionTypeEnum = pgEnum("question_type", [
  "multiple_choice",
  "boolean",
]);

export const users = pgTable("users", {
  id: bigint("id", { mode: "number" }).primaryKey(), // Discord ID
  displayName: text("display_name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const questions = pgTable("questions", {
  id: serial("id").primaryKey(),
  messageId: bigint("message_id", { mode: "number" }).notNull(), // Discord Message ID
  category: varchar("category").notNull(),
  type: questionTypeEnum("type").notNull(),
  difficulty: difficultyEnum("difficulty").notNull(),
  question: text("question").notNull().unique(),
  answers: text("answers").array().notNull(),
  incorrectAnswers: text("incorrect_answers").array().notNull(),
  correctAnswer: text("correct_answer").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const userAnswers = pgTable("user_answers", {
  id: serial("id").primaryKey(),
  userId: bigint("user_id", { mode: "number" })
    .notNull()
    .references(() => users.id), // Discord ID
  questionId: bigint("question_id", { mode: "number" })
    .notNull()
    .references(() => questions.id), // Discord Message ID
  answer: text("answer").notNull(),
  isCorrect: boolean("is_correct").notNull(),
  answeredAt: timestamp("answered_at").defaultNow().notNull(),
});

// Relations
export const questionsRelations = relations(questions, ({ many }) => ({
  userAnswers: many(userAnswers),
}));

export const usersRelations = relations(users, ({ many }) => ({
  answers: many(userAnswers),
}));

export const userAnswersRelations = relations(userAnswers, ({ one }) => ({
  user: one(users, {
    fields: [userAnswers.userId],
    references: [users.id],
  }),
  question: one(questions, {
    fields: [userAnswers.questionId],
    references: [questions.id],
  }),
}));
