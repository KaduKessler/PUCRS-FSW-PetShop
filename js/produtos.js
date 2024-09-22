document.addEventListener('DOMContentLoaded', function () {
    // Variável global para manter o estado de como ordenar os produtos
    let ordemAtual = 'popular';

    // Gerar estrelas de avaliação
    function gerarEstrelas(nota) {
        let estrelas = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= nota) {
                estrelas += '<i class="fas fa-star"></i>';
            } else if (i - nota < 1) {
                estrelas += '<i class="fas fa-star-half-alt"></i>';
            } else {
                estrelas += '<i class="far fa-star"></i>';
            }
        }
        return estrelas;
    }

    // Carregar produtos do arquivo JSON
    fetch('data/produtos.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao carregar o arquivo JSON: ' + response.status);
            }
            return response.json();
        })
        .then(produtos => {
            const container = document.querySelector('.row.justify-content-start');

            // Limpar o container de produtos
            container.innerHTML = '';

            // Gerar produtos dinamicamente
            produtos.forEach(produto => {
                const productHTML = `
                    <div class="col-md-4 col-lg-3 mb-4" data-idade="${produto.idade}" data-tamanho="${produto.tamanho}" data-peso="${produto.peso}" data-preco="${produto.preco}" data-avaliacao="${produto.avaliacao}">
                        <div class="card product-card h-100">
                            <a href="#">
                                <div class="product-image-container">
                                    <img src="${produto.imagem}" class="product-img" alt="${produto.nome}">
                                </div>
                            </a>
                            <div class="card-body text-center">
                                <a href="#" class="product-link">
                                    <h6 class="card-title">${produto.nome}</h6>
                                </a>
                                <p class="text-muted">${produto.descricao}</p>
                                <div class="rating">
                                    ${gerarEstrelas(produto.avaliacao)}
                                    <span>${produto.avaliacao}/5</span>
                                </div>
                                <h6 class="price">R$${produto.preco}</h6>
                            </div>
                        </div>
                    </div>
                `;

                container.insertAdjacentHTML('beforeend', productHTML);
            });

            // Chama a função aplicarFiltros após carregar os produtos
            aplicarFiltros();
        })
        .catch(error => console.error('Erro ao carregar produtos:', error));

    // Função para aplicar os filtros e ordenação
    function aplicarFiltros() {
        // Obter os valores dos filtros selecionados
        const idadeSelecionada = [];
        const tamanhoSelecionado = [];
        const pesoSelecionado = [];
        const precoMax = parseFloat(document.getElementById('priceRange').value);

        // Filtros de Idade
        if (document.getElementById('filhotes').checked) idadeSelecionada.push('filhotes');
        if (document.getElementById('adultos').checked) idadeSelecionada.push('adultos');
        if (document.getElementById('idosos').checked) idadeSelecionada.push('senior');

        // Filtros de Tamanho (inclui comparação com media-grande)
        if (document.getElementById('pequena').checked) tamanhoSelecionado.push('pequena');
        if (document.getElementById('media').checked) tamanhoSelecionado.push('media');
        if (document.getElementById('grande').checked) tamanhoSelecionado.push('grande');

        // Filtros de Peso
        if (document.getElementById('peso1kg').checked) pesoSelecionado.push('1kg');
        if (document.getElementById('peso5kg').checked) pesoSelecionado.push('5kg');
        if (document.getElementById('peso10kg').checked) pesoSelecionado.push('10kg');
        if (document.getElementById('peso10maiskg').checked) pesoSelecionado.push('10maiskg');

        // Selecionar todos os produtos
        const produtos = Array.from(document.querySelectorAll('.col-md-4.col-lg-3.mb-4'));

        // Ordenar os produtos com base na ordem atual
        produtos.sort((a, b) => {
            const precoA = parseFloat(a.getAttribute('data-preco'));
            const precoB = parseFloat(b.getAttribute('data-preco'));
            const avaliacaoA = parseFloat(a.getAttribute('data-avaliacao'));
            const avaliacaoB = parseFloat(b.getAttribute('data-avaliacao'));

            if (ordemAtual === 'menor-preco') {
                return precoA - precoB;
            } else if (ordemAtual === 'maior-preco') {
                return precoB - precoA;
            } else if (ordemAtual === 'popular') {
                return avaliacaoB - avaliacaoA;
            }
        });

        // Iterar sobre os produtos e exibir ou ocultar conforme os filtros
        produtos.forEach(function (produto) {
            const idadeProduto = produto.getAttribute('data-idade');
            const tamanhoProduto = produto.getAttribute('data-tamanho');
            const pesoProduto = parseFloat(produto.getAttribute('data-peso'));
            const precoProduto = parseFloat(produto.getAttribute('data-preco'));

            // Lógica de exibição dos produtos (ajustando para media-grande)
            const idadeMatch = idadeSelecionada.length === 0 || idadeSelecionada.includes(idadeProduto);
            const tamanhoMatch = tamanhoSelecionado.length === 0 ||
                tamanhoSelecionado.includes(tamanhoProduto) ||
                (tamanhoProduto === 'media-grande' &&
                    (tamanhoSelecionado.includes('media') || tamanhoSelecionado.includes('grande')));

            // Lógica de Peso (inclui nova faixa de peso 10,1kg+)
            let pesoMatch = pesoSelecionado.length === 0;
            if (pesoSelecionado.includes('1kg') && pesoProduto <= 1) pesoMatch = true;
            if (pesoSelecionado.includes('5kg') && pesoProduto > 1 && pesoProduto <= 5) pesoMatch = true;
            if (pesoSelecionado.includes('10kg') && pesoProduto > 5 && pesoProduto <= 10) pesoMatch = true;
            if (pesoSelecionado.includes('10maiskg') && pesoProduto > 10) pesoMatch = true;

            // Lógica de Preço
            const precoMatch = precoProduto <= precoMax;

            // Mostrar ou ocultar o produto com base nos filtros aplicados
            if (idadeMatch && tamanhoMatch && pesoMatch && precoMatch) {
                produto.style.display = 'block';
            } else {
                produto.style.display = 'none';
            }
        });

        // Limpar o container de produtos e reapendá-los ordenados
        const container = document.querySelector('.row.justify-content-start');
        container.innerHTML = '';
        produtos.forEach(produto => container.appendChild(produto));
    }

    // Função para lidar com a seleção de "Filtrar por"
    document.querySelectorAll('.dropdown-item').forEach(item => {
        item.addEventListener('click', function (e) {
            e.preventDefault();
            ordemAtual = this.getAttribute('data-sort');
            document.getElementById('dropdownMenuButton1').textContent = `Filtrar por: ${this.textContent}`;
            aplicarFiltros();
        });
    });

    // Adicionar evento para aplicar filtros quando os checkboxes forem modificados
    document.querySelectorAll('input[type="checkbox"], #priceRange').forEach(function (element) {
        element.addEventListener('change', aplicarFiltros);
    });
});
