import { getSession } from "next-auth/react";

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const session = await getSession({ req });

        if (!session) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // Call Cognito's revoke endpoint
        const response = await fetch(`${process.env.COGNITO_ISSUER}/oauth2/revoke`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                token: session.accessToken, // Ensure you have access to the token
                client_id: process.env.COGNITO_CLIENT_ID,
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to revoke token');
        }

        res.status(200).json({ message: 'Tokens revoked successfully' });
    } catch (error) {
        console.error('Token revocation failed:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
