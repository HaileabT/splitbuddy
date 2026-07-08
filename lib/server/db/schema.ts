import { relations } from "drizzle-orm";
import {
  index,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const users = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    password: text("password"),

    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [index("users_email_idx").on(table.email)],
);

export const loanBooks = pgTable(
  "loan_books",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", {length: 128}),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [index("loan_books_created_at_idx").on(table.createdAt), index("loan_books_name_idx").on(table.name)],
);

export const loanBookRole = pgEnum("loan_book_role", ["owner", "member"]);

export const loanBookMembers = pgTable(
  "loan_book_members",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id").references(() => users.id).notNull(),
    loanBookId: integer("loan_book_id").references(() => loanBooks.id).notNull(),
    role: loanBookRole("role").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    index("loan_book_members_user_id_idx").on(table.userId),
    index("loan_book_members_loan_book_id_idx").on(table.loanBookId),
    index("loan_book_members_roles_on_book_ids_idx").on(table.role, table.loanBookId),
    index("loan_book_members_role_idx").on(table.role),
    index("loan_book_member_ids_on_roles_idx").on(table.role, table.userId)
  ],
);

export const transactions = pgTable(
  "transactions",
  {
    id: serial("id").primaryKey(),
    loanBookId: integer("loan_book_id").references(() => loanBooks.id).notNull(),
    type: text("type").notNull(),
    amount: text("amount").notNull(),
    authorId: integer("authorId").references(() => users.id).notNull(),
    note: text("note"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    index("transactions_loan_book_id_idx").on(table.loanBookId),
    index("transactions_user_id_idx").on(table.authorId),
  ],
);

export const invitationStatus = pgEnum("invitation_status", ["pending", "cancelled", "accepted"])

export const invitations = pgTable(
  "invitations",
  {
    id: serial("id").primaryKey(),
    loanBookId: integer("loan_book_id").references(() => loanBooks.id).notNull(),
    invitedByUserId: integer("invited_by_user_id").references(() => users.id).notNull(),
    invitedUserEmail: text("invited_user_email").notNull(),
    key: text("key").notNull(),
    status: invitationStatus(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    index("invitations_loan_book_id_idx").on(table.loanBookId),
    index("invitations_identifier_idx").on(table.key),
    index("invitations_status_idx").on(table.status),
    index("invited_user_id_idx").on(table.invitedByUserId),
  ],
);


export type User = typeof users.$inferSelect;
export type UserCreate = typeof users.$inferInsert;

export type LoanBook = typeof loanBooks.$inferSelect;
export type LoanBookCreate = typeof loanBooks.$inferInsert;

export type LoanBookMember = typeof loanBookMembers.$inferSelect;
export type LoanBookMemberCreate = typeof loanBookMembers.$inferInsert;

export type Invitation = typeof invitations.$inferSelect;
export type InvitationCreate = typeof invitations.$inferInsert;

export type Transaction = typeof transactions.$inferSelect;
export type TransactionCreate = typeof transactions.$inferInsert;