import { ApiError } from "@/lib/server/error";
import { accountServices, invitationServices } from "@/lib/server/services";
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

        const invitation = await invitationServices.get(numericId);
        if (!invitation) {
            return NextResponse.json(formatErrorRespnse(404, "invitation not found"), { status: 404 });
        }

        const isInviter = invitation.invitedByUserId === dbUser.id;
        const isInvited = invitation.invitedUserEmail?.toLowerCase() === dbUser.email?.toLowerCase();
        const isAdmin = user.data.session.user.role === "admin";

        if (!isInviter && !isInvited && !isAdmin) {
            return NextResponse.json(formatErrorRespnse(403, "forbidden"), { status: 403 });
        }

        return NextResponse.json(formatSuccessRespnse(200, "invitation found", 1, invitation), { status: 200 });
    } catch (error) {
        let errMsg = "invitation not found";
        let status = 404;
        if (error instanceof ApiError) {
            errMsg = error.message;
            status = error.code;
        }
        return NextResponse.json(formatErrorRespnse(status, errMsg), { status });
    }
}
