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
  if (isNaN(amountNum) || amountNum === 0) {
    throw new ApiError("Transaction amount cannot be zero", 400);
  }

  const dataToCreate = {
    ...data,
    amount: amountNum.toFixed(2),
  };

  const createdTx = await transactionsRepo.create(dataToCreate);

  // Directly update cumulative book amount with raw transaction amount
  const currentBookAmount = Number(book.amount || "0.00");
  const newBookAmount = (currentBookAmount + amountNum).toFixed(2);
  await booksRepo.update(book.id, { amount: newBookAmount });

  return createdTx;
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

  const updatedDetails = { ...details };

  if (details.amount !== undefined) {
    const newAmountNum = parseFloat(details.amount);
    if (isNaN(newAmountNum) || newAmountNum === 0) {
      throw new ApiError("Transaction amount cannot be zero", 400);
    }

    const oldTxAmountNum = Number(tx.amount || "0.00");
    const diff = newAmountNum - oldTxAmountNum;

    updatedDetails.amount = newAmountNum.toFixed(2);

    if (diff !== 0) {
      const book = await booksRepo.get(tx.loanBookId);
      if (book) {
        const currentBookAmount = Number(book.amount || "0.00");
        const newBookAmount = (currentBookAmount + diff).toFixed(2);
        await booksRepo.update(book.id, { amount: newBookAmount });
      }
    }
  }

  return await transactionsRepo.update(id, updatedDetails);
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

  const removed = await transactionsRepo.remove(id);

  const book = await booksRepo.get(tx.loanBookId);
  if (book) {
    const txAmountNum = Number(tx.amount || "0.00");
    const currentBookAmount = Number(book.amount || "0.00");
    const newBookAmount = (currentBookAmount - txAmountNum).toFixed(2);
    await booksRepo.update(book.id, { amount: newBookAmount });
  }

  return removed;
}

export const transactionServices = {
  create,
  get,
  getByBook,
  getMany,
  update,
  remove,
};