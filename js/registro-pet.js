document.addEventListener("DOMContentLoaded", function () {
    const imageUpload = document.getElementById("imageUpload");
    const iconContainer = document.querySelector(".camera-container");
    const imgPreview = document.getElementById("imagePreview");

    // Pré-visualização da imagem do pet
    imageUpload.addEventListener("change", function () {
        const file = this.files[0];

        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                imgPreview.src = e.target.result;
                imgPreview.classList.add("active");
                imgPreview.style.display = "block";
                iconContainer.style.display = "none";
            };
            reader.readAsDataURL(file);
        }
    });

    // Função para sincronizar o checkbox 'Não sei' com o campo de data
    const nascimentoPet = document.getElementById('nascimentoPet');
    const nascimentoDesconhecido = document.getElementById('nascimentoDesconhecido');

    // Desmarca o 'Não sei' ao selecionar uma data
    nascimentoPet.addEventListener('input', function () {
        if (nascimentoPet.value) {
            nascimentoDesconhecido.checked = false;
        }
    });

    // Limpa a data ao marcar 'Não sei'
    nascimentoDesconhecido.addEventListener('change', function () {
        if (nascimentoDesconhecido.checked) {
            nascimentoPet.value = '';
        }
    });
});

// Simula o cadastro de pet e exibe o modal de sucesso
function handlePetSubmit() {
    // Exibe o modal de sucesso
    const sucessoModal = new bootstrap.Modal(document.getElementById('sucessoModal'));
    sucessoModal.show();

    // Reseta o formulário
    document.getElementById('petForm').reset();

    // Reseta a pré-visualização e exibe o ícone da câmera
    const imgPreview = document.getElementById("imagePreview");
    const iconContainer = document.querySelector(".camera-container");
    imgPreview.src = "";
    imgPreview.classList.remove("active");
    imgPreview.style.display = "none";
    iconContainer.style.display = "flex";
}
