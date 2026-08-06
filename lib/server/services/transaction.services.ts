import { booksRepo, membersRepo, transactionsRepo } from "../db/repos";
import { TransactionCreate } from "../db/schema";
import { ApiError } from "../error";

async function create(data: TransactionCreate) {
  const book = await booksRepo.get(data.loanBookId);
  if (!book) {
    throw new ApiError("Book not found", 404);
  }

  const membership = await membersRepo.getMember(data.loanBookId, data.authorId);
  if (!membership) {
    throw new ApiError("You must be a member of this book to add transactions", 403);
  }

  const amountNum = parseFloat(data.amount);
  if (isNaN(amountNum) || amountNum <= 0) {
    throw new ApiError("Transaction amount must be greater than 0", 400);
  }

  return await transactionsRepo.create(data);
}

async function get(id: number) {
  const tx = await transactionsRepo.get(id);
  if (!tx) {
    throw new ApiError("Transaction not found", 404);
  }
  return tx;
}

async function getByBook(loanBookId: number) {
  const book = await booksRepo.get(loanBookId);
  if (!book) {
    throw new ApiError("Book not found", 404);
  }
  return await transactionsRepo.getMany({ loanBookId });
}

async function getMany(filters?: {
  loanBookId?: number;
  authorId?: number;
  type?: string;
  parentId?: number;
}) {
  return await transactionsRepo.getMany(filters);
}

async function update(
  id: number,
  requestingUserId: number,
  details: Partial<Omit<TransactionCreate, "id" | "loanBookId">>
) {
  const tx = await transactionsRepo.get(id);
  if (!tx) {
    throw new ApiError("Transaction not found", 404);
  }

  const membership = await membersRepo.getMember(tx.loanBookId, requestingUserId);
  if (!membership || (tx.authorId !== requestingUserId && membership.role !== "owner")) {
    throw new ApiError("You do not have permission to edit this transaction", 403);
  }

  if (details.amount !== undefined) {
    const amountNum = parseFloat(details.amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      throw new ApiError("Transaction amount must be greater than 0", 400);
    }
  }

  return await transactionsRepo.update(id, details);
}

async function remove(id: number, requestingUserId: number) {
  const tx = await transactionsRepo.get(id);
  if (!tx) {
    throw new ApiError("Transaction not found", 404);
  }

  const membership = await membersRepo.getMember(tx.loanBookId, requestingUserId);
  if (!membership || (tx.authorId !== requestingUserId && membership.role !== "owner")) {
    throw new ApiError("You do not have permission to delete this transaction", 403);
  }

  return await transactionsRepo.remove(id);
}

export const transactionServices = {
  create,
  get,
  getByBook,
  getMany,
  update,
  remove,
};