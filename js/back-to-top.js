// Obter o botão
let mybutton = document.getElementById("btn-back-to-top");
let isVisible = false; // Variável de controle para o estado de visibilidade do botão

// Função de scroll para mostrar/ocultar o botão
window.onscroll = function () {
    scrollFunction();
};

function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        if (!isVisible) {  // Se o botão ainda não estiver visível, aplicamos o fadeIn
            mybutton.style.display = "block";
            mybutton.classList.remove('fadeOut');
            mybutton.classList.add('fadeIn');
            isVisible = true;  // Atualizamos o estado de visibilidade
        }
    } else {
        if (isVisible) {  // Se o botão estiver visível e precisa ser oculto
            mybutton.classList.remove('fadeIn');
            mybutton.classList.add('fadeOut');
            setTimeout(function () {
                mybutton.style.display = "none";
            }, 500); // Tempo correspondente ao fadeOut
            isVisible = false;  // Atualizamos o estado de visibilidade
        }
    }
}

// Função para voltar ao topo
mybutton.addEventListener("click", backToTop);

function backToTop() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}
