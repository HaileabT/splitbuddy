import { and, eq, SQL } from "drizzle-orm";
import { getDb } from ".."
import { loanBookMembers } from "../schema";

function create() {

}

interface GetManyFilters {
    userId?: string,
    bookId?: number,
}

async function getMany(filters?: GetManyFilters) {
    const db = getDb();
    let userIdWhere: SQL | undefined = undefined;
    let bookIdWhere: SQL | undefined = undefined
    if (filters?.userId) {
        userIdWhere = eq(loanBookMembers.userId, filters.userId);
    }

    if (filters?.bookId) {
        bookIdWhere = eq(loanBookMembers.loanBookId, filters.bookId)
    }

    const members = await db.select().from(loanBookMembers).where(and(userIdWhere, bookIdWhere));

    return members;
}

function get() {

}

function remove() {

}

export const membersRepo = { create, get, getMany, remove }