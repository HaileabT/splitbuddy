import { accountServices } from "@/lib/server/services";
import { getServerAuth } from "@/lib/server/supabase/auth";
import { formatErrorRespnse, formatSuccessRespnse } from "@/lib/utils";
import { ApiError } from "@/lib/server/error";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
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
    const body = await req.json();
    try {
        const res = await accountServices.register(body.name, body.email)
        return NextResponse.json(formatSuccessRespnse(201, "account", 1, res), {
            status: 201,
        })
    } catch (error) {
        let errMsg = "something went wrong"
        let status = 500
        if (error instanceof ApiError) {
            errMsg = error.message
            status = error.code;
        }

        const id = body.id;
        const supabase = await getServerAuth()
        await supabase.auth.admin.deleteUser(id)

        return NextResponse.json(formatErrorRespnse(status, errMsg), {
            status
        })
    }
}