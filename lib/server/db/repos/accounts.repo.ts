import { and, eq, SQL } from "drizzle-orm";
import { getDb } from "..";
import { AccountCreate, accounts } from "../schema";
const db = getDb();

async function create(account: AccountCreate) {
    account.email = account.email.toLowerCase();
    const [createdAccount] = await db.insert(accounts).values(account).returning();
    return createdAccount;
}

async function get(id: number) {
    const [account] = await db.select().from(accounts).where(eq(accounts.id, id)).limit(1);
    return account;
}

async function getByEmail(email: string) {
    const [account] = await db.select().from(accounts).where(eq(accounts.email, email.toLowerCase())).limit(1);
    return account;
}

interface GetManyFilters {
    name?: string,
}

async function getMany(filters?: GetManyFilters) {
    let nameWhere: SQL | undefined = undefined;
    if (filters?.name) {
        nameWhere = eq(accounts.name, filters.name)
    }

    return await db.select().from(accounts).where(and(nameWhere));
}

async function update(id: number, newAccountDetails: Partial<Omit<AccountCreate, "id">>) {
    const [updatedAccount] = await db.update(accounts).set(newAccountDetails).where(eq(accounts.id, id)).returning();
    return updatedAccount;
}

async function remove(id: number) {
    return await db.delete(accounts).where(eq(accounts.id, id))
}

export const accountsRepo = { create, get, getByEmail, getMany, update, remove }