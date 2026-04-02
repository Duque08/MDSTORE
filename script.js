import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// --- SUBSTITUA COM SEUS DADOS DO SUPABASE ---
const SUPABASE_URL = 'https://dhigljnbkxqjbfnazken.supabase.co';
const SUPABASE_KEY = 'https://eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRoaWdsam5ia3hxamJmbmF6a2VuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUxMDE5NDIsImV4cCI6MjA5MDY3Nzk0Mn0.oDnoinCDr9bipJ1zUutjtVrqP8lgfg8wIQaGJiG7KSM.supabase.co';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const listaProdutosHTML = document.getElementById("product-list");
const searchInput = document.getElementById("search");
const cartDiv = document.getElementById("cart");
const totalDiv = document.getElementById("total");
const numeroWhatsApp = "5527998151141";

let produtosGeral = [];
let carrinho = [];

// 🔹 BUSCAR PRODUTOS NO SUPABASE
async function carregarProdutos() {
    const { data, error } = await supabase
        .from('produtos')
        .select('*');

    if (error) {
        console.error("Erro ao carregar:", error);
        listaProdutosHTML.innerHTML = "Erro ao carregar produtos.";
        return;
    }

    produtosGeral = data;
    renderizarProdutos();
}

// 🔹 RENDERIZAR NA TELA
function renderizarProdutos(filtro = "") {
    listaProdutosHTML.innerHTML = "";
    const filtrados = produtosGeral.filter(p => p.nome.toLowerCase().includes(filtro.toLowerCase()));

    filtrados.forEach((p) => {
        const card = document.createElement("div");
        card.className = "product-card";
        card.innerHTML = `
            <img src="${p.imagem || 'https://via.placeholder.com/150'}" alt="${p.nome}">
            <h3>${p.nome}</h3>
            <p>R$ ${Number(p.preco).toFixed(2)}</p>
            <button class="add-btn" data-id="${p.id}">Adicionar</button>
        `;
        listaProdutosHTML.appendChild(card);
    });

    // Adiciona eventos aos botões recém criados
    document.querySelectorAll('.add-btn').forEach(btn => {
        btn.onclick = () => {
            const id = btn.getAttribute('data-id');
            const prod = produtosGeral.find(item => item.id == id);
            adicionarAoCarrinho(prod);
        };
    });
}

// 🔹 FUNÇÕES DO CARRINHO (Expostas para o HTML)
window.adicionarAoCarrinho = function(produto) {
    carrinho.push(produto);
    atualizarCarrinho();
}

window.removerDoCarrinho = function(index) {
    carrinho.splice(index, 1);
    atualizarCarrinho();
}

function atualizarCarrinho() {
    cartDiv.innerHTML = "";
    let total = 0;

    carrinho.forEach((item, i) => {
        total += Number(item.preco);
        const div = document.createElement("div");
        div.className = "cart-item";
        div.innerHTML = `
            <span>${item.nome} - R$ ${Number(item.preco).toFixed(2)}</span>
            <button onclick="removerDoCarrinho(${i})">X</button>
        `;
        cartDiv.appendChild(div);
    });

    totalDiv.textContent = "Total: R$ " + total.toFixed(2);
}

window.limparCarrinho = function() {
    carrinho = [];
    atualizarCarrinho();
}

// 🔹 ENVIAR WHATSAPP
window.enviarPedido = function() {
    const nomeCliente = document.getElementById("nomeCliente").value.trim();
    if (!nomeCliente) return alert("Por favor, digite seu nome.");
    if (carrinho.length === 0) return alert("Seu carrinho está vazio.");

    let mensagem = `Olá, meu nome é ${nomeCliente} e gostaria de fazer um pedido:%0A%0A`;
    let total = 0;

    carrinho.forEach(item => {
        mensagem += `• ${item.nome} - R$ ${Number(item.preco).toFixed(2)}%0A`;
        total += Number(item.preco);
    });

    mensagem += `%0A*Total: R$ ${total.toFixed(2)}*`;
    window.open(`https://wa.me/${numeroWhatsApp}?text=${mensagem}`, "_blank");
};

// 🔹 EVENTOS
searchInput.addEventListener("input", e => renderizarProdutos(e.target.value));

// Iniciar
carregarProdutos();
