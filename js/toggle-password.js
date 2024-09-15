document.querySelectorAll('.password-toggle-btn').forEach(button => {
    button.addEventListener('click', function () {
        const input = this.previousElementSibling;
        const icon = this.querySelector('svg');

        if (input.type === 'password') {
            input.type = 'text';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        } else {
            input.type = 'password';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    });
});
