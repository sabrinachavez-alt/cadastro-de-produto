const formulario = document.getElementById("formProduto");
const tabelaProdutos = document.getElementById("tabelaProdutos");

function formatarMoeda(valor) {
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL"
    }).format(Number(valor));
}

async function carregarProdutos() {
    const resposta = await fetch("/produtos");
    const produtos = await resposta.json();

    tabelaProdutos.innerHTML = "";

    produtos.forEach((produto) => {
        const linha = document.createElement("tr");

        linha.innerHTML = `
            <td>${produto.id}</td>
            <td>${produto.nome}</td>
            <td>${formatarMoeda(produto.preco)}</td>
            <td>${produto.quantidade}</td>
        `;

        tabelaProdutos.appendChild(linha);
    });
}

formulario.addEventListener("submit", async function (event) {
    event.preventDefault();

    const produto = {
        nome: document.getElementById("nome").value,
        preco: Number(document.getElementById("preco").value),
        quantidade: Number(document.getElementById("quantidade").value)
    };

    const resposta = await fetch("/produtos", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(produto)
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
        alert(dados.erro || "Erro ao cadastrar produto.");
        return;
    }

    formulario.reset();
    carregarProdutos();
    console.log("Produto salvo com sucesso:", dados);
});

carregarProdutos();