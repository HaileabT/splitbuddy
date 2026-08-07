import { accountsRepo, booksRepo, invitationsRepo, membersRepo } from "../db/repos";
import { LoanBook, LoanBookMember } from "../db/schema";
import { ApiError } from "../error";

type UserBooksType = (LoanBook & { membership: LoanBookMember })[];

async function checkDuplicateBook(
  userId: number,
  bookName: string,
  invitedUserEmail: string
) {
  const userBooks = await getUserBooks(userId);
  const targetEmail = invitedUserEmail.toLowerCase().trim();
  const targetName = bookName.toLowerCase().trim();

  const matchingBooks = userBooks.filter(
    (b) => b.name?.toLowerCase().trim() === targetName
  );

  for (const book of matchingBooks) {
    const existingInvites = await invitationsRepo.getMany({
      loanBookId: book.id,
      invitedUserEmail: targetEmail,
    });
    const activeInvites = existingInvites.filter(
      (inv) => inv.status !== "cancelled"
    );
    if (activeInvites.length > 0) {
      throw new ApiError(
        "A book with this name and invited member already exists",
        409
      );
    }

    const invitedAccount = await accountsRepo.getByEmail(targetEmail);
    if (invitedAccount) {
      const existingMember = await membersRepo.getMember(
        book.id,
        invitedAccount.id
      );
      if (existingMember) {
        throw new ApiError(
          "A book with this name and invited member already exists",
          409
        );
      }
    }
  }
}

async function getSumOfAmountsForUser(userId: number) {
  const books = await getUserBooks(userId);
  let amount = 0;

  for (const book of books) {
    if (book.membership.role === "owner") {
      amount += Number(book.amount || "0.00");
    } else {
      amount -= Number(book.amount || "0.00");
    }
  }

  return amount;
}

async function create(name: string, userId: number) {
  if (!name.trim()) {
    throw new ApiError("Book name is required", 400);
  }
  const account = await accountsRepo.get(userId);
  if (!account) {
    throw new ApiError("User account not found", 404);
  }

  const book = await booksRepo.create({ name: name.trim() });
  const membership = await membersRepo.create({
    userId,
    loanBookId: book.id,
    role: "owner",
  });

  return { ...book, membership };
}

async function getUserBooks(userId: number): Promise<UserBooksType> {
  const memberships = await membersRepo.getMany({ userId });
  if (!memberships || memberships.length < 1) {
    return [];
  }

  const data: UserBooksType = [];

  for (const m of memberships) {
    const book = await booksRepo.get(m.loanBookId);
    if (!book) continue;
    data.push({ ...book, membership: m });
  }

  return data;
}

async function get(id: number) {
  const book = await booksRepo.get(id);
  if (!book) {
    throw new ApiError("Book not found", 404);
  }
  return book;
}

async function getMembers(bookId: number) {
  const book = await booksRepo.get(bookId);
  if (!book) {
    throw new ApiError("Book not found", 404);
  }

  const members = await membersRepo.getMany({ bookId });
  const result = [];

  for (const m of members) {
    const account = await accountsRepo.get(m.userId);
    result.push({
      ...m,
      user: account || null,
    });
  }

  return result;
}

async function update(id: number, userId: number, name: string) {
  const book = await booksRepo.get(id);
  if (!book) {
    throw new ApiError("Book not found", 404);
  }

  const membership = await membersRepo.getMember(id, userId);
  if (!membership) {
    throw new ApiError("You are not a member of this book", 403);
  }

  return await booksRepo.update(id, { name: name.trim() });
}

async function remove(id: number, userId: number) {
  const book = await booksRepo.get(id);
  if (!book) {
    throw new ApiError("Book not found", 404);
  }

  const membership = await membersRepo.getMember(id, userId);
  if (!membership || membership.role !== "owner") {
    throw new ApiError("Only the book owner can delete this book", 403);
  }

  return await booksRepo.remove(id);
}

async function addMember(
  bookId: number,
  userId: number,
  role: "owner" | "member" = "member"
) {
  const book = await booksRepo.get(bookId);
  if (!book) {
    throw new ApiError("Book not found", 404);
  }

  const existing = await membersRepo.getMember(bookId, userId);
  if (existing) {
    throw new ApiError("User is already a member of this book", 409);
  }

  return await membersRepo.create({
    userId,
    loanBookId: bookId,
    role,
  });
}

async function removeMember(
  bookId: number,
  targetUserId: number,
  requestingUserId: number
) {
  const book = await booksRepo.get(bookId);
  if (!book) {
    throw new ApiError("Book not found", 404);
  }

  const reqMember = await membersRepo.getMember(bookId, requestingUserId);
  if (!reqMember) {
    throw new ApiError("You are not a member of this book", 403);
  }

  // User can remove themselves, or an owner can remove any member
  if (targetUserId !== requestingUserId && reqMember.role !== "owner") {
    throw new ApiError("Only book owners can remove other members", 403);
  }

  return await membersRepo.removeByBookAndUser(bookId, targetUserId);
}

async function getBookOwner(id: number) {
  const book = await booksRepo.get(id);
  if (!book) {
    throw new ApiError("Book not found", 404);
  }

  const members = await membersRepo.getMany({ bookId: id });
  if (members && members.length > 0) {
    const owner = members.find((m) => m.role === "owner");
    if (!owner) {
      throw new ApiError("Book owner not found", 404);
    }
    const account = await accountsRepo.get(owner.userId);
    return account;
  } else {
    throw new ApiError("Book has no members", 404);
  }
}

export const bookServices = {
  create,
  checkDuplicateBook,
  getUserBooks,
  get,
  getMembers,
  update,
  remove,
  addMember,
  removeMember,
  getSumOfAmountsForUser,
  getBookOwner
};