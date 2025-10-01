import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.post('/api/chat', async (req, res) => {
    try {
        const { messages, model, apiKey } = req.body;
        if (!apiKey) {
            return res.status(400).json({ error: 'Chave API nao fornecida' });
        }

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + apiKey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: model || 'llama-3.3-70b-versatile',
                messages: messages,
                temperature: 0.8,
                max_tokens: 4096
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            return res.status(response.status).json({ error: errorData.error });
        }

        const data = await response.json();
        res.json(data);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log('Servidor rodando em http://localhost:' + PORT);
});

