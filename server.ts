import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Server-side AI Proxy for Gemini
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { prompt, context } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(200).json({
        text: `Tutor AETHON em modo offline.\n\nPara ativar o raciocínio completo com a inteligência artificial do Google Gemini, adicione a chave GEMINI_API_KEY no painel de Segredos do AI Studio.`
      });
    }

    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `Você é o AETHON AI, tutor militar e acadêmico especialista em preparação para as Forças Armadas brasileiras (EsPCEx, ESA, EEAR, AFA, Escola Naval, EFOMM) e vestibulares de alta concorrência.
Contexto do Aluno: ${context || 'Preparação Geral'}.
Diretrizes:
- Responda de forma didática, encorajadora, com rigor militar e raciocínio passo a passo.
- Destaque fórmulas com clareza e dê macetes ou mnemônicos quando oportuno.
- Enfatize a resolução de exercícios e os pontos onde as bancas costumam colocar pegadinhas.`
            },
            { text: prompt }
          ]
        }
      ]
    });

    res.json({ text: response.text || 'Sem resposta disponível.' });
  } catch (error: any) {
    console.error('AI Proxy Error:', error);
    res.status(500).json({ error: error.message || 'Erro ao processar consulta de IA.' });
  }
});

// Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
