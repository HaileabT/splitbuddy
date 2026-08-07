import { ApiError } from "@/lib/server/error";
import { accountServices, invitationServices } from "@/lib/server/services";
import { getServerAuth } from "@/lib/server/supabase/auth";
import { formatErrorRespnse, formatSuccessRespnse } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const supabase = await getServerAuth();
    const user = await supabase.auth.getSession();
    if (!user.data.session?.user) {
        return NextResponse.json(formatErrorRespnse(401, "unauthorized"), { status: 401 });
    }

    try {
        const { searchParams } = new URL(req.url);
        const loanBookId = searchParams.get("loanBookId");
        const invitedByUserId = searchParams.get("invitedByUserId");
        const invitedUserEmail = searchParams.get("invitedUserEmail");
        const status = searchParams.get("status") as "pending" | "cancelled" | "accepted" | null;

        const dbUser = await accountServices.getEmailProfile(user.data.session.user.email || "");
        if (!dbUser) {
            return NextResponse.json(formatErrorRespnse(404, "user profile not found"), { status: 404 });
        }

        // Standard user can only query invitations they sent or received, unless admin
        const isAdmin = user.data.session.user.role === "admin";
        let targetEmail = invitedUserEmail || undefined;
        let targetInviterId = invitedByUserId ? Number(invitedByUserId) : undefined;

        if (!isAdmin) {
            if (!targetEmail && !targetInviterId) {
                targetEmail = dbUser.email;
            }
        }

        const invitations = await invitationServices.getMany({
            loanBookId: loanBookId ? Number(loanBookId) : undefined,
            invitedByUserId: targetInviterId,
            invitedUserEmail: targetEmail,
            status: status || undefined,
        });

        return NextResponse.json(formatSuccessRespnse(200, "invitations list", invitations.length, invitations), { status: 200 });
    } catch (error) {
        let errMsg = "failed to get invitations";
        let status = 500;
        if (error instanceof ApiError) {
            errMsg = error.message;
            status = error.code;
        }
        return NextResponse.json(formatErrorRespnse(status, errMsg), { status });
    }
}

export async function POST(req: NextRequest) {
    const supabase = await getServerAuth();
    const user = await supabase.auth.getSession();
    if (!user.data.session?.user) {
        return NextResponse.json(formatErrorRespnse(401, "unauthorized"), { status: 401 });
    }

    try {
        const body = await req.json();

        const dbUser = await accountServices.getEmailProfile(user.data.session.user.email || "");
        if (!dbUser) {
            return NextResponse.json(formatErrorRespnse(404, "user profile not found"), { status: 404 });
        }

        const invitation = await invitationServices.create(
            body.loanBookId,
            dbUser.id,
            body.invitedUserEmail
        );

        return NextResponse.json(formatSuccessRespnse(201, "invitation created", 1, invitation), { status: 201 });
    } catch (error) {
        let errMsg = "failed to create invitation";
        let status = 500;
        if (error instanceof ApiError) {
            errMsg = error.message;
            status = error.code;
        }
        return NextResponse.json(formatErrorRespnse(status, errMsg), { status });
    }
}
