/**
 * Carrega um componente HTML em um elemento alvo.
 * @param {string} filePath - O caminho do arquivo do componente a ser carregado.
 * @param {string} targetElement - O ID do elemento alvo onde o componente será inserido.
 * @returns {void}
 * @throws {Error} Se ocorrer um erro ao carregar o arquivo do componente.
 */
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

loadComponent('components/header.html', 'header');
loadComponent('components/footer.html', 'footer');
