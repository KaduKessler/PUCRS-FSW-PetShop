document.addEventListener('DOMContentLoaded', function () {
    fetch('data/produtos.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao carregar o arquivo JSON: ' + response.status);
            }
            return response.json();
        })
        .then(produtos => {
            // -------------------------------
            // Seção de "Novos Produtos"
            // -------------------------------

            // Filtrar produtos novos
            const produtosNovos = produtos.filter(produto => produto.novo);

            // Limitar a quantidade de produtos exibidos
            const produtosNovosLimite = produtosNovos.slice(0, 4);

            // Selecionar o container
            const novosProdutosContainer = document.getElementById('novosProdutosContainer');

            // Limpar o container
            novosProdutosContainer.innerHTML = '';

            // Gerar os produtos dinamicamente
            produtosNovosLimite.forEach(produto => {
                // Limitar o texto no título
                const tituloLimitado = limitarTexto(produto.nome, 45);

                // Gerar estrelas de avaliação
                const estrelasHTML = gerarEstrelas(produto.avaliacao);

                // Verificar se o produto tem desconto
                const precoOriginal = produto.precoOriginal || produto.preco;
                const temDesconto = precoOriginal > produto.preco;

                // Gerar as badges
                let badgesHTML = '';
                if (produto.novo) {
                    badgesHTML += '<span class="badge bg-primary badge-new">Novo</span>';
                }
                if (temDesconto) {
                    const descontoPercentual = Math.round(((precoOriginal - produto.preco) / precoOriginal) * 100);
                    badgesHTML += `<span class="badge bg-danger badge-discount">-${descontoPercentual}%</span>`;
                }

                // Formatar os preços
                const precoFormatado = `R$${produto.preco.toFixed(2).replace('.', ',')}`;
                const precoOriginalFormatado = `R$${precoOriginal.toFixed(2).replace('.', ',')}`;

                // Gerar o HTML do produto
                const produtoHTML = `
                <div class="col-lg-3 col-md-4 col-sm-6 mb-4">
                    <div class="card zoom-effect h-100">
                        <a href="#" class="product-link">
                            <div class="product-image-container">
                                <div class="badge-container">
                                    ${badgesHTML}
                                </div>
                                <img src="${produto.imagem}" class="product-img" alt="${produto.nome}">
                            </div>
                        </a>
                        <div class="card-body text-center">
                            <a href="#" class="product-link">
                                <h6 class="card-title">${tituloLimitado}</h6>
                            </a>
                            <div class="rating">
                                ${estrelasHTML}
                                <span>${produto.avaliacao}/5</span>
                            </div>
                            <h6 class="price">
                                ${temDesconto ? `<s>${precoOriginalFormatado}</s> <span class="text-danger">${precoFormatado}</span>` : `${precoFormatado}`}
                            </h6>
                        </div>
                    </div>
                </div>
                `;

                // Inserir o produto no container
                novosProdutosContainer.insertAdjacentHTML('beforeend', produtoHTML);
            });

            // -------------------------------
            // Seção de "Ofertas Especiais"
            // -------------------------------

            // Filtrar produtos com desconto
            const produtosComDesconto = produtos.filter(produto => produto.precoOriginal && produto.preco < produto.precoOriginal);

            // Limitar a quantidade de produtos exibidos
            const ofertasLimite = produtosComDesconto.slice(0, 4);

            // Selecionar o container
            const ofertasContainer = document.getElementById('ofertasEspeciaisContainer');

            // Limpar o container
            ofertasContainer.innerHTML = '';

            // Gerar os produtos dinamicamente
            ofertasLimite.forEach(produto => {
                // Limitar o texto no título
                const tituloLimitado = limitarTexto(produto.nome, 45);

                // Gerar estrelas de avaliação
                const estrelasHTML = gerarEstrelas(produto.avaliacao);

                // Verificar se o produto tem desconto
                const precoOriginal = produto.precoOriginal || produto.preco;
                const temDesconto = precoOriginal > produto.preco;

                // Calcular a porcentagem de desconto
                const descontoPercentual = temDesconto ? Math.round(((precoOriginal - produto.preco) / precoOriginal) * 100) : 0;

                // Gerar as badges
                let badgesHTML = '';
                if (temDesconto) {
                    badgesHTML += `<span class="badge bg-danger badge-discount">-${descontoPercentual}%</span>`;
                }

                // Formatar os preços
                const precoFormatado = `R$${produto.preco.toFixed(2).replace('.', ',')}`;
                const precoOriginalFormatado = `R$${precoOriginal.toFixed(2).replace('.', ',')}`;

                // Gerar o HTML do produto
                const produtoHTML = `
                <div class="col-lg-3 col-md-4 col-sm-6 mb-4">
                    <div class="card zoom-effect h-100">
                        <a href="#" class="product-link">
                            <div class="product-image-container">
                                <div class="badge-container">
                                    ${badgesHTML}
                                </div>
                                <img src="${produto.imagem}" class="product-img" alt="${produto.nome}">
                            </div>
                        </a>
                        <div class="card-body text-center">
                            <a href="#" class="product-link">
                                <h6 class="card-title">${tituloLimitado}</h6>
                            </a>
                            <div class="rating">
                                ${estrelasHTML}
                                <span>${produto.avaliacao}/5</span>
                            </div>
                            <h6 class="price">
                                <s>${precoOriginalFormatado}</s> <span class="text-danger">${precoFormatado}</span>
                            </h6>
                        </div>
                    </div>
                </div>
                `;

                // Inserir o produto no container
                ofertasContainer.insertAdjacentHTML('beforeend', produtoHTML);
            });
        })
        .catch(error => console.error('Erro ao carregar produtos:', error));

    // Funções auxiliares
    function limitarTexto(texto, limite) {
        return texto.length > limite ? texto.substring(0, limite) + '...' : texto;
    }

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
});
