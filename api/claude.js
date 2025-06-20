export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { message, apiKey, model } = req.body;
        
        if (!apiKey) {
            return res.status(400).json({ error: 'Claude API key is required' });
        }

        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'x-api-key': apiKey,
                'Content-Type': 'application/json',
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: model || 'claude-3-sonnet-20240229',
                max_tokens: 4000,
                messages: [{ role: 'user', content: message }]
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            return res.status(response.status).json({ error: errorData.error?.message || 'Claude API error' });
        }

        const data = await response.json();
        res.json({ response: data.content[0].text });
    } catch (error) {
        console.error('Claude API Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}