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

export const userRelations = relations(users, ({many}) => {
  return {
    loanBooks: many(loanBookMembers, {
      relationName: "user_loan_book_membership"
    }),
    transactions: many(transactions, {
      relationName: 'transaction_author'
    }),
    invitations: many(invitations, {
      relationName: 'user_invitations'
    })
  }
})

export const loanBooks = pgTable(
  "loan_books",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", {length: 128}),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [index("loan_books_created_at_idx").on(table.createdAt), index("loan_books_name_idx").on(table.name)],
);

export const loanBookRelations = relations(loanBooks, ({many}) => {
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

export const loanBookMemberRelations = relations(loanBookMembers, ({one}) => {
  return {
    member: one(users, {
      fields: [loanBookMembers.userId],
      references: [users.id],
      relationName: "user_loan_book_membership",
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
    loanBookId: integer("loan_book_id").references(() => loanBooks.id).notNull(),
    type: text("type").notNull(),
    amount: decimal("amount", {
      precision: 15,
      scale: 2
    }).notNull(),
    paidAmount: decimal("paid_amount", {
      precision: 15,
      scale: 2
    }),
    authorId: integer("authorId").references(() => users.id).notNull(),
    parentId: integer("parent_id").references((): AnyPgColumn => transactions.id),
    note: text("note"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    index("transactions_loan_book_id_idx").on(table.loanBookId),
    index("transactions_user_id_idx").on(table.authorId),
  ],
);



export const transactionRelations = relations(transactions, ({ one, many }) => ({
  author: one(users, {
    fields: [transactions.authorId],
    references: [users.id],
    relationName: "transaction_author",
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

export const invitationRelations = relations(invitations, ({ one, many }) => ({
  author: one(users, {
    fields: [invitations.invitedByUserId],
    references: [users.id],
    relationName: "user_invitations",
  }),
  loanBook: one(loanBooks, {
    fields: [invitations.loanBookId],
    references: [loanBooks.id],
    relationName: "loan_book_invitations"
  }),
}));


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