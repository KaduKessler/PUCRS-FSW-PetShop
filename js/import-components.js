// Função para carregar um arquivo HTML e inserir no elemento alvo
function loadComponent(filePath, targetElement) {
    fetch(filePath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro ao carregar o arquivo ${filePath}: ${response.statusText}`);
            }
            return response.text();
        })
        .then(data => {
            document.getElementById(targetElement).innerHTML = data;
        })
        .catch(error => {
            console.error('Erro ao carregar o componente:', error);
        });
}

// Carregar os componentes
loadComponent('components/header.html', 'header');
loadComponent('components/footer.html', 'footer');
