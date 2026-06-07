//Declarando Variaveis Globais

const mapa = document.getElementById("Mapa");
const criarMapaBtn = document.getElementById("criar-mapa");

const tamanhoMapaInput = document.getElementById("tamanho-mapa");
const velocidadeInput = document.getElementById("velocidade-serpente");

const tamanhoSerpenteSpan = document.getElementById("tamanho-serpente");
const macasComidasSpan = document.getElementById("qtde-macas-comidas");

let tamanhoMapa = 10;
let velocidade = 200;
let direcao = "direita";
let cobra = []; //Array de objetos
let maca = {};
let intervalo;

//Vinculando Função ao HTML
criarMapaBtn.addEventListener("click", () => {
    criarMapa();
});

//Mudar de Direção pelos Botões

document.getElementById("cima").addEventListener("click", () => {
    mudarDirecao("cima");
});

document.getElementById("baixo").addEventListener("click", () => {
    mudarDirecao("baixo");
});

document.getElementById("esquerda").addEventListener("click", () => {
    mudarDirecao("esquerda");
});

document.getElementById("direita").addEventListener("click", () => {
    mudarDirecao("direita");
});

//Mudar de Direção pelo Teclado

document.addEventListener("keydown", (tecla) => {
    switch (tecla.key) {
        case "ArrowUp":
        case "w":
        case "W":
            mudarDirecao("cima");
            break;

        case "ArrowDown":
        case "s":
        case "S":
            mudarDirecao("baixo");
            break;

        case "ArrowLeft":
        case "a":
        case "A":
            mudarDirecao("esquerda");
            break;

        case "ArrowRight":
        case "d":
        case "D":
            mudarDirecao("direita");
            break;
    }
});


//Declarando as Funções


function criarMapa() {
    clearInterval(intervalo); //Limpa a variável intervalo, para apagar a serpente e os eventos relacionados a ela

    tamanhoMapa = parseInt(tamanhoMapaInput.value);
    velocidade = 600 - (parseInt(velocidadeInput.value) * 50);

    mapa.innerHTML = "";
    mapa.style.display = "grid";
    mapa.style.gridTemplateColumns = `repeat(${tamanhoMapa}, 1fr)`;
    //mapa.style.gap = "1px";

    for (let i = 0; i < tamanhoMapa * tamanhoMapa; i++) {
        const celula = document.createElement("span");
        celula.classList.add("celula");
        mapa.appendChild(celula);
    }

    cobra = [{ x: (tamanhoMapa/2), y: (tamanhoMapa/2) }];
    direcao = "direita";

    tamanhoSerpenteSpan.textContent = "1";
    macasComidasSpan.textContent = "0";

    gerarMaca();
    desenhar();

    intervalo = setInterval(moverCobra, velocidade); //Executa "moverCobra" a cada "velocidade"ms
}

function gerarMaca() {
    let posicaoValida = false;

    while (!posicaoValida) {
        maca = {
            x: Math.floor(Math.random() * tamanhoMapa),
            y: Math.floor(Math.random() * tamanhoMapa)
        };

        posicaoValida = !cobra.some(
	        //Verifica se o local aleatório em que a maçã será gerado tem uma parte da cobra, caso tenha o código irá se repetir e outra posição será gerada
            parte => parte.x === maca.x && parte.y === maca.y
        );
    }
}

//Representando a Cobra visualmente
function desenhar() {
    const celulas = document.querySelectorAll(".celula");

    //Limpa todas as celulas
    celulas.forEach(celula => {
        celula.style.backgroundColor = "";
    });

    //pega cada parte da cobra, localiza sua posição e pinta o background da cor da serpente
    cobra.forEach(parte => {
	    //similar a um sistema (decima, binario, etc) divemos que o y representaria a segunda casa (a "dezena" do decimal, por exemplo)
        //por isso é multiplicado pelo tamanho do mapa (que seria a "base")
        //já x seria a primeira casa
        const indice = parte.y * tamanhoMapa + parte.x;

        //Aqui é onde de fato é pintado a serpente
        celulas[indice].style.backgroundColor = "green";
    });

    //A lógica é a mesma que a da serpente, a diferença é que só existe 1 maçã (por isso não utilizamos o forEach aqui)
    const indiceMaca = maca.y * tamanhoMapa + maca.x;
    celulas[indiceMaca].style.backgroundColor = "red";
}

function moverCobra() {
    //Faz um copia do objeto que corresoinde à cabeça da cobra (ao invés de apenas apontar para o mesmo endereço na memória [graças ao "..."), para que possa testar possibilidades antes de de fato mover ela
    const cabeca = { ...cobra[0] };

    switch (direcao) {
        case "cima":
            cabeca.y--;
            break;
        case "baixo":
            cabeca.y++;
            break;
        case "esquerda":
            cabeca.x--;
            break;
        case "direita":
            cabeca.x++;
            break;
    }

    if (//Verifica se a cabeça da serpente foi pra fora do mapa
        (cabeca.x < 0) ||
        (cabeca.x >= tamanhoMapa) ||
        (cabeca.y < 0) ||
        (cabeca.y >= tamanhoMapa)
    ) {
        gameOver();
        return;
    }

    if (//verifica se a cabeça da serpente bateu no corpo
        cobra.some(
            parte => parte.x === cabeca.x && parte.y === cabeca.y
        )
    ) {
        gameOver();
        return;
    }

    //adiciona a cabeça como primeira posição do array cobra, empurrando os outros para depois dele
    cobra.unshift(cabeca);

    //Gera nova maçã quando a anterior é comida
    if (cabeca.x === maca.x && cabeca.y === maca.y) {
        gerarMaca();

	//Aumenta o Número de Maçãs Comidas
        macasComidasSpan.textContent =
            parseInt(macasComidasSpan.textContent) + 1;

    } else {
	//Exclui a posição antiga da calda
        cobra.pop();
    }

    tamanhoSerpenteSpan.textContent = cobra.length;

    desenhar();
}

function gameOver() {
    clearInterval(intervalo);
    alert("Game Over!");
}

function mudarDirecao(novaDirecao) {
    const opostos = {
        cima: "baixo",
        baixo: "cima",
        esquerda: "direita",
        direita: "esquerda"
    };

    if (opostos[direcao] !== novaDirecao) {
        direcao = novaDirecao;
    }
    
}

