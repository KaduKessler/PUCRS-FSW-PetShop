// Função para exibir o modal de sucesso
function enviarFormulario() {
    // Verifica se os campos necessários estão preenchidos
    const assunto = document.getElementById('assunto').value;
    const mensagem = document.getElementById('mensagem').value;

    if (assunto.trim() === '' || mensagem.trim() === '') {
        alert('Por favor, preencha todos os campos.');
        return false;
    }

    // Exibe o modal de sucesso
    const modal = new bootstrap.Modal(document.getElementById('sucessoModal'));
    modal.show();

    // Limpa o formulário após o envio
    document.getElementById("contatoForm").reset();

    // Reativa os campos de email e usuário, se estavam simulando login
    reativarCampos();

    // Reseta o botão para "Simular Login"
    resetLoginButton();

    return false; // Impede o envio real do formulário
}

// Função para simular login
function simularLogin() {
    const simulatedEmail = "usuario@exemplo.com";
    const simulatedUsername = "Nome do Usuário";

    // Preenche os campos com dados simulados e desabilita-os
    document.getElementById("email").value = simulatedEmail;
    document.getElementById("usuario").value = simulatedUsername;
    document.getElementById("email").disabled = true;
    document.getElementById("usuario").disabled = true;

    // Troca o botão "Simular Login" para "Deslogar"
    const loginButton = document.getElementById("simulate-login");
    loginButton.innerText = "Deslogar";
    loginButton.classList.remove("btn-secondary");
    loginButton.classList.add("btn-danger");

    // Atualiza o evento para permitir o logout
    loginButton.removeEventListener("click", simularLogin);
    loginButton.addEventListener("click", deslogar);
}

// Função para deslogar e reativar os campos
function deslogar() {
    // Limpa e reativa os campos
    document.getElementById("email").value = "";
    document.getElementById("usuario").value = "";
    document.getElementById("email").disabled = false;
    document.getElementById("usuario").disabled = false;

    // Reseta o botão para "Simular Login"
    resetLoginButton();
}

// Função para reativar campos após envio do formulário (caso estivessem desabilitados)
function reativarCampos() {
    document.getElementById("email").disabled = false;
    document.getElementById("usuario").disabled = false;
}

// Função para resetar o botão para "Simular Login"
function resetLoginButton() {
    const loginButton = document.getElementById("simulate-login");
    loginButton.innerText = "Simular Login";
    loginButton.classList.remove("btn-danger");
    loginButton.classList.add("btn-secondary");

    // Atualiza o evento para permitir o login simulado novamente
    loginButton.removeEventListener("click", deslogar);
    loginButton.addEventListener("click", simularLogin);
}

// Adiciona o evento de simulação de login ao botão no carregamento da página
document.addEventListener("DOMContentLoaded", function () {
    const loginButton = document.getElementById("simulate-login");
    loginButton.addEventListener("click", simularLogin);
});

// Atualiza o contador de caracteres
function atualizarContador() {
    const mensagemInput = document.getElementById('mensagem');
    const contador = document.getElementById('contador');
    const limite = 500;
    const quantidadeCaracteres = mensagemInput.value.length;

    // Atualiza o texto do contador
    contador.textContent = `${quantidadeCaracteres}/${limite}`;

    // Limita a quantidade de caracteres
    if (quantidadeCaracteres >= limite) {
        mensagemInput.value = mensagemInput.value.substring(0, limite); // Limita a entrada
        // Atualiza novamente o contador após truncar
        contador.textContent = `${limite}/${limite}`;
    }
}

// Inicializa o contador
document.addEventListener('DOMContentLoaded', function () {
    atualizarContador(); // Para garantir que o contador comece em 0
});
