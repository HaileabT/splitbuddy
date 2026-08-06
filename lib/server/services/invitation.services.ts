import { validateEmail } from "@/lib/utils/strings";
import { accountsRepo, booksRepo, invitationsRepo, membersRepo } from "../db/repos";
import { ApiError } from "../error";
import { sendInvitationEmail } from "../resend/senders";
import { getServerAuth } from "../supabase/auth";

async function create(
  loanBookId: number,
  invitedByUserId: number,
  invitedUserEmail: string
) {

  const supabase = await getServerAuth();

  const invitor = await supabase.auth.getUser();
  if (!invitor.data.user?.id) {
    throw new ApiError("Please login first", 401)
  }

  const email = invitedUserEmail.toLowerCase().trim();
  if (!validateEmail(email)) {
    throw new ApiError("Invalid email address", 400);
  }

  const book = await booksRepo.get(loanBookId);
  if (!book) {
    throw new ApiError("Book not found", 404);
  }


  const invitorMembership = await membersRepo.getMember(loanBookId, invitedByUserId);
  if (!invitorMembership) {
    throw new ApiError("You must be a member of this book to send invitations", 403);
  }



  const invitedUser = await accountsRepo.getByEmail(email);
  if (invitedUser) {
    const isMember = await membersRepo.getMember(loanBookId, invitedUser.id);
    if (isMember) {
      throw new ApiError("User is already a member of this book", 409);
    }
  }

  const key = crypto.randomUUID();

  const invitationLink = `${process.env.APP_BASE_URL}/api/invitations/p/${key}`;

  await sendInvitationEmail(invitor.data.user.user_metadata.name, email, invitationLink, book.name || undefined)

  return await invitationsRepo.create({
    loanBookId,
    invitedByUserId,
    invitedUserEmail: email,
    key,
    status: "pending",
  });
}

async function get(id: number) {
  const invitation = await invitationsRepo.get(id);
  if (!invitation) {
    throw new ApiError("Invitation not found", 404);
  }
  return invitation;
}

async function getByKey(key: string) {
  const invitation = await invitationsRepo.getByKey(key);
  if (!invitation) {
    throw new ApiError("Invitation not found", 404);
  }
  return invitation;
}

async function getByBook(loanBookId: number) {
  return await invitationsRepo.getByBook(loanBookId);
}

async function getByUserAndBook(loanBookId: number, userEmail: string) {
  const invitation = await invitationsRepo.getMany({ loanBookId, invitedUserEmail: userEmail })
  return (invitation || [])[0]
}

async function accept(key: string, acceptingUserId: number) {
  const invitation = await invitationsRepo.getByKey(key);
  if (!invitation) {
    throw new ApiError("Invitation not found", 404);
  }

  if (invitation.status !== "pending") {
    throw new ApiError(`Invitation is already ${invitation.status}`, 400);
  }

  const user = await accountsRepo.get(acceptingUserId);
  if (!user) {
    throw new ApiError("User account not found", 404);
  }

  // Check if user is already a member
  const existingMember = await membersRepo.getMember(invitation.loanBookId, acceptingUserId);
  if (!existingMember) {
    await membersRepo.create({
      userId: acceptingUserId,
      loanBookId: invitation.loanBookId,
      role: "member",
    });
  }

  return await invitationsRepo.update(invitation.id, { status: "accepted" });
}

async function cancel(id: number, requestingUserId: number) {
  const invitation = await invitationsRepo.get(id);
  if (!invitation) {
    throw new ApiError("Invitation not found", 404);
  }

  const membership = await membersRepo.getMember(invitation.loanBookId, requestingUserId);
  if (!membership || (invitation.invitedByUserId !== requestingUserId && membership.role !== "owner")) {
    throw new ApiError("You do not have permission to cancel this invitation", 403);
  }

  return await invitationsRepo.update(id, { status: "cancelled" });
}

async function getMany(filters?: {
  loanBookId?: number;
  invitedByUserId?: number;
  invitedUserEmail?: string;
  status?: "pending" | "cancelled" | "accepted";
}) {
  return await invitationsRepo.getMany(filters);
}

export const invitationServices = {
  create,
  get,
  getByKey,
  getByBook,
  getByUserAndBook,
  accept,
  cancel,
  getMany,
};