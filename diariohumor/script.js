let nome = "";
let humorSelecionado = "";
let historico = JSON.parse(localStorage.getItem("historico")) || [];
let contagemHumor = {};
const diasSemana = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

function salvarNome() {
  const inputNome = document.getElementById("nomeUsuario");
  nome = inputNome.value.trim();
  if (nome === "") return alert("Digite seu nome!");

  document.getElementById("nomeExibido").textContent = nome;
  document.getElementById("boasVindas").style.display = "none";
  document.getElementById("painelHumor").style.display = "block";

  atualizarHistorico();
  atualizarResumo();
  atualizarBarraProgresso();
}

function selecionarEmoji(emoji) {
  humorSelecionado = emoji;
  const botoes = document.querySelectorAll("#emojis button");
  botoes.forEach(btn => {
    btn.classList.remove("selecionado");
    if (btn.textContent === emoji) {
      btn.classList.add("selecionado");
    }
  });
}

function salvarHumor() {
  const motivo = document.getElementById("motivo").value.trim();
  const dia = parseInt(document.getElementById("diaSelect").value);

  if (!humorSelecionado || motivo === "") {
    alert("Escolha um emoji e escreva o motivo!");
    return;
  }

  const novaEntrada = {
    dia,
    emoji: humorSelecionado,
    frase: motivo
  };

  // Substitui se já tiver entrada pro dia
  const indice = historico.findIndex(e => e.dia === dia);
  if (indice !== -1) {
    historico[indice] = novaEntrada;
  } else {
    historico.push(novaEntrada);
  }

  localStorage.setItem("historico", JSON.stringify(historico));
  atualizarHistorico();
  atualizarResumo();
  atualizarBarraProgresso();

  document.getElementById("motivo").value = "";
  humorSelecionado = "";
  const botoes = document.querySelectorAll("#emojis button");
  botoes.forEach(btn => btn.classList.remove("selecionado"));
}

function atualizarHistorico() {
  const lista = document.getElementById("historico");
  lista.innerHTML = "";

  historico.sort((a, b) => a.dia - b.dia);

  historico.forEach(item => {
    const li = document.createElement("li");
    li.innerHTML = `<strong>${diasSemana[item.dia]}:</strong> ${item.emoji} "${item.frase}" 
      <button onclick="editarDia(${item.dia})">✏️</button>`;
    lista.appendChild(li);
  });
}

function editarDia(dia) {
  const entrada = historico.find(e => e.dia === dia);
  if (!entrada) return;

  document.getElementById("diaSelect").value = dia;
  document.getElementById("motivo").value = entrada.frase;
  selecionarEmoji(entrada.emoji);
}

function atualizarResumo() {
  const resumo = document.getElementById("resumo");
  resumo.innerHTML = "";
  contagemHumor = {};

  historico.forEach(item => {
    contagemHumor[item.emoji] = (contagemHumor[item.emoji] || 0) + 1;
  });

  for (let emoji in contagemHumor) {
    const li = document.createElement("li");
    li.textContent = `${emoji} x${contagemHumor[emoji]}`;
    resumo.appendChild(li);
  }
}

function atualizarBarraProgresso() {
  const barra = document.getElementById("barraProgresso");
  const progresso = (historico.length / 7) * 100;
  barra.style.width = `${progresso}%`;
}