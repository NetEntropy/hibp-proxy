const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors()); // Crucial for Shopify to talk to Railway

app.get('/check', async (req, res) => {
    const email = req.query.email;
    if (!email) return res.status(400).send("Email required");

    try {
        const response = await axios.get(`https://haveibeenpwned.com/api/v3/breachedaccount/${encodeURIComponent(email)}`, {
            headers: {
                'hibp-api-key': process.env.HIBP_KEY,
                'user-agent': 'Shopify-Proxy'
            }
        });
        res.json(response.data);
    } catch (error) {
        if (error.response && error.response.status === 404) {
            res.json([]); // No breaches found
        } else {
            res.status(500).json({ error: "API Error" });
        }
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server on port ${PORT}`));
