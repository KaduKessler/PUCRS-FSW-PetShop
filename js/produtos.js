document.addEventListener('DOMContentLoaded', function () {

    // Função para aplicar os filtros
    function aplicarFiltros() {
        // Obter os valores dos filtros selecionados
        const idadeSelecionada = [];
        const tamanhoSelecionado = [];
        const pesoSelecionado = [];

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
        const produtos = document.querySelectorAll('.col-md-4.col-lg-3.mb-4');

        // Iterar sobre os produtos e exibir ou ocultar conforme os filtros
        produtos.forEach(function (produto) {
            const idadeProduto = produto.getAttribute('data-idade');
            const tamanhoProduto = produto.getAttribute('data-tamanho');
            const pesoProduto = parseFloat(produto.getAttribute('data-peso'));

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

            // Mostrar ou ocultar o produto com base nos filtros aplicados
            if (idadeMatch && tamanhoMatch && pesoMatch) {
                produto.style.display = 'block';
            } else {
                produto.style.display = 'none';
            }
        });
    }

    // Adicionar evento ao botão de aplicar filtros
    document.querySelector('.btn.btn-primary.w-100').addEventListener('click', aplicarFiltros);

    // Adicionar evento para aplicar filtros quando os checkboxes forem modificados
    document.querySelectorAll('input[type="checkbox"]').forEach(function (checkbox) {
        checkbox.addEventListener('change', aplicarFiltros);
    });
});
