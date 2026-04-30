import {
  index,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const users = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    password: text("password").notNull(),

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
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [index("loan_books_created_at_idx").on(table.createdAt)],
);

const loanBookRole = pgEnum("loan_book_role", ["owner", "member"]);

export const loanBookMembers = pgTable(
  "loan_book_members",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id").notNull(),
    loanBookId: text("loan_book_id").notNull(),
    role: loanBookRole("role").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    index("loan_book_members_user_id_idx").on(table.userId),
    index("loan_book_members_loan_book_id_idx").on(table.loanBookId),
    index("loan_book_members_role_idx").on(table.role),
  ],
);

export const transactions = pgTable(
  "transactions",
  {
    id: serial("id").primaryKey(),
    loanBookId: text("loan_book_id").notNull(),
    type: text("type").notNull(),
    amount: text("amount").notNull(),
    fromUserId: text("from_user_id").notNull(),
    toUserId: text("to_user_id").notNull(),
    note: text("note"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    index("transactions_loan_book_id_idx").on(table.loanBookId),
    index("transactions_from_user_id_idx").on(table.fromUserId),
    index("transactions_to_user_id_idx").on(table.toUserId),
  ],
);

export const invites = pgTable(
  "invites",
  {
    id: serial("id").primaryKey(),
    loanBookId: text("loan_book_id").notNull(),
    invitedByUserId: text("invited_by_user_id").notNull(),
    identifier: text("identifier").notNull(),
    status: text("status"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    index("invites_loan_book_id_idx").on(table.loanBookId),
    index("invites_identifier_idx").on(table.identifier),
    index("invites_status_idx").on(table.status),
    index("invited_user_id_idx").on(table.invitedByUserId),
  ],
);
