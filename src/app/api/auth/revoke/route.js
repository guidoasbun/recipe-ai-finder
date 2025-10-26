import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.accessToken) {
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Call Cognito's revoke endpoint
        const response = await fetch(`${process.env.COGNITO_ISSUER}/oauth2/revoke`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                token: session.user.accessToken,
                client_id: process.env.COGNITO_CLIENT_ID,
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to revoke token');
        }

        return NextResponse.json(
            { message: 'Tokens revoked successfully' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Token revocation failed:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}
