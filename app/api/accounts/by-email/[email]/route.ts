import { accountServices, bookServices } from "@/lib/server/services";
import { formatSuccessRespnse } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ email: string }> }) {
    const { email } = await params;
    const account = await accountServices.getEmailProfile(decodeURIComponent(email));
    const sumOverall = await bookServices.getSumOfAmountsForUser(account.id);
    return NextResponse.json(formatSuccessRespnse(200, "profile found", 1, { ...account, amount: sumOverall }), {
        status: 200
    })
}
