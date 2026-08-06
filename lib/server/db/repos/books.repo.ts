import { and, eq, ilike, inArray, SQL } from "drizzle-orm";
import { getDb } from "..";
import { LoanBookCreate, loanBooks } from "../schema";

async function create(book: LoanBookCreate) {
  const db = getDb();
  const [createdBook] = await db.insert(loanBooks).values(book).returning();
  return createdBook;
}

async function get(id: number) {
  const db = getDb();
  const [book] = await db.select().from(loanBooks).where(eq(loanBooks.id, id)).limit(1);
  return book;
}

interface GetManyFilters {
  ids?: number[];
  name?: string;
}

async function getMany(filters?: GetManyFilters) {
  const db = getDb();
  let idsWhere: SQL | undefined = undefined;
  if (filters?.ids && filters.ids.length > 0) {
    idsWhere = inArray(loanBooks.id, filters.ids);
  }
  let titleWhere: SQL | undefined = undefined;
  if (filters?.name) {
    titleWhere = ilike(loanBooks.name, `%${filters.name}%`);
  }
  const books = await db.select().from(loanBooks).where(and(idsWhere, titleWhere));

  return books;
}

async function update(id: number, newBookDetails: Partial<Omit<LoanBookCreate, "id">>) {
  const db = getDb();
  const [updatedBook] = await db
    .update(loanBooks)
    .set(newBookDetails)
    .where(eq(loanBooks.id, id))
    .returning();
  return updatedBook;
}

async function remove(id: number) {
  const db = getDb();
  const [deletedBook] = await db
    .delete(loanBooks)
    .where(eq(loanBooks.id, id))
    .returning();
  return deletedBook;
}

export const booksRepo = { create, remove, get, getMany, update };