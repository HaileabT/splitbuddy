import { accountServices, bookServices } from "@/lib/server/services";
import { getServerAuth } from "@/lib/server/supabase/auth";
import { formatErrorRespnse, formatSuccessRespnse } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ email: string }> }) {
    const supabase = await getServerAuth();
        const user = await supabase.auth.getSession();
        if (!user.data.session?.user) {
            return NextResponse.json(formatErrorRespnse(401, "unauthorized"), {status: 401})
        }
    const { email } = await params;
    const account = await accountServices.getEmailProfile(decodeURIComponent(email));
    let sumOverall: number | undefined = undefined
    if (user.data.session.user.email === email) {
        sumOverall = await bookServices.getSumOfAmountsForUser(account.id);
    }
    return NextResponse.json(formatSuccessRespnse(200, "profile found", 1, { ...account, amount: sumOverall }), {
        status: 200
    })
}
