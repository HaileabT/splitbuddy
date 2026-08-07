import { validateEmail } from "@/lib/utils/strings";
import { accountsRepo } from "../db/repos";
import { ApiError } from "../error";
import { getServerAuth } from "../supabase/auth";

async function getEmailProfile(email: string) {
  const normalizedEmail = email.toLowerCase().trim();
  const user = await accountsRepo.getByEmail(normalizedEmail);
  if (!user) {
    try {
      const supabase = await getServerAuth();
      const authRes = await supabase.auth.admin.listUsers();
      const authUser = authRes.data?.users?.find(
        (u) => u.email?.toLowerCase() === normalizedEmail
      );
      if (authUser) {
        const name = authUser.user_metadata?.name || authUser.email?.split("@")[0] || "User";
        const existing = await accountsRepo.getByEmail(normalizedEmail);
        if (existing) return existing;
        return await accountsRepo.create({ name, email: normalizedEmail });
      }
    } catch (err) {
      console.error("Failed to auto-create missing account profile:", err);
    }
    throw new ApiError("profile doesn't exist", 404);
  }
  return user;
}

async function getById(id: number) {
  const user = await accountsRepo.get(id);
  if (!user) {
    throw new ApiError("profile doesn't exist", 404);
  }
  return user;
}

async function register(name: string, email: string) {
  email = email.toLowerCase().trim();
  const isValidEmail = validateEmail(email);

  if (!isValidEmail) {
    throw new ApiError("invalid email", 400);
  }
  const existingUser = await accountsRepo.getByEmail(email);
  if (existingUser) {
    return existingUser;
  }

  return await accountsRepo.create({ name, email });
}

async function update(id: number, name?: string) {
  const user = await accountsRepo.get(id);
  if (!user) {
    throw new ApiError("profile doesn't exist", 404);
  }

  return await accountsRepo.update(id, { name });
}

async function getProfiles() {
  return await accountsRepo.getMany();
}

async function remove(id: number) {
  const user = await accountsRepo.get(id);
  if (!user) {
    throw new ApiError("profile doesn't exist", 404);
  }

  return await accountsRepo.remove(id);
}

export const accountServices = {
  getEmailProfile,
  getById,
  register,
  update,
  remove,
  getProfiles,
};