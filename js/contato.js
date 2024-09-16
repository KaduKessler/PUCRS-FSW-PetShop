// Função para exibir o modal de sucesso
function enviarFormulario() {
    // Verifica se os campos necessários estão preenchidos
    const assunto = document.getElementById('assunto').value;
    const mensagem = document.getElementById('mensagem').value;

    if (assunto.trim() === '' || mensagem.trim() === '') {
        alert('Por favor, preencha todos os campos.');
        return false;
    }

    // Exibe o modal
    const modal = new bootstrap.Modal(document.getElementById('sucessoModal'));
    modal.show();

    // Limpa o formulário após o envio
    document.getElementById("contatoForm").reset();

    return false; // Impede o envio real do formulário
}
