import { ApiError } from "@/lib/server/error";
import { accountServices, bookServices } from "@/lib/server/services";
import { getServerAuth } from "@/lib/server/supabase/auth";
import { formatErrorRespnse, formatSuccessRespnse } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const numericId = Number(id);
        const account = await accountServices.getById(numericId);
        if (!account) {
            return NextResponse.json(formatErrorRespnse(404, "profile not found"), {
                status: 404
            });
        }

        const sumOverall = await bookServices.getSumOfAmountsForUser(account.id);
        return NextResponse.json(formatSuccessRespnse(200, "profile found", 1, { ...account, amount: sumOverall }), {
            status: 200
        });
    } catch (error) {
        let errMsg = "profile not found";
        let status = 404;
        if (error instanceof ApiError) {
            errMsg = error.message;
            status = error.code;
        }
        return NextResponse.json(formatErrorRespnse(status, errMsg), { status });
    }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const numericId = Number(id);
        const body = await req.json();
        const account = await accountServices.update(numericId, body.name);
        return NextResponse.json(formatSuccessRespnse(200, "profile updated", 1, account), {
            status: 200
        });
    } catch (error) {
        let errMsg = "failed to update profile";
        let status = 500;
        if (error instanceof ApiError) {
            errMsg = error.message;
            status = error.code;
        }
        return NextResponse.json(formatErrorRespnse(status, errMsg), { status });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const numericId = Number(id);
        const supabase = await getServerAuth();
        const user = await supabase.auth.getUser();
        if (!user.data.user?.id) {
            return NextResponse.json(formatErrorRespnse(403, "forbidden"), {
                status: 403
            });
        }
        const account = await accountServices.remove(numericId);
        await supabase.auth.admin.deleteUser(user.data.user.id);

        return NextResponse.json(formatSuccessRespnse(200, "account deleted", 1, account), {
            status: 200
        });
    } catch (error) {
        let errMsg = "failed to delete profile";
        let status = 500;
        if (error instanceof ApiError) {
            errMsg = error.message;
            status = error.code;
        }
        return NextResponse.json(formatErrorRespnse(status, errMsg), { status });
    }
}