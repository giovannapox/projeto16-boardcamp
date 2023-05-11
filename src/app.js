import express from "express";
import cors from "cors";
import gamesRouter from "../src/routes/games.router.js";

// Criando o servidor
const app = express();

// Configurando o servidor
app.use(express.json());
app.use(cors());

app.use(gamesRouter);

// App esperando requisições
const PORT = 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));