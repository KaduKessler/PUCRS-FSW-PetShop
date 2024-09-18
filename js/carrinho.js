document.addEventListener("DOMContentLoaded", function () {
    const cupomInput = document.getElementById('cupom-input');
    const listaCupons = document.getElementById('lista-cupons');

    // Referência à div de carrinho vazio
    const carrinhoVazioDiv = document.getElementById('carrinho-vazio');

    // Exibe a lista de cupons quando o campo de cupom é focado
    cupomInput.addEventListener('focus', function () {
        listaCupons.style.display = 'block';
    });

    // Esconde a lista de cupons quando o campo de cupom perde o foco
    cupomInput.addEventListener('blur', function () {
        // Timeout para permitir que o clique em um cupom (se desejado) funcione antes de esconder
        setTimeout(function () {
            listaCupons.style.display = 'none';
        }, 200);
    });

    /**
     * Exibe uma mensagem de feedback para o usuário.
     *
     * @param {string} mensagem - A mensagem a ser exibida.
     * @param {string} [tipo='success'] - O tipo de mensagem ('success' ou 'danger').
     */
    function exibirFeedback(mensagem, tipo = 'success') {
        const feedbackElement = document.getElementById('feedback-message');
        feedbackElement.classList.remove('d-none', 'alert-success', 'alert-danger', 'fade-out');
        feedbackElement.classList.add(`alert-${tipo}`);
        feedbackElement.innerText = mensagem;

        // Timeout para remover a mensagem após 3 segundos
        setTimeout(() => {
            feedbackElement.classList.add('fade-out');
            setTimeout(() => {
                feedbackElement.classList.add('d-none');
            }, 300); // Correspondente ao tempo da animação de fade-out
        }, 3000);
    }

    /**
     * Calcula o subtotal dos itens no carrinho e atualiza os preços.
     * Controla a exibição da mensagem de carrinho vazio e a habilitação do botão de finalizar compra.
     */
    function calcularSubtotal() {
        let subtotal = 0;
        let hasItems = false;

        // Seleciona todos os itens de produto
        const produtos = document.querySelectorAll('.produto-item');

        produtos.forEach(produto => {
            const quantidadeInput = produto.querySelector('input[type="number"]');
            const precoBase = parseFloat(produto.querySelector('h6').dataset.preco); // Preço original do item armazenado no data attribute
            const quantidade = parseInt(quantidadeInput.value);

            if (quantidade > 0) {
                hasItems = true;
            }

            // Atualiza o preço total do item de acordo com a quantidade
            const precoTotalItem = precoBase * quantidade;
            produto.querySelector('.preco-total-item').innerText = `R$${precoTotalItem.toFixed(2).replace('.', ',')}`;

            // Calcula o subtotal acumulado
            subtotal += precoTotalItem;
        });

        if (!hasItems || produtos.length === 0) {
            document.querySelector('.resumo-subtotal').innerText = 'R$0,00';
            document.querySelector('.resumo-total').innerText = 'R$0,00';

            // Exibe a mensagem de carrinho vazio
            carrinhoVazioDiv.classList.remove('d-none');

            // Oculta o conteúdo principal do carrinho
            document.getElementById('conteudo-carrinho').classList.add('d-none');

            // Desabilita o botão de finalizar compra
            document.querySelector('.finalizar-compra').classList.add('disabled');
        } else {
            document.querySelector('.resumo-subtotal').innerText = `R$${subtotal.toFixed(2).replace('.', ',')}`;
            carrinhoVazioDiv.classList.add('d-none');

            // Exibe o conteúdo principal do carrinho
            document.getElementById('conteudo-carrinho').classList.remove('d-none');

            // Habilita o botão de finalizar compra
            document.querySelector('.finalizar-compra').classList.remove('disabled');

            aplicarCupom(); // Recalcula o cupom ao remover itens ou alterar quantidades
        }
    }

    /**
     * Atualiza o valor total do carrinho, considerando descontos e taxa de entrega.
     *
     * @param {number} [desconto=0] - O valor do desconto a ser aplicado.
     * @param {number} [taxaEntrega=15] - O valor da taxa de entrega.
     */
    function atualizarTotal(desconto = 0, taxaEntrega = 15) {
        const subtotal = parseFloat(document.querySelector('.resumo-subtotal').innerText.replace('R$', '').replace(',', '.')) || 0;

        const total = subtotal - desconto + taxaEntrega;

        if (!isNaN(total)) {
            document.querySelector('.resumo-total').innerText = `R$${total.toFixed(2).replace('.', ',')}`;
        } else {
            document.querySelector('.resumo-total').innerText = 'R$0,00';
        }
    }

    // Lista de cupons disponíveis
    const cupons = {
        'PUCRS': {
            tipo: 'percentual',  // Tipo de desconto
            valor: 15            // Desconto de 15%
        },
        'AMIGOPET10': {
            tipo: 'valor',       // Tipo de desconto por valor fixo
            valor: 10            // Desconto de R$10
        },
        'FRETEGRATIS': {
            tipo: 'frete',       // Tipo de desconto que remove o valor do frete
            valor: 0             // Frete grátis
        }
    };

    /**
     * Aplica um cupom de desconto ao carrinho, se válido.
     *
     * @param {boolean} [userInitiated=false] - Indica se a função foi chamada pelo usuário (para exibir mensagens de feedback).
     */
    function aplicarCupom(userInitiated = false) {
        const cupomInputValue = document.querySelector('#cupom-input').value.trim().toUpperCase();  // Captura o cupom e transforma em maiúsculas

        const subtotal = parseFloat(document.querySelector('.resumo-subtotal').innerText.replace('R$', '').replace(',', '.')) || 0;
        let desconto = 0;
        let taxaEntrega = 15;  // Valor padrão da taxa de entrega

        // Verifica se o campo de cupom está vazio
        if (!cupomInputValue) {
            if (userInitiated) {
                exibirFeedback('Por favor, insira um cupom.', 'danger');
            }
            // Se não há cupom, zera o desconto e restaura a taxa de entrega padrão
            document.querySelector('.resumo-cupom').innerText = 'R$0,00';
            document.querySelector('.resumo-entrega').innerText = `R$15,00`;
            atualizarTotal(desconto, taxaEntrega);
            return;  // Sai da função
        }

        // Verifica se o cupom existe
        if (cupons[cupomInputValue]) {
            const cupom = cupons[cupomInputValue];

            if (cupom.tipo === 'percentual') {
                // Desconto percentual
                desconto = subtotal * (cupom.valor / 100);
                document.querySelector('.resumo-cupom').innerText = `-R$${desconto.toFixed(2).replace('.', ',')}`;
                if (userInitiated) {
                    exibirFeedback('Cupom aplicado com sucesso!', 'success');
                }
            } else if (cupom.tipo === 'valor') {
                // Desconto por valor fixo
                desconto = cupom.valor;
                document.querySelector('.resumo-cupom').innerText = `-R$${desconto.toFixed(2).replace('.', ',')}`;
                if (userInitiated) {
                    exibirFeedback('Cupom aplicado com sucesso!', 'success');
                }
            } else if (cupom.tipo === 'frete') {
                // Frete grátis: Remove o valor do frete
                taxaEntrega = 0;
                document.querySelector('.resumo-entrega').innerText = `R$0,00`;
                document.querySelector('.resumo-cupom').innerText = `R$0,00`;  // Zera o campo cupom
                if (userInitiated) {
                    exibirFeedback('Frete grátis aplicado!', 'success');
                }
            }
        } else {
            // Se o cupom for inválido
            document.querySelector('.resumo-cupom').innerText = 'R$0,00';
            document.querySelector('.resumo-entrega').innerText = `R$15,00`;  // Restaura a taxa de entrega padrão
            taxaEntrega = 15;

            if (userInitiated) {
                exibirFeedback('Cupom inválido ou não reconhecido.', 'danger');
            }
        }

        atualizarTotal(desconto, taxaEntrega);  // Recalcula o total com o desconto e a taxa de entrega
    }

    /**
     * Remove um item do carrinho e recalcula o subtotal.
     *
     * @param {HTMLElement} element - O elemento que acionou a remoção (usualmente o link de remover).
     */
    function removerItem(element) {
        const item = element.closest('.produto-item');
        if (item) {
            item.remove(); // Remove o item do DOM
            calcularSubtotal(); // Recalcula o subtotal após a remoção
            exibirFeedback('Item removido do carrinho.', 'success');
        }
    }

    /**
     * Aplica os eventos necessários aos elementos da página, como cliques e alterações de quantidade.
     */
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

        // Evento para o botão de aplicar cupom
        document.querySelector('#aplicar-cupom').addEventListener('click', function (event) {
            event.preventDefault();  // Impede o comportamento padrão do botão

            // Chama a função aplicarCupom com userInitiated = true
            aplicarCupom(true);
        });
    }

    // Inicializa a aplicação dos eventos
    aplicarEventos();
    calcularSubtotal();
});
