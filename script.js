const nomes = [
  "Tharion Martel de Ferro",
  "Kael, o Rasgador de Sombras",
  "Baldur Punho Flamejante",
  "Eldrak Lança de Prata",
  "Ragnar, o Olho da Tempestade"
];

const inimigos = [
  "um dragão colossal",
  "uma medusa petrificante",
  "um troll faminto",
  "uma tribo de duendes",
  "um gigante das montanhas",
  "um necromante sombrio",
  "um bando de esqueletos guerreiros"
];

const ataques = ["Lançar magia", "Usar espada", "Golpear com cajado"];
const fugas = [
  "Correr rapidamente",
  "Usar magia para abrir portal",
  "Tomar poção de invisibilidade"
];
const defesas = ["Usar escudo", "Criar escudo mágico"];

// configuração do jogo
const MAX_RODADAS = 15;
const PONTOS_VITORIA = 30;

let pontos = 0;
let rodada = 1;
let tentativas = 0;
let nomeHeroi = "";
let inimigoAtual = "";

const logDiv = document.getElementById("log");
const startBtn = document.getElementById("start-btn");
const acoesDiv = document.getElementById("acoes");
const ataqueDiv = document.getElementById("opcoes-ataque");
const defesaDiv = document.getElementById("opcoes-defesa");
const fugaDiv = document.getElementById("opcoes-fuga");

function escrever(texto) {
  const p = document.createElement("p");
  p.innerHTML = texto;
  logDiv.appendChild(p);
  logDiv.scrollTop = logDiv.scrollHeight;
}

function startGame() {
  pontos = 0;
  rodada = 1;
  tentativas = 0;
  logDiv.innerHTML = "";
  nomeHeroi = nomes[Math.floor(Math.random() * nomes.length)];
  escrever(`<strong>Você é ${nomeHeroi}</strong>`);
  acoesDiv.style.display = "block";
  startBtn.style.display = "none";
  novaRodada();
}

function novaRodada() {
  if (pontos >= PONTOS_VITORIA || tentativas >= MAX_RODADAS) {
    return finalizarJogo();
  }
  inimigoAtual = inimigos[Math.floor(Math.random() * inimigos.length)];
  escrever(
    `<br><strong>Rodada ${rodada}</strong> - Você foi atacado por ${inimigoAtual}!`
  );
  mostrarOpcoes();
}

function criarBotoes(lista, container, tipo) {
  container.innerHTML = "";
  lista.forEach((acao) => {
    const btn = document.createElement("button");
    btn.textContent = acao;
    btn.addEventListener("click", () => realizarAcao(acao, tipo));
    container.appendChild(btn);
  });
}

function mostrarOpcoes() {
  ataqueDiv.innerHTML = "<h4>🗡️ Ataque:</h4>";
  defesaDiv.innerHTML = "<h4>🛡️ Defesa:</h4>";
  fugaDiv.innerHTML = "<h4>🏃 Fuga:</h4>";
  criarBotoes(ataques, ataqueDiv, "ataque");
  criarBotoes(defesas, defesaDiv, "defesa");
  criarBotoes(fugas, fugaDiv, "fuga");
}

function realizarAcao(descricao, tipo) {
  escrever(`Você tentou: <strong>${descricao}</strong> (${tipo})`);
  const chance = Math.random();
  if (chance > 0.5) {
    pontos += 10;
    escrever("✅ Sua ação foi bem-sucedida! +10 pontos.");
  } else {
    pontos -= 5;
    escrever("❌ A tentativa falhou... -5 pontos.");
  }
  rodada++;
  tentativas++;
  novaRodada();
}

function finalizarJogo() {
  acoesDiv.style.display = "none";
  startBtn.textContent = "Reiniciar Jogo";
  startBtn.style.display = "inline-block";
  if (pontos >= PONTOS_VITORIA) {
    escrever(`🏆 Você venceu com ${pontos} pontos! Final: ${finalZoeiro(nomeHeroi)}`);
  } else {
    escrever(`☠️ <strong>GAME OVER</strong> - Pontuação final: ${pontos}`);
    escrever(`<pre style='color:#ff5555; font-size: 12px; text-align: left;'>
_                   _
_( )                 ( )_
(_, |      __ __      | ,_)
   '\\'\\    /  ^  \\    /'/
    '\\'\\,/\\      \\,/'/'
      '\\| []   [] |/'
        (_  /^\\  _)
          \\  ~  /
          /HHHHH\\
        /'/{^^^}\\'\\
    _,/'/'  ^^^  '\\'\\,_
   (_, |           | ,_)
     (_)           (_)
</pre>`);
  }
  salvarRanking(nomeHeroi, pontos);
}

function finalZoeiro(nome) {
  if (nome.includes("Tharion")) return "abriu uma academia de goblins.";
  if (nome.includes("Kael")) return "domou um exército de morcegos cantores.";
  if (nome.includes("Baldur")) return "virou tiktoker de receitas com lava.";
  if (nome.includes("Eldrak")) return "vendeu sua lança pra comprar pão.";
  if (nome.includes("Ragnar")) return "lidera uma seita de Wi-Fi eterno.";
  return "virou lenda urbana contada por trolls em tabernas.";
}

function getRanking() {
  try {
    return JSON.parse(localStorage.getItem("rankingZoeiro")) || [];
  } catch {
    return [];
  }
}

function setRanking(ranking) {
  try {
    localStorage.setItem("rankingZoeiro", JSON.stringify(ranking));
  } catch {
    /* ignore */
  }
}

function salvarRanking(nome, pontos) {
  const ranking = getRanking();
  ranking.push({ nome, pontos });
  ranking.sort((a, b) => b.pontos - a.pontos);
  setRanking(ranking.slice(0, 5));
  atualizarRanking();
}

function atualizarRanking() {
  const rankingList = document.getElementById("ranking-list");
  rankingList.innerHTML = "";
  const ranking = getRanking();
  ranking.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = `${item.nome} - ${item.pontos} pontos`;
    rankingList.appendChild(li);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  atualizarRanking();
  startBtn.addEventListener("click", startGame);
});
