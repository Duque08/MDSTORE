// Produtos fixos no site
const produtos = [
  { nome: "Lip Gloss", preco: 80.00, imagem: "https://raw.githubusercontent.com/Duque08/MDSTORE/refs/heads/main/lip%20gloss%2080.png" },
  { nome: "Máquina de cortar cabelo", preco: 60.00, imagem: "https://raw.githubusercontent.com/Duque08/MDSTORE/refs/heads/main/maquina%20de%20cortar%20cablo%2060%20reais.png" },
  { nome: "SmartWatch Bazik", preco: 250.00, imagem: "https://raw.githubusercontent.com/Duque08/MDSTORE/refs/heads/main/relogio%20bazik%20250.png" },
  { nome: "Fone de Ouvido Bluetooth", preco: 109.90, imagem: "https://raw.githubusercontent.com/Duque08/MDSTORE/refs/heads/main/fone.jpg" }
];

const listaProdutos = document.getElementById("product-list");
const searchInput = document.getElementById("search");
const cartDiv = document.getElementById("cart");
const totalDiv = document.getElementById("total");
const numeroWhatsApp = "5527998151141";

let carrinho = [];

// Renderizar produtos
function renderizarProdutos(filtro = "") {
  listaProdutos.innerHTML = "";
  produtos
    .filter(p => p.nome.toLowerCase().includes(filtro.toLowerCase()))
    .forEach((p, index) => {
      const card = document.createElement("div");
      card.className = "product-card";
      card.innerHTML = `
        <img src="${p.imagem}" alt="${p.nome}">
        <h3>${p.nome}</h3>
        <p>R$ ${p.preco.toFixed(2)}</p>
        <button onclick="adicionarAoCarrinho(${index})">Adicionar</button>
      `;
      listaProdutos.appendChild(card);
    });
}

// Carrinho
function adicionarAoCarrinho(i) {
  carrinho.push(produtos[i]);
  atualizarCarrinho();
}

function removerDoCarrinho(i) {
  carrinho.splice(i, 1);
  atualizarCarrinho();
}

function atualizarCarrinho() {
  cartDiv.innerHTML = "";
  let total = 0;
  carrinho.forEach((item, i) => {
    total += item.preco;
    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
      <span>${item.nome} - R$ ${item.preco.toFixed(2)}</span>
      <button onclick="removerDoCarrinho(${i})">X</button>
    `;
    cartDiv.appendChild(div);
  });
  totalDiv.textContent = "Total: R$ " + total.toFixed(2);
}

function limparCarrinho() {
  carrinho = [];
  atualizarCarrinho();
}

// Enviar para WhatsApp
function enviarPedido() {
  const nomeCliente = document.getElementById("nomeCliente").value.trim();

  if (!nomeCliente) {
    alert("Por favor, digite seu nome antes de enviar o pedido!");
    return;
  }

  if (carrinho.length === 0) {
    alert("Seu carrinho está vazio!");
    return;
  }

  let mensagem = `Olá, meu nome é ${nomeCliente} e gostaria de fazer um pedido:%0A`;
  let total = 0;
  carrinho.forEach(item => {
    mensagem += `- ${item.nome} (R$ ${item.preco.toFixed(2)})%0A`;
    total += item.preco;
  });
  mensagem += `%0ATotal: R$ ${total.toFixed(2)}`;

  window.open(`https://wa.me/${numeroWhatsApp}?text=${mensagem}`, "_blank");
}

// Pesquisa
searchInput.addEventListener("input", (e) => {
  renderizarProdutos(e.target.value);
});

// Inicial
renderizarProdutos();




