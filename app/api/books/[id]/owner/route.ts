import { ApiError } from "@/lib/server/error";
import { accountServices, bookServices } from "@/lib/server/services";
import { membersRepo } from "@/lib/server/db/repos";
import { getServerAuth } from "@/lib/server/supabase/auth";
import { formatErrorRespnse, formatSuccessRespnse } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const supabase = await getServerAuth();
    const user = await supabase.auth.getSession();
    if (!user.data.session?.user) {
        return NextResponse.json(formatErrorRespnse(401, "unauthorized"), { status: 401 });
    }

    try {
        const { id } = await params;
        const numericId = Number(id);

        const dbUser = await accountServices.getEmailProfile(user.data.session.user.email || "");
        if (!dbUser) {
            return NextResponse.json(formatErrorRespnse(404, "user profile not found"), { status: 404 });
        }

        const membership = await membersRepo.getMember(numericId, dbUser.id);
        if (!membership && user.data.session.user.role !== "admin") {
            return NextResponse.json(formatErrorRespnse(403, "forbidden: you are not a member of this book"), { status: 403 });
        }

        const owner = await bookServices.getBookOwner(numericId);
        if (!owner) {
            return NextResponse.json(formatErrorRespnse(404, "owner not found"), {
                status: 404
            });
        }
        return NextResponse.json(formatSuccessRespnse(200, "owner profile found", 1, owner), {
            status: 200
        });
    } catch (error) {
        let errMsg = "owner not found";
        let status = 404;
        if (error instanceof ApiError) {
            errMsg = error.message;
            status = error.code;
        }
        return NextResponse.json(formatErrorRespnse(status, errMsg), { status });
    }
}
