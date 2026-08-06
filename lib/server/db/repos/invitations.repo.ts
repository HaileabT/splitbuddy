import { and, eq, SQL } from "drizzle-orm";
import { getDb } from "..";
import { InvitationCreate, invitations } from "../schema";

async function create(invitation: InvitationCreate) {
  const db = getDb();
  if (invitation.invitedUserEmail) {
    invitation.invitedUserEmail = invitation.invitedUserEmail.toLowerCase();
  }
  const [created] = await db.insert(invitations).values(invitation).returning();
  return created;
}

async function get(id: number) {
  const db = getDb();
  const [invitation] = await db
    .select()
    .from(invitations)
    .where(eq(invitations.id, id))
    .limit(1);
  return invitation;
}

async function getByKey(key: string) {
  const db = getDb();
  const [invitation] = await db
    .select()
    .from(invitations)
    .where(eq(invitations.key, key))
    .limit(1);
  return invitation;
}

async function getByBook(loanBookId: number) {
  const db = getDb();
  return await db
    .select()
    .from(invitations)
    .where(eq(invitations.loanBookId, loanBookId));
}

interface GetManyFilters {
  loanBookId?: number;
  invitedByUserId?: number;
  invitedUserEmail?: string;
  status?: "pending" | "cancelled" | "accepted";
}

async function getMany(filters?: GetManyFilters) {
  const db = getDb();
  let bookWhere: SQL | undefined = undefined;
  let invitorWhere: SQL | undefined = undefined;
  let emailWhere: SQL | undefined = undefined;
  let statusWhere: SQL | undefined = undefined;

  if (filters?.loanBookId) {
    bookWhere = eq(invitations.loanBookId, filters.loanBookId);
  }
  if (filters?.invitedByUserId) {
    invitorWhere = eq(invitations.invitedByUserId, filters.invitedByUserId);
  }
  if (filters?.invitedUserEmail) {
    emailWhere = eq(invitations.invitedUserEmail, filters.invitedUserEmail.toLowerCase());
  }
  if (filters?.status) {
    statusWhere = eq(invitations.status, filters.status);
  }

  return await db
    .select()
    .from(invitations)
    .where(and(bookWhere, invitorWhere, emailWhere, statusWhere));
}

async function update(id: number, details: Partial<Omit<InvitationCreate, "id">>) {
  const db = getDb();
  if (details.invitedUserEmail) {
    details.invitedUserEmail = details.invitedUserEmail.toLowerCase();
  }
  const [updated] = await db
    .update(invitations)
    .set(details)
    .where(eq(invitations.id, id))
    .returning();
  return updated;
}

async function remove(id: number) {
  const db = getDb();
  const [deleted] = await db
    .delete(invitations)
    .where(eq(invitations.id, id))
    .returning();
  return deleted;
}

export const invitationsRepo = {
  create,
  get,
  getByKey,
  getByBook,
  getMany,
  update,
  remove,
};