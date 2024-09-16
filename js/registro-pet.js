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