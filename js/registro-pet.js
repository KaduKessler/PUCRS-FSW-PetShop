document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("imageUpload").addEventListener("change", function () {
        const file = this.files[0];
        const icon = document.getElementById("cameraIcon");
        const imgPreview = document.getElementById("imagePreview");

        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                imgPreview.src = e.target.result;
                imgPreview.style.display = "block";
                icon.style.display = "none"; // Oculta o ícone
            };
            reader.readAsDataURL(file);
        }
    });
});

// Simula o cadastro de pet e exibe o modal de sucesso
function handlePetSubmit() {
    // Aqui você pode adicionar validações extras se necessário

    // Exibe o modal de sucesso
    const sucessoModal = new bootstrap.Modal(document.getElementById('sucessoModal'));
    sucessoModal.show();

    // Reseta o formulário
    document.getElementById('petForm').reset();
    document.getElementById('imagePreview').style.display = "none"; // Oculta a pré-visualização da imagem
    document.getElementById('cameraIcon').style.display = "block"; // Exibe o ícone novamente
}
