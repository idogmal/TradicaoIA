require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const OpenAI = require('openai');

const app = express();
const port = 3000;

// Serve arquivos estáticos da pasta 'public'
app.use(express.static('public'));

// Middleware para análise de corpo JSON
app.use(bodyParser.json());

// Configura o cliente da OpenAI com a chave de API do arquivo .env
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Rota POST para receber perguntas e enviar para a API OpenAI
app.post('/ask', async (req, res) => {
    const question = req.body.question;
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",  // Use o modelo mais recente e recomendado
            messages: [{ role: "user", content: question }],
        });
        // Envia a resposta do modelo como resposta JSON ao cliente
        res.json({ answer: response.choices[0].message.content.trim() });
    } catch (error) {
        // Log do erro e envio de mensagem de erro ao cliente
        console.error('Error:', error);
        res.status(500).send("Ocorreu um erro ao processar sua solicitação.");
    }
});

// Inicia o servidor na porta especificada
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
