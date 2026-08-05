import { and, eq, ilike, inArray, SQL } from "drizzle-orm";
import { getDb } from ".."
import { loanBooks } from "../schema";

function create() {
    const db = getDb();


}

async function get(id: number) {
    const db = getDb()
    const [book] = await db.select().from(loanBooks).where(eq(loanBooks.id, id)).limit(1);
    return book;
}

interface GetManyFilters {
    ids?: number[],
    name?: string,
}

async function getMany(filters: GetManyFilters) {
    const db = getDb();
    let idsWhere: SQL | undefined = undefined;
    if (filters.ids) {
        idsWhere = inArray(loanBooks.id, filters.ids)
    }
    let titleWhere: SQL | undefined = undefined;
    if (filters.name) {
        titleWhere = ilike(loanBooks.name, filters.name)
    }
    const books = await db.select().from(loanBooks).where(and(idsWhere, titleWhere));

    return books;
}

function update() {

}


function remove() {

}

export const booksRepo = { create, remove, get, getMany, update }