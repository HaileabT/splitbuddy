import { accountsRepo } from "@/lib/server/db/repos";
import { invitationServices } from "@/lib/server/services";
import { getServerAuth } from "@/lib/server/supabase/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ key: string }> }) {
    const appBase = process.env.APP_BASE_URL || "http://localhost:3000"
    const { key } = await params;
    const invitation = await invitationServices.getByKey(key);

    if (!invitation) {
        return NextResponse.redirect(`${appBase}/not-found?msg=${encodeURIComponent("Invitation not found.")}`)
    }

    const invitedEmail = invitation.invitedUserEmail;
    const existingUser = await accountsRepo.getByEmail(invitedEmail);
    if (existingUser) {
        const supabase = await getServerAuth();
        const session = await supabase.auth.getSession();
        if (session.data.session?.user.email && session.data.session.user.email.toLowerCase() === invitedEmail.toLowerCase()) {
            return NextResponse.redirect(`${appBase}/?invited_to=${key}`)
        } else if (session.data.session?.user.email && session.data.session.user.email.toLowerCase() !== invitedEmail.toLowerCase()) {
            return NextResponse.redirect(`${appBase}/not-found?msg=${encodeURIComponent("Invitation not found.")}`)
        } else if (!!session.error || !session || !session.data.session || !session.data.session.user.email) {
            return NextResponse.redirect(`${appBase}/sign-in?redirect_to=${encodeURIComponent(`${appBase}/?invited_to=${key}`)}`)
        }

    } else {
        return NextResponse.redirect(`${appBase}/sign-up?redirect_to=${encodeURIComponent(`${appBase}/?invited_to=${key}`)}`)
    }
}