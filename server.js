const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORTA = 3000;

const arquivoBanco = path.join(__dirname, "bancoDeDadosFalso.json");

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

function lerProdutos() {
    try {
        if (!fs.existsSync(arquivoBanco)) {
            fs.writeFileSync(arquivoBanco, "[]", "utf8");
        }

        const dados = fs.readFileSync(arquivoBanco, "utf8");

        if (!dados.trim()) {
            return [];
        }

        const produtos = JSON.parse(dados);

        return Array.isArray(produtos) ? produtos : [];
    } catch (erro) {
        console.error("Erro ao ler banco:", erro);
        return [];
    }
}

function salvarProdutos(produtos) {
    try {
        fs.writeFileSync(
            arquivoBanco,
            JSON.stringify(produtos, null, 2),
            "utf8"
        );

        return true;
    } catch (erro) {
        console.error("Erro ao salvar banco:", erro);
        return false;
    }
}

app.get("/produtos", (req, res) => {
    const produtos = lerProdutos();
    res.json(produtos);
});

app.post("/produtos", (req, res) => {
    const { nome, preco, quantidade } = req.body;

    if (!nome || preco === undefined || quantidade === undefined) {
        return res.status(400).json({
            erro: "Preencha nome, preço e quantidade."
        });
    }

    const produtos = lerProdutos();

    const novoId = produtos.length > 0
        ? Math.max(...produtos.map(produto => produto.id)) + 1
        : 1;

    const novoProduto = {
        id: novoId,
        nome: nome,
        preco: Number(preco),
        quantidade: Number(quantidade)
    };

    produtos.push(novoProduto);

    if (!salvarProdutos(produtos)) {
        return res.status(500).json({
            erro: "Erro ao salvar o banco de dados."
        });
    }

    res.status(201).json(novoProduto);
});

app.listen(PORTA, () => {
    console.log(`Servidor rodando em http://localhost:${PORTA}`);
});