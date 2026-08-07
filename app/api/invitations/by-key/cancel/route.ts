import { accountsRepo } from "@/lib/server/db/repos";
import { invitationServices } from "@/lib/server/services";
import { getServerAuth } from "@/lib/server/supabase/auth";
import { formatErrorRespnse, formatSuccessRespnse } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const body = await req.json();
    if (!body.key) {
        return NextResponse.json(formatErrorRespnse(400, "invalid request: please provide key of invitation"), { status: 400 })
    }
    const { key } = body;
    const supabase = await getServerAuth();
    const user = await supabase.auth.getUser();
    if (user.error || !user.data.user) {
        return NextResponse.json(formatErrorRespnse(401, "please login first"), { status: 401 })
    }

    const account = await accountsRepo.getByEmail(user.data.user.email || "")
    if (!account) {
        return NextResponse.json(formatErrorRespnse(404, "internal server error: account not found"), { status: 404 })
    }

    const invitation = await invitationServices.getByKey(key);

    if (!invitation) {
        return NextResponse.json(formatErrorRespnse(404, "invitation not found"), { status: 404 })
    }

    await invitationServices.cancel(key, account.id)

    return NextResponse.json(formatSuccessRespnse(200, "invitation found", 1, invitation));
}