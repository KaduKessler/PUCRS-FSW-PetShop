document.addEventListener("DOMContentLoaded", function () {
    // Função para calcular o subtotal
    function calcularSubtotal() {
        let subtotal = 0;
        let hasItems = false;

        // Pega todos os itens de produto
        const produtos = document.querySelectorAll('.produto-item');

        produtos.forEach(produto => {
            const quantidadeInput = produto.querySelector('input[type="number"]');
            const preco = parseFloat(produto.querySelector('h6').innerText.replace('R$', '').replace(',', '.'));
            const quantidade = parseInt(quantidadeInput.value);

            if (quantidade > 0) {
                hasItems = true;
            }

            // Calcula subtotal de cada item (quantidade * preço)
            subtotal += preco * quantidade;
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
        const subtotal = parseFloat(document.querySelector('.resumo-subtotal').innerText.replace('R$', '').replace(',', '.'));
        const cupom = parseFloat(document.querySelector('.resumo-cupom').innerText.replace('-R$', '').replace(',', '.'));
        const taxaEntrega = parseFloat(document.querySelector('.resumo-entrega').innerText.replace('R$', '').replace(',', '.'));

        const total = subtotal - cupom + taxaEntrega;
        document.querySelector('.resumo-total').innerText = `R$${total.toFixed(2).replace('.', ',')}`;
    }

    // Função para remover o item e recalcular o subtotal
    function removerItem(element) {
        const item = element.closest('.produto-item');
        if (item) {
            item.remove();
            calcularSubtotal();
        }
    }

    // Função para aplicar eventos a elementos dinâmicos
    function aplicarEventos() {
        // Adiciona evento de clique nos ícones de lixeira para remover o item e recalcular
        document.querySelectorAll('.fa-trash').forEach(lixeira => {
            lixeira.addEventListener('click', function (event) {
                event.preventDefault(); // Evita o recarregamento da página
                removerItem(this);
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
    }

    // Inicializa a aplicação dos eventos
    aplicarEventos();
    calcularSubtotal();
});
