import { and, eq, SQL } from "drizzle-orm";
import { getDb } from "..";
import { TransactionCreate, transactions } from "../schema";

async function create(tx: TransactionCreate) {
  const db = getDb();
  const [created] = await db.insert(transactions).values(tx).returning();
  return created;
}

async function get(id: number) {
  const db = getDb();
  const [tx] = await db
    .select()
    .from(transactions)
    .where(eq(transactions.id, id))
    .limit(1);
  return tx;
}

interface GetManyFilters {
  loanBookId?: number;
  authorId?: number;
  type?: string;
  parentId?: number;
}

async function getMany(filters?: GetManyFilters) {
  const db = getDb();
  let bookWhere: SQL | undefined = undefined;
  let authorWhere: SQL | undefined = undefined;
  let typeWhere: SQL | undefined = undefined;
  let parentWhere: SQL | undefined = undefined;

  if (filters?.loanBookId) {
    bookWhere = eq(transactions.loanBookId, filters.loanBookId);
  }
  if (filters?.authorId) {
    authorWhere = eq(transactions.authorId, filters.authorId);
  }
  if (filters?.type) {
    typeWhere = eq(transactions.type, filters.type);
  }
  if (filters?.parentId !== undefined) {
    parentWhere = eq(transactions.parentId, filters.parentId);
  }

  return await db
    .select()
    .from(transactions)
    .where(and(bookWhere, authorWhere, typeWhere, parentWhere));
}

async function getChildren(parentId: number) {
  const db = getDb();
  return await db
    .select()
    .from(transactions)
    .where(eq(transactions.parentId, parentId));
}

async function update(id: number, details: Partial<Omit<TransactionCreate, "id">>) {
  const db = getDb();
  const [updated] = await db
    .update(transactions)
    .set(details)
    .where(eq(transactions.id, id))
    .returning();
  return updated;
}

async function remove(id: number) {
  const db = getDb();
  const [deleted] = await db
    .delete(transactions)
    .where(eq(transactions.id, id))
    .returning();
  return deleted;
}

export const transactionsRepo = {
  create,
  get,
  getMany,
  getChildren,
  update,
  remove,
};