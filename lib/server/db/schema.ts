import { relations } from "drizzle-orm";
import {
  AnyPgColumn,
  decimal,
  index,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const loanBooks = pgTable(
  "loan_books",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 128 }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [index("loan_books_created_at_idx").on(table.createdAt), index("loan_books_name_idx").on(table.name)],
);

export const loanBookRelations = relations(loanBooks, ({ many }) => {
  return {
    members: many(loanBookMembers, {
      relationName: "loan_book_members"
    }),
    invitations: many(invitations, {
      relationName: "loan_book_invitations"
    }),
    transactions: many(transactions, {
      relationName: 'loan_book_transactions'
    })
  }
})

export const loanBookRole = pgEnum("loan_book_role", ["owner", "member"]);

export const loanBookMembers = pgTable(
  "loan_book_members",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id").references(() => accounts.id, { onDelete: "cascade", onUpdate: "cascade" }).notNull(),
    loanBookId: integer("loan_book_id").references(() => loanBooks.id, { onDelete: "cascade", onUpdate: "cascade" }).notNull(),
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

export const loanBookMemberRelations = relations(loanBookMembers, ({ one }) => {
  return {
    member: one(accounts, {
      fields: [loanBookMembers.userId],
      references: [accounts.id],
      relationName: "user_loan_books"
    }),
    loanBook: one(loanBooks, {
      fields: [loanBookMembers.loanBookId],
      references: [loanBooks.id],
      relationName: "loan_book_members"
    })
  }
})

export const transactions = pgTable(
  "transactions",
  {
    id: serial("id").primaryKey(),
    loanBookId: integer("loan_book_id").references(() => loanBooks.id, { onDelete: "cascade", onUpdate: "cascade" }).notNull(),
    type: text("type").notNull(),
    amount: decimal("amount", {
      precision: 15,
      scale: 2
    }).notNull(),
    paidAmount: decimal("paid_amount", {
      precision: 15,
      scale: 2
    }),
    authorId: integer("authorId").references(() => accounts.id, { onDelete: "cascade", onUpdate: "cascade" }).notNull(),
    parentId: integer("parent_id").references((): AnyPgColumn => transactions.id, { onDelete: "cascade", onUpdate: "cascade" }),
    note: text("note"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    index("transactions_loan_book_id_idx").on(table.loanBookId),
    index("transactions_user_id_idx").on(table.authorId),
  ],
);



export const transactionRelations = relations(transactions, ({ one, many }) => ({
  author: one(accounts, {
    fields: [transactions.authorId],
    references: [accounts.id],
    relationName: "author"
  }),
  loanBook: one(loanBooks, {
    fields: [transactions.loanBookId],
    references: [loanBooks.id],
    relationName: "loan_book_transactions"
  }),

  parent: one(transactions, {
    fields: [transactions.parentId],
    references: [transactions.id],
    relationName: "parent",
  }),

  children: many(transactions, {
    relationName: "parent",
  }),
}));

export const invitationStatus = pgEnum("invitation_status", ["pending", "cancelled", "accepted"])

export const invitations = pgTable(
  "invitations",
  {
    id: serial("id").primaryKey(),
    loanBookId: integer("loan_book_id").references(() => loanBooks.id, { onDelete: 'cascade', onUpdate: "cascade" }).notNull(),
    invitedByUserId: integer("invited_by_user_id").references(() => accounts.id, { onDelete: "cascade", onUpdate: "cascade" }).notNull(),
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

export const invitationRelations = relations(invitations, ({ one, many }) => ({
  invitor: one(accounts, {
    fields: [invitations.invitedByUserId],
    references: [accounts.id],
    relationName: "invitor"
  }),
  loanBook: one(loanBooks, {
    fields: [invitations.loanBookId],
    references: [loanBooks.id],
    relationName: "loan_book_invitations"
  }),
}));

export const accounts = pgTable("accounts", {
  id: serial("id").primaryKey(),
  name: text("name"),
  email: text("email").unique().notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow()
})

export const accountRelations = relations(accounts, ({ many }) => ({
  loanBooks: many(loanBookMembers),
  invitations: many(invitations),
  transactions: many(transactions)
}))


export type Account = typeof accounts.$inferSelect;
export type AccountCreate = typeof accounts.$inferInsert;

export type LoanBook = typeof loanBooks.$inferSelect;
export type LoanBookCreate = typeof loanBooks.$inferInsert;

export type LoanBookMember = typeof loanBookMembers.$inferSelect;
export type LoanBookMemberCreate = typeof loanBookMembers.$inferInsert;

export type Invitation = typeof invitations.$inferSelect;
export type InvitationCreate = typeof invitations.$inferInsert;

export type Transaction = typeof transactions.$inferSelect;
export type TransactionCreate = typeof transactions.$inferInsert;