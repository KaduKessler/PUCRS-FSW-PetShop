// Mostra ou esconde o campo de endereço de tele-busca
document.getElementById("teleSim").addEventListener("change", function () {
    document.getElementById("enderecoTeleBuscaContainer").style.display = "block";
});
document.getElementById("teleNao").addEventListener("change", function () {
    document.getElementById("enderecoTeleBuscaContainer").style.display = "none";
});

// Script para modal de confirmação
document.getElementById("btnAgendar").addEventListener("click", function () {
    // Verifica se todos os campos obrigatórios estão preenchidos
    const pet = document.getElementById("petSelect").value;
    const data = document.getElementById("dataAgendamento").value;
    const teleBusca = document.querySelector('input[name="teleBusca"]:checked');
    const endereco = document.getElementById("enderecoTeleBusca").value;

    if (pet && data && teleBusca && (teleBusca.value === 'Não' || (endereco && endereco !== 'Selecione o endereço cadastrado'))) {
        let modalBodyContent = `<p><strong>Pet:</strong> ${pet}</p>`;
        modalBodyContent += `<p><strong>Data:</strong> ${new Date(data).toLocaleString()}</p>`;
        modalBodyContent += `<p><strong>Serviço de Tele-busca:</strong> ${teleBusca.value}</p>`;
        if (teleBusca.value === "Sim") {
            modalBodyContent += `<p><strong>Endereço de Tele-busca:</strong> ${endereco}</p>`;
        }

        // Atualiza o conteúdo do modal com as informações preenchidas
        document.getElementById("modalBodyContent").innerHTML = modalBodyContent;

        // Mostra o modal de confirmação
        const confirmModal = new bootstrap.Modal(document.getElementById('confirmModal'));
        confirmModal.show();
    } else {
        alert('Por favor, preencha todos os campos obrigatórios.');
    }
});

// Script para modal de sucesso
document.getElementById("btnConfirmarAgendamento").addEventListener("click", function () {
    // Fecha o modal de confirmação e abre o modal de sucesso
    const confirmModal = bootstrap.Modal.getInstance(document.getElementById('confirmModal'));
    confirmModal.hide();

    const sucessoModal = new bootstrap.Modal(document.getElementById('sucessoModal'));
    sucessoModal.show();

    // Reseta o formulário após o modal de sucesso
    document.getElementById('agendamentoForm').reset();
    document.getElementById("enderecoTeleBuscaContainer").style.display = "none"; // Esconder o endereço de tele-busca
});

// Fechar o modal de sucesso e limpar formulário
document.getElementById("btnFecharSucesso").addEventListener("click", function () {
    const sucessoModal = bootstrap.Modal.getInstance(document.getElementById('sucessoModal'));
    sucessoModal.hide();
});