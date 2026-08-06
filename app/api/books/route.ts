import { accountServices, bookServices, invitationServices } from "@/lib/server/services";
import { getServerAuth } from "@/lib/server/supabase/auth";
import { formatErrorRespnse, formatSuccessRespnse } from "@/lib/utils";
import { ApiError } from "@/lib/server/error";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const supabase = await getServerAuth();
    const res = await supabase.auth.getUser();

    if (res.error || !res.data.user) {
        return NextResponse.json(formatErrorRespnse(401, "unauthorized: please login first"), {
            status: 401
        })
    }

    const { user } = res.data;

    const dbUser = await accountServices.getEmailProfile(user.email || "");
    if (!dbUser) {
        return NextResponse.json(formatErrorRespnse(500, "internal server error"), {
            status: 500
        });
    }

    const books = await bookServices.getUserBooks(dbUser.id);

    return NextResponse.json(formatSuccessRespnse(200, "here are your books", books.length, books), { status: 200 })
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const supabase = await getServerAuth();
        const res = await supabase.auth.getUser();

        if (res.error || !res.data.user) {
            return NextResponse.json(formatErrorRespnse(401, "unauthorized: please login first"), {
                status: 401
            })
        }

        const { user } = res.data;

        const dbUser = await accountServices.getEmailProfile(user.email || "");
        if (!dbUser) {
            return NextResponse.json(formatErrorRespnse(404, "internal server error: user profile doesn't exist"), {
                status: 404
            });
        }

        if (!body.name || !body.invitedUserEmail) {
            return NextResponse.json(formatErrorRespnse(400, "book name and invited user email are required"), {
                status: 400
            });
        }

        if (user.email?.toLowerCase() === body.invitedUserEmail.toLowerCase()) {
            return NextResponse.json(formatErrorRespnse(409, "you can't send an invitation to yourself."), {
                status: 409
            })
        }

        await bookServices.checkDuplicateBook(dbUser.id, body.name, body.invitedUserEmail);

        const book = await bookServices.create(body.name, dbUser.id);
        if (!book) {
            return NextResponse.json(formatErrorRespnse(500, "internal server error: book not created"), {
                status: 500
            })
        }

        const invitaiton = await invitationServices.create(book.id, dbUser.id, body.invitedUserEmail?.toLowerCase());
        if (!invitaiton) {
            return NextResponse.json(formatErrorRespnse(500, "internal server error: couldn't create invitation"), {
                status: 500
            })
        }

        return NextResponse.json(formatSuccessRespnse(201, "book created successfully", 1, book), { status: 201 })
    } catch (error) {
        let errMsg = "something went wrong";
        let status = 500;
        if (error instanceof ApiError) {
            errMsg = error.message;
            status = error.code;
        }
        return NextResponse.json(formatErrorRespnse(status, errMsg), { status });
    }
}