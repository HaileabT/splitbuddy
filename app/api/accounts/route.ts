import { accountServices } from "@/lib/server/services";
import { getServerAuth } from "@/lib/server/supabase/auth";
import { formatErrorRespnse, formatSuccessRespnse } from "@/lib/utils";
import { ApiError } from "@/lib/server/error";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const supabase = await getServerAuth();
    const user = await supabase.auth.getSession();
    if (!user.data.session?.user.role) {
        return NextResponse.json(formatErrorRespnse(401, "unauthorized"), { status: 401 });
    }
    if (user.data.session.user.role !== "admin") {
        return NextResponse.json(formatErrorRespnse(403, "forbidden"), { status: 403 });
    }
    try {
        const profiles = await accountServices.getProfiles();
        return NextResponse.json(formatSuccessRespnse(200, "profiles list", profiles.length, profiles), {
            status: 200
        });
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

export async function POST(req: NextRequest) {
    const supabase = await getServerAuth();
    const sessionRes = await supabase.auth.getSession();
    const body = await req.json();

    const currentUser = sessionRes.data.session?.user;

    if (currentUser) {
        if (currentUser.email?.toLowerCase() !== body.email?.toLowerCase() && currentUser.role !== "admin") {
            return NextResponse.json(formatErrorRespnse(403, "forbidden"), { status: 403 });
        }
    }

    if (!body.name || !body.email) {
        return NextResponse.json(formatErrorRespnse(400, "name and email are required"), { status: 400 });
    }

    try {
        const res = await accountServices.register(body.name, body.email);
        return NextResponse.json(formatSuccessRespnse(201, "account", 1, res), {
            status: 201,
        });
    } catch (error) {
        let errMsg = "something went wrong";
        let status = 500;
        if (error instanceof ApiError) {
            errMsg = error.message;
            status = error.code;
        }

        return NextResponse.json(formatErrorRespnse(status, errMsg), {
            status
        });
    }
}