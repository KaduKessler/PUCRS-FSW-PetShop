document.addEventListener('DOMContentLoaded', function () {
    // Obter categoria da página atual
    const categoriaAtual = document.body.getAttribute('data-categoria');

    // Variáveis globais
    let ordemAtual = 'popular';
    let todosProdutos = [];
    let atributosUnicos = {};

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

            // Extrair valores únicos dos atributos
            atributosUnicos = extrairAtributosUnicos(produtos);

            // Gerar filtros dinamicamente
            gerarFiltrosDinamicos(atributosUnicos);

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

    // Função para extrair atributos únicos
    function extrairAtributosUnicos(produtos) {
        const atributos = {};

        produtos.forEach(produto => {
            for (let chave in produto) {
                if (['tipo', 'tamanho', 'idade', 'peso'].includes(chave)) {
                    if (!atributos[chave]) {
                        atributos[chave] = new Set();
                    }
                    atributos[chave].add(produto[chave]);
                }
            }
        });

        // Converter os Sets para Arrays e ordenar
        for (let chave in atributos) {
            if (chave === 'peso') {
                // Para o atributo 'peso', ordenar numericamente
                atributos[chave] = Array.from(atributos[chave]).sort((a, b) => {
                    const valorA = parseFloat(a);
                    const valorB = parseFloat(b);
                    return valorA - valorB;
                });
            } else {
                // Para os demais atributos, ordenar alfabeticamente
                atributos[chave] = Array.from(atributos[chave]).sort();
            }
        }

        return atributos;
    }

    // Função para gerar filtros dinamicamente
    function gerarFiltrosDinamicos(atributos) {
        // Gerar filtros de Tipo
        if (atributos.tipo && atributos.tipo.length > 0) {
            const filtroTipo = document.getElementById('filtroTipo');
            atributos.tipo.forEach(valor => {
                const idCheckbox = `tipo-${valor}`;
                const checkboxHTML = `
                    <div class="form-check custom-checkbox">
                        <input class="form-check-input" type="checkbox" id="${idCheckbox}" data-atributo="tipo" value="${valor}">
                        <label class="form-check-label" for="${idCheckbox}">${capitalizarPrimeiraLetra(valor)}</label>
                    </div>
                `;
                filtroTipo.insertAdjacentHTML('beforeend', checkboxHTML);
            });
        } else {
            // Se não houver filtro de tipo,  ocultamos a seção
            const filtroTipo = document.getElementById('filtroTipo');
            if (filtroTipo) filtroTipo.style.display = 'none';
        }

        // Gerar filtros de Tamanho
        if (atributos.tamanho && atributos.tamanho.length > 0) {
            const filtroTamanho = document.getElementById('filtroTamanho');
            atributos.tamanho.forEach(valor => {
                const idCheckbox = `tamanho-${valor}`;
                const checkboxHTML = `
                    <div class="form-check custom-checkbox">
                        <input class="form-check-input" type="checkbox" id="${idCheckbox}" data-atributo="tamanho" value="${valor}">
                        <label class="form-check-label" for="${idCheckbox}">${capitalizarPrimeiraLetra(valor)}</label>
                    </div>
                `;
                filtroTamanho.insertAdjacentHTML('beforeend', checkboxHTML);
            });
        } else {
            // Se não tiver filtro de tamanho, ocultamos a seção
            const filtroTamanho = document.getElementById('filtroTamanho');
            if (filtroTamanho) filtroTamanho.style.display = 'none';
        }

        // Gerar filtros de idade
        if (atributos.idade && atributos.idade.length > 0) {
            const filtroIdade = document.getElementById('filtroIdade');
            atributos.idade.forEach(valor => {
                const idCheckbox = `idade-${valor}`;
                const checkboxHTML = `
                    <div class="form-check custom-checkbox">
                        <input class="form-check-input" type="checkbox" id="${idCheckbox}" data-atributo="idade" value="${valor}">
                        <label class="form-check-label" for="${idCheckbox}">${capitalizarPrimeiraLetra(valor)}</label>
                    </div>
                `;
                filtroIdade.insertAdjacentHTML('beforeend', checkboxHTML);
            });
        } else {
            // Se não tiver filtro de idade, ocultamos a seção
            const filtroIdade = document.getElementById('filtroIdade');
            if (filtroIdade) filtroIdade.style.display = 'none';
        }

        // Gerar filtros de Peso
        if (atributos.peso && atributos.peso.length > 0) {
            const filtroPeso = document.getElementById('filtroPeso');
            atributos.peso.forEach(valor => {
                const idCheckbox = `peso-${valor}`;
                const checkboxHTML = `
                    <div class="form-check custom-checkbox">
                        <input class="form-check-input" type="checkbox" id="${idCheckbox}" data-atributo="peso" value="${valor}">
                        <label class="form-check-label" for="${idCheckbox}">${valor}</label>
                    </div>
                `;
                filtroPeso.insertAdjacentHTML('beforeend', checkboxHTML);
            });
        } else {
            // Se não houver filtro de peso, remova a seção
            const filtroPeso = document.getElementById('filtroPeso');
            if (filtroPeso) filtroPeso.style.display = 'none';
        }

        // Adicionar eventos aos checkboxes gerados
        const checkboxes = document.querySelectorAll('input[type="checkbox"][data-atributo]');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', aplicarFiltros);
        });
    }

    // Função para capitalizar a primeira letra (no JSON os valores estão em minúsculo)
    function capitalizarPrimeiraLetra(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    // Função para aplicar os filtros e ordenação
    function aplicarFiltros() {
        const priceRange = document.getElementById('priceRange');
        const precoMax = parseFloat(priceRange.value);
        const precoMaximoPossivel = parseFloat(priceRange.max);
        const aplicarFiltroPreco = precoMax < precoMaximoPossivel;

        // Usar 'todosProdutos' como base para os filtros
        let produtos = todosProdutos.slice(); // Fazer uma cópia para não modificar o array original

        // Obter filtros selecionados
        const checkboxes = document.querySelectorAll('input[type="checkbox"][data-atributo]');
        const filtrosSelecionados = {};

        checkboxes.forEach(checkbox => {
            if (checkbox.checked) {
                const atributo = checkbox.getAttribute('data-atributo');
                const valor = checkbox.value;

                if (!filtrosSelecionados[atributo]) {
                    filtrosSelecionados[atributo] = new Set();
                }
                filtrosSelecionados[atributo].add(valor);
            }
        });

        // Aplicar filtros aos produtos
        produtos = produtos.filter(produto => {
            let atendeFiltros = true;

            for (let atributo in filtrosSelecionados) {
                const valorProduto = produto.getAttribute(`data-${atributo}`);
                const valoresFiltro = filtrosSelecionados[atributo];

                if (valoresFiltro.size > 0 && !valoresFiltro.has(valorProduto)) {
                    atendeFiltros = false;
                    break;
                }
            }

            const precoProduto = parseFloat(produto.getAttribute('data-preco'));
            const precoMatch = !aplicarFiltroPreco || precoProduto <= precoMax;

            return atendeFiltros && precoMatch;
        });

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

    // Aplicar fltros quando o slider for solto
    priceRange.addEventListener('change', aplicarFiltros);

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
});
