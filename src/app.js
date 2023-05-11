import express from "express";
import cors from "cors";

// Criando o servidor
const app = express();

// Configurando o servidor
app.use(express.json());
app.use(cors());

// App esperando requisições
const PORT = 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));