<script type="module">
// ---------------- FIREBASE ------------------
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// COLE SUA CONFIG DO FIREBASE AQUI
const firebaseConfig = {
  apiKey: "COLE_AQUI",
  authDomain: "COLE_AQUI",
  projectId: "COLE_AQUI",
  storageBucket: "COLE_AQUI",
  messagingSenderId: "COLE_AQUI",
  appId: "COLE_AQUI"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ------------------- SITE ---------------------

const listaProdutos = document.getElementById("product-list");
const searchInput = document.getElementById("search");
const cartDiv = document.getElementById("cart");
const totalDiv = document.getElementById("total");
const numeroWhatsApp = "5527998151141";

let produtos = [];
let carrinho = [];

// 🔹 BUSCAR PRODUTOS NO FIREBASE
async function carregarProdutos() {
  produtos = [];
  const snap = await getDocs(collection(db, "produtos"));
  snap.forEach(doc => produtos.push(doc.data()));
  renderizarProdutos();
}

// 🔹 RENDERIZAR NA TELA
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
        <p>R$ ${Number(p.preco).toFixed(2)}</p>
        <button onclick="adicionarAoCarrinho(${index})">Adicionar</button>
      `;
      listaProdutos.appendChild(card);
    });
}

// 🔹 CARRINHO
window.adicionarAoCarrinho = function(i) {
  carrinho.push(produtos[i]);
  atualizarCarrinho();
}

window.removerDoCarrinho = function(i) {
  carrinho.splice(i, 1);
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

window.limparCarrinho = function(){
  carrinho = [];
  atualizarCarrinho();
}

// 🔹 ENVIAR WHATSAPP
window.enviarPedido = function(){
  const nomeCliente = document.getElementById("nomeCliente").value.trim();

  if (!nomeCliente) return alert("Digite seu nome");
  if (carrinho.length === 0) return alert("Carrinho vazio");

  let mensagem = `Olá, meu nome é ${nomeCliente} e gostaria de fazer um pedido:%0A`;
  let total = 0;

  carrinho.forEach(item => {
    mensagem += `- ${item.nome} (R$ ${Number(item.preco).toFixed(2)})%0A`;
    total += Number(item.preco);
  });

  mensagem += `%0ATotal: R$ ${total.toFixed(2)}`;

  window.open(`https://wa.me/${numeroWhatsApp}?text=${mensagem}`, "_blank");
};

// 🔹 PESQUISA
searchInput.addEventListener("input", e => {
  renderizarProdutos(e.target.value);
});

// 🔹 INICIAR
carregarProdutos();

</script>
