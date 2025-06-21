import { sign } from 'jsonwebtoken';

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = 'https://bendai-plus-web.vercel.app/api/auth/google';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { code } = req.query;

    if (!code) {
        // Redirect to Google OAuth
        const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=email%20profile`;
        return res.redirect(googleAuthUrl);
    }

    try {
        // Exchange code for access token
        const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                code,
                grant_type: 'authorization_code',
                redirect_uri: REDIRECT_URI,
            }),
        });

        const tokenData = await tokenResponse.json();

        if (!tokenResponse.ok) {
            return res.status(400).json({ error: 'Failed to exchange code for token' });
        }

        // Get user info
        const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: {
                Authorization: `Bearer ${tokenData.access_token}`,
            },
        });

        const userData = await userResponse.json();

        if (!userResponse.ok) {
            return res.status(400).json({ error: 'Failed to get user info' });
        }

        // Create JWT token
        const jwtToken = sign(
            {
                id: userData.id,
                email: userData.email,
                name: userData.name,
                picture: userData.picture,
            },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '7d' }
        );

        // Set cookie and redirect
        res.setHeader('Set-Cookie', `auth-token=${jwtToken}; HttpOnly; Path=/; Max-Age=604800; SameSite=Strict${process.env.VERCEL_URL ? '; Secure' : ''}`);
        res.redirect('/?auth=success');
    } catch (error) {
        console.error('OAuth error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}