import { and, eq, SQL } from "drizzle-orm";
import { getDb } from "..";
import { LoanBookMemberCreate, loanBookMembers } from "../schema";

async function create(member: LoanBookMemberCreate) {
  const db = getDb();
  const [createdMember] = await db.insert(loanBookMembers).values(member).returning();
  return createdMember;
}

async function get(id: number) {
  const db = getDb();
  const [member] = await db
    .select()
    .from(loanBookMembers)
    .where(eq(loanBookMembers.id, id))
    .limit(1);
  return member;
}

async function getMember(loanBookId: number, userId: number) {
  const db = getDb();
  const [member] = await db
    .select()
    .from(loanBookMembers)
    .where(
      and(
        eq(loanBookMembers.loanBookId, loanBookId),
        eq(loanBookMembers.userId, userId)
      )
    )
    .limit(1);
  return member;
}

interface GetManyFilters {
  userId?: number;
  bookId?: number;
  role?: "owner" | "member";
}

async function getMany(filters?: GetManyFilters) {
  const db = getDb();
  let userIdWhere: SQL | undefined = undefined;
  let bookIdWhere: SQL | undefined = undefined;
  let roleWhere: SQL | undefined = undefined;

  if (filters?.userId) {
    userIdWhere = eq(loanBookMembers.userId, filters.userId);
  }
  if (filters?.bookId) {
    bookIdWhere = eq(loanBookMembers.loanBookId, filters.bookId);
  }
  if (filters?.role) {
    roleWhere = eq(loanBookMembers.role, filters.role);
  }

  const members = await db
    .select()
    .from(loanBookMembers)
    .where(and(userIdWhere, bookIdWhere, roleWhere));

  return members;
}

async function update(id: number, details: Partial<Omit<LoanBookMemberCreate, "id">>) {
  const db = getDb();
  const [updated] = await db
    .update(loanBookMembers)
    .set(details)
    .where(eq(loanBookMembers.id, id))
    .returning();
  return updated;
}

async function remove(id: number) {
  const db = getDb();
  const [deleted] = await db
    .delete(loanBookMembers)
    .where(eq(loanBookMembers.id, id))
    .returning();
  return deleted;
}

async function removeByBookAndUser(loanBookId: number, userId: number) {
  const db = getDb();
  const [deleted] = await db
    .delete(loanBookMembers)
    .where(
      and(
        eq(loanBookMembers.loanBookId, loanBookId),
        eq(loanBookMembers.userId, userId)
      )
    )
    .returning();
  return deleted;
}

export const membersRepo = {
  create,
  get,
  getMember,
  getMany,
  update,
  remove,
  removeByBookAndUser,
};