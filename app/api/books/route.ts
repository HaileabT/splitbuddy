import { bookServices } from "@/lib/server/services";
import { getServerAuth } from "@/lib/server/supabase/auth";
import { formatErrorRespnse, formatSuccessRespnse } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const supabase = await getServerAuth();
    const res = await supabase.auth.getUser();

    if (res.error || !res.data.user) {
        return NextResponse.json(formatErrorRespnse(401, "unauthorized: please login first"), {
            status: 401
        })
    }

    const { user } = res.data;

    const books = await bookServices.getUserBooks(user.id);

    return NextResponse.json(formatSuccessRespnse(200, "here are your books", books.length, books), { status: 200 })
}