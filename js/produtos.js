document.addEventListener('DOMContentLoaded', function () {
    // Obter categoria da página atual
    const categoriaAtual = document.body.getAttribute('data-categoria');

    // Variável global para manter o estado de como ordenar os produtos
    let ordemAtual = 'popular';

    // Variável global para manter todos os produtos da categoria atual
    let todosProdutos = [];

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

    // Função para limitar o número de caracteres no título
    function limitarTexto(texto, limite) {
        return texto.length > limite ? texto.substring(0, limite) + '...' : texto;
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

            // Filtrar produtos da categoria atual
            produtos = produtos.filter(produto => produto.categoria === categoriaAtual);

            // Limpar o container de produtos
            container.innerHTML = '';

            // Gerar produtos dinamicamente e armazená-los em 'todosProdutos'
            produtos.forEach(produto => {
                // Limitar o texto no título
                const tituloLimitado = limitarTexto(produto.nome, 45);

                // Incluir data attributes conforme a categoria
                let dataAttributes = `data-preco="${produto.preco}" data-avaliacao="${produto.avaliacao}"`;

                if (produto.idade) {
                    dataAttributes += ` data-idade="${produto.idade}"`;
                }
                if (produto.tamanho) {
                    dataAttributes += ` data-tamanho="${produto.tamanho}"`;
                }
                if (produto.peso) {
                    dataAttributes += ` data-peso="${produto.peso}"`;
                }
                if (produto.tipo) {
                    dataAttributes += ` data-tipo="${produto.tipo}"`;
                }

                const productHTML = `
                <div class="col-md-4 col-lg-3 mb-4" ${dataAttributes}>
                    <div class="card product-card h-100">
                        <a href="#">
                            <div class="product-image-container">
                                <img src="${produto.imagem}" class="product-img" alt="${produto.nome}">
                            </div>
                        </a>
                        <div class="card-body text-center">
                            <a href="#" class="product-link">
                                <h6 class="card-title">${tituloLimitado}</h6>
                            </a>
                            <div class="rating">
                                ${gerarEstrelas(produto.avaliacao)}
                                <span>${produto.avaliacao}/5</span>
                            </div>
                            <h6 class="price">R$${produto.preco}</h6>
                        </div>
                    </div>
                </div>
            `;

                // Adicionar o produto ao container
                container.insertAdjacentHTML('beforeend', productHTML);

                // Adicionar o elemento do produto à lista todosProdutos
                const produtoElement = container.lastElementChild;
                todosProdutos.push(produtoElement);
            });

            // Chama a função aplicarFiltros após carregar os produtos
            aplicarFiltros();
        })
        .catch(error => console.error('Erro ao carregar produtos:', error));

    // Função para aplicar os filtros e ordenação
    function aplicarFiltros() {
        const priceRange = document.getElementById('priceRange');
        const precoMax = parseFloat(priceRange.value);
        const precoMaximoPossivel = parseFloat(priceRange.max);
        const aplicarFiltroPreco = precoMax < precoMaximoPossivel;

        // Usar 'todosProdutos' como base para os filtros
        let produtos = todosProdutos.slice(); // Fazer uma cópia para não modificar o array original

        // Aplicar filtros específicos da categoria
        if (categoriaAtual === 'ração') {
            // Filtros de Idade
            const idadeSelecionada = [];
            if (document.getElementById('filhotes').checked) idadeSelecionada.push('filhotes');
            if (document.getElementById('adultos').checked) idadeSelecionada.push('adultos');
            if (document.getElementById('idosos').checked) idadeSelecionada.push('senior');

            // Filtros de Tamanho
            const tamanhoSelecionado = [];
            if (document.getElementById('pequena').checked) tamanhoSelecionado.push('pequena');
            if (document.getElementById('media').checked) tamanhoSelecionado.push('media');
            if (document.getElementById('grande').checked) tamanhoSelecionado.push('grande');

            // Filtros de Peso
            const pesoSelecionado = [];
            if (document.getElementById('peso1kg').checked) pesoSelecionado.push('1kg');
            if (document.getElementById('peso2kg').checked) pesoSelecionado.push('2kg');
            if (document.getElementById('peso3kg').checked) pesoSelecionado.push('3kg');
            if (document.getElementById('peso5kg').checked) pesoSelecionado.push('5kg');
            if (document.getElementById('peso10kg').checked) pesoSelecionado.push('10kg');
            if (document.getElementById('peso15kg').checked) pesoSelecionado.push('15kg');


            // Aplicar filtros aos produtos
            produtos = produtos.filter(produto => {
                const idadeProduto = produto.getAttribute('data-idade');
                const tamanhoProduto = produto.getAttribute('data-tamanho');
                const pesoProduto = produto.getAttribute('data-peso');
                const precoProduto = parseFloat(produto.getAttribute('data-preco'));

                const idadeMatch = idadeSelecionada.length === 0 || idadeSelecionada.includes(idadeProduto);
                const tamanhoMatch = tamanhoSelecionado.length === 0 || tamanhoSelecionado.includes(tamanhoProduto);
                const pesoMatch = pesoSelecionado.length === 0 || pesoSelecionado.includes(pesoProduto);
                const precoMatch = !aplicarFiltroPreco || precoProduto <= precoMax;

                return idadeMatch && tamanhoMatch && pesoMatch && precoMatch;
            });
        } else if (categoriaAtual === 'brinquedos') {
            // Filtros de Tipo
            const tiposSelecionados = [];
            if (document.getElementById('tipoBola').checked) tiposSelecionados.push('bola');
            if (document.getElementById('tipoCorda').checked) tiposSelecionados.push('corda');
            if (document.getElementById('tipoPelucia').checked) tiposSelecionados.push('pelúcia');
            if (document.getElementById('tipoMordedor').checked) tiposSelecionados.push('mordedor');
            if (document.getElementById('tipoInterativo').checked) tiposSelecionados.push('interativo');

            // Filtros de Tamanho
            const tamanhosSelecionados = [];
            if (document.getElementById('tamanhoPequeno').checked) tamanhosSelecionados.push('pequeno');
            if (document.getElementById('tamanhoMedio').checked) tamanhosSelecionados.push('medio');
            if (document.getElementById('tamanhoGrande').checked) tamanhosSelecionados.push('grande');

            // Aplicar filtros aos produtos
            produtos = produtos.filter(produto => {
                const tipoProduto = produto.getAttribute('data-tipo');
                const tamanhoProduto = produto.getAttribute('data-tamanho');
                const precoProduto = parseFloat(produto.getAttribute('data-preco'));

                const tipoMatch = tiposSelecionados.length === 0 || tiposSelecionados.includes(tipoProduto);
                const tamanhoMatch = tamanhosSelecionados.length === 0 || tamanhosSelecionados.includes(tamanhoProduto);
                const precoMatch = !aplicarFiltroPreco || precoProduto <= precoMax;

                return tipoMatch && tamanhoMatch && precoMatch;
            });
        } else if (categoriaAtual === 'higiene') {
            // Filtros de Tipo
            const tiposSelecionados = [];
            if (document.getElementById('tipoShampoo').checked) tiposSelecionados.push('shampoo');
            if (document.getElementById('tipoCondicionador').checked) tiposSelecionados.push('condicionador');
            if (document.getElementById('tipoPerfume').checked) tiposSelecionados.push('perfume');
            if (document.getElementById('tipoLenço').checked) tiposSelecionados.push('lenço');
            if (document.getElementById('tipoSabonete').checked) tiposSelecionados.push('sabonete');

            // Filtros de Tamanho
            const tamanhosSelecionados = [];
            if (document.getElementById('tamanho50ml').checked) tamanhosSelecionados.push('50ml');
            if (document.getElementById('tamanho80g').checked) tamanhosSelecionados.push('80g');
            if (document.getElementById('tamanho90g').checked) tamanhosSelecionados.push('90g');
            if (document.getElementById('tamanho100ml').checked) tamanhosSelecionados.push('100ml');
            if (document.getElementById('tamanho300ml').checked) tamanhosSelecionados.push('300ml');
            if (document.getElementById('tamanho500ml').checked) tamanhosSelecionados.push('500ml');
            if (document.getElementById('tamanho75unidades').checked) tamanhosSelecionados.push('75 unidades');
            if (document.getElementById('tamanho100unidades').checked) tamanhosSelecionados.push('100 unidades');

            // Aplicar filtros aos produtos
            produtos = produtos.filter(produto => {
                const tipoProduto = produto.getAttribute('data-tipo');
                const tamanhoProduto = produto.getAttribute('data-tamanho');
                const precoProduto = parseFloat(produto.getAttribute('data-preco'));

                const tipoMatch = tiposSelecionados.length === 0 || tiposSelecionados.includes(tipoProduto);
                const tamanhoMatch = tamanhosSelecionados.length === 0 || tamanhosSelecionados.includes(tamanhoProduto);
                const precoMatch = !aplicarFiltroPreco || precoProduto <= precoMax;

                return tipoMatch && tamanhoMatch && precoMatch;
            });
        } else if (categoriaAtual === 'acessórios') {
            // Filtros de Tipo
            const tiposSelecionados = [];
            if (document.getElementById('tipoCama').checked) tiposSelecionados.push('cama');
            if (document.getElementById('tipoColeira').checked) tiposSelecionados.push('coleira');
            if (document.getElementById('tipoGuia').checked) tiposSelecionados.push('guia');
            if (document.getElementById('tipoComedouro').checked) tiposSelecionados.push('comedouro');
            if (document.getElementById('tipoBebedouro').checked) tiposSelecionados.push('bebedouro');

            // Filtros de Tamanho
            const tamanhosSelecionados = [];
            if (document.getElementById('tamanhoPequeno').checked) tamanhosSelecionados.push('pequeno');
            if (document.getElementById('tamanhoMedio').checked) tamanhosSelecionados.push('medio');
            if (document.getElementById('tamanhoGrande').checked) tamanhosSelecionados.push('grande');
            if (document.getElementById('tamanho500ml').checked) tamanhosSelecionados.push('500ml');
            if (document.getElementById('tamanho2L').checked) tamanhosSelecionados.push('2L');

            // Aplicar filtros aos produtos
            produtos = produtos.filter(produto => {
                const tipoProduto = produto.getAttribute('data-tipo');
                const tamanhoProduto = produto.getAttribute('data-tamanho');
                const precoProduto = parseFloat(produto.getAttribute('data-preco'));

                const tipoMatch = tiposSelecionados.length === 0 || tiposSelecionados.includes(tipoProduto);
                const tamanhoMatch = tamanhosSelecionados.length === 0 || tamanhosSelecionados.includes(tamanhoProduto);
                const precoMatch = !aplicarFiltroPreco || precoProduto <= precoMax;

                return tipoMatch && tamanhoMatch && precoMatch;
            });
        }

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

        // Atualizar a exibição dos produtos
        const container = document.querySelector('.row.justify-content-start');
        container.innerHTML = '';
        produtos.forEach(produto => container.appendChild(produto));
    }

    // Atualizar o valor do slider em tempo real
    const priceRange = document.getElementById('priceRange');
    const precoAtual = document.getElementById('precoAtual');

    // Definir valor inicial do preço atual para o máximo possível
    priceRange.value = priceRange.max;
    precoAtual.textContent = `R$${priceRange.value}`;

    // Atualizar o valor conforme o usuário move o slider
    priceRange.addEventListener('input', function () {
        precoAtual.textContent = `R$${this.value}`;
    });

    // Função para lidar com a seleção de "Filtrar por"
    document.querySelectorAll('.dropdown-item').forEach(item => {
        item.addEventListener('click', function (e) {
            e.preventDefault();

            // Verifique se o item contém o atributo 'data-sort'
            if (this.hasAttribute('data-sort')) {
                ordemAtual = this.getAttribute('data-sort');
                document.getElementById('dropdownMenuButton1').textContent = `Filtrar por: ${this.textContent}`;
                aplicarFiltros();
            }
        });
    });

    // Adicionar evento para aplicar filtros quando os checkboxes forem modificados
    document.querySelectorAll('input[type="checkbox"], #priceRange').forEach(function (element) {
        element.addEventListener('change', aplicarFiltros);
    });
});
