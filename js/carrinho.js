document.addEventListener("DOMContentLoaded", function () {

    // Função para calcular o subtotal e atualizar os preços dos itens
    function calcularSubtotal() {
        let subtotal = 0;
        let hasItems = false;

        // Pega todos os itens de produto
        const produtos = document.querySelectorAll('.produto-item');

        produtos.forEach(produto => {
            const quantidadeInput = produto.querySelector('input[type="number"]');
            const precoBase = parseFloat(produto.querySelector('h6').dataset.preco); // Preço original do item armazenado no data attribute
            const quantidade = parseInt(quantidadeInput.value);

            if (quantidade > 0) {
                hasItems = true;
            }

            // Atualiza o preço do item de acordo com a quantidade
            const precoTotalItem = precoBase * quantidade;
            produto.querySelector('.preco-total-item').innerText = `R$${precoTotalItem.toFixed(2).replace('.', ',')}`;

            // Calcula subtotal de cada item (quantidade * preço)
            subtotal += precoTotalItem;
        });

        if (!hasItems || produtos.length === 0) {
            document.querySelector('.resumo-subtotal').innerText = 'R$0,00';
            document.querySelector('.resumo-total').innerText = 'R$0,00';
        } else {
            document.querySelector('.resumo-subtotal').innerText = `R$${subtotal.toFixed(2).replace('.', ',')}`;
            atualizarTotal();
        }
    }

    // Função para atualizar o total
    function atualizarTotal() {
        const subtotal = parseFloat(document.querySelector('.resumo-subtotal').innerText.replace('R$', '').replace(',', '.')) || 0;
        let total = 0;

        if (subtotal === 0) {
            // Se o subtotal for zero, o total também é zero
            document.querySelector('.resumo-cupom').innerText = 'R$0,00';
            document.querySelector('.resumo-entrega').innerText = 'R$0,00';
            total = 0;
        } else {
            const cupom = parseFloat(document.querySelector('.resumo-cupom').innerText.replace('-R$', '').replace(',', '.')) || 0;
            const taxaEntrega = parseFloat(document.querySelector('.resumo-entrega').innerText.replace('R$', '').replace(',', '.')) || 0;

            total = subtotal - cupom + taxaEntrega;
        }

        if (!isNaN(total)) {
            document.querySelector('.resumo-total').innerText = `R$${total.toFixed(2).replace('.', ',')}`;
        } else {
            document.querySelector('.resumo-total').innerText = 'R$0,00';
        }
    }


    // Função para aplicar o cupom PUCRS
    function aplicarCupom() {
        const cupomInput = document.querySelector('#cupom-input').value;
        const subtotal = parseFloat(document.querySelector('.resumo-subtotal').innerText.replace('R$', '').replace(',', '.')) || 0;
        let desconto = 0;

        if (cupomInput === 'PUCRS') {
            desconto = subtotal * 0.15; // 15% de desconto
            document.querySelector('.resumo-cupom').innerText = `-R$${desconto.toFixed(2).replace('.', ',')}`;
        } else {
            document.querySelector('.resumo-cupom').innerText = 'R$0,00';
        }

        atualizarTotal(); // Recalcula o total com o desconto
    }

    // Função para remover o item e recalcular o subtotal
    function removerItem(element) {
        const item = element.closest('.produto-item');
        if (item) {
            item.remove(); // Remove o item do DOM
            calcularSubtotal(); // Recalcula o subtotal após a remoção
        }
    }

    // Função para aplicar eventos a elementos dinâmicos
    function aplicarEventos() {
        // Adiciona evento de clique nos links de remoção para remover o item e recalcular
        document.querySelectorAll('.remover-item').forEach(link => {
            link.addEventListener('click', function (event) {
                event.preventDefault(); // Evita o recarregamento da página
                removerItem(this); // Chama a função de remover item
            });
        });

        // Evento para alterar a quantidade e recalcular imediatamente
        document.querySelectorAll('input[type="number"]').forEach(input => {
            input.addEventListener('input', calcularSubtotal);
        });

        // Eventos para os botões "+" e "-"
        document.querySelectorAll('.btn-link').forEach(button => {
            button.onclick = function () {
                const input = this.parentNode.querySelector('input[type="number"]');
                if (input) {
                    if (this.querySelector('.fa-plus')) {
                        input.stepUp();
                    } else if (this.querySelector('.fa-minus')) {
                        input.stepDown();
                    }
                    calcularSubtotal();
                }
            };
        });

        // Aplica o cupom ao clicar no botão de aplicar cupom
        document.querySelector('#aplicar-cupom').addEventListener('click', function (event) {
            event.preventDefault();
            aplicarCupom();
        });
    }

    // Inicializa a aplicação dos eventos
    aplicarEventos();
    calcularSubtotal();
});
