import { validateEmail } from "@/lib/utils/strings";
import { accountsRepo } from "../db/repos"
import { ApiError } from "../error";


async function getEmailProfile(email: string) {
    const user = await accountsRepo.getByEmail(email);
    if (!user) {
        throw new ApiError("profile doesn't exist", 409)
    }

    return user;
}
async function register(name: string, email: string) {
    email = email.toLowerCase()
    const isValidEmail = validateEmail(email);

    if (!isValidEmail) {
        throw new ApiError("invalid email", 400)
    }
    const existingUser = await accountsRepo.getByEmail(email);
    if (existingUser) {
        throw new ApiError("profile with this email already exists", 409)
    }

    return await accountsRepo.create({ name, email });
}

async function update(id: number, name?: string) {
    const user = await accountsRepo.get(id);
    if (!user) {
        throw new ApiError("profile doesn't exist", 409)
    }

    return await accountsRepo.update(id, { name })
}



async function getProfiles() {
    return await accountsRepo.getMany();
}

async function remove(id: number) {
    const user = await accountsRepo.get(id);
    if (!user) {
        throw new ApiError("profile doesn't exist", 409)
    }

    return await accountsRepo.remove(id)
}

export const accountServices = { getEmailProfile, register, update, remove, getProfiles }