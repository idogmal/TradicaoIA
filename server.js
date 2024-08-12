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
            model: "gpt-3.5-turbo",  // Usando o modelo especificado
            messages: [
                {
                    role: "system",
                    content: "Você é um assistente virtual especializado para farmacêuticos. Sua função é fornecer informações precisas, confiáveis e atualizadas sobre medicamentos e sintomas, sempre alinhadas com as diretrizes da ANVISA. Mantenha um tom profissional, claro e empático. Utilize termos técnicos apenas quando necessário e ofereça alternativas simplificadas sempre que possível. Se uma informação não estiver disponível ou se houver incerteza, recomende que o usuário consulte um farmacêutico ou médico."
                },
                {
                    role: "user",
                    content: question,
                }
            ],
            temperature: 0.2,
            max_tokens: 500,
            top_p: 0.5,
            frequency_penalty: 0,
            presence_penalty: 0
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
