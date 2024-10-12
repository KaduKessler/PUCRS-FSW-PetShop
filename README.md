<p align="center">
  <img src="https://github.com/KaduKessler/PUCRS-FSW-PetShop/blob/main/img/logo-completa.png" alt="AmigoPet" width="300"/>
</p>

AmigoPet é um projeto desenvolvido para a disciplina de **Fundamentos de Sistemas Web** no curso de **Análise e Desenvolvimento de Sistemas** da **PUCRS**. O objetivo é criar um site para um petshop fictício, oferecendo uma experiência amigável e completa para donos de pets que desejam comprar produtos, agendar serviços ou cadastrar seus animais de estimação.

## 🔗 Tecnologias Utilizadas

- **HTML5**: Estrutura e marcação do site
- **CSS3**: Estilos personalizados para uma interface agradável
- **JavaScript**: Scripts de interação e funcionalidades
- **[Bootstrap 5](https://getbootstrap.com/)**: Framework CSS para responsividade e componentes prontos
- **[Google Fonts](https://fonts.google.com/)**: Tipografia personalizada usando Montserrat, Nerko One, e Roboto
- **[Font Awesome](https://fontawesome.com/)**: Ícones interativos para melhorar a experiência do usuário

## ⚙️ Como Rodar Localmente o Projeto

Para evitar problemas com CORS ao carregar componentes e produtos via `fetch()`, é necessário rodar um servidor local. Siga os passos abaixo:

### Usando o **Live Server** no VSCode
1. **Clone o repositório**:

   ```bash
   git clone https://github.com/KaduKessler/PUCRS-FSW-PetShop.git
   ```

2. **Navegue até a pasta do projeto**:

   ```bash
   cd PUCRS-FSW-PetShop
   ```

3. **Abra o projeto no VSCode**.

4. **Instale a extensão [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)** no VSCode.

5. **Clique com o botão direito no arquivo `index.html`** e selecione **"Open with Live Server"**.

6. Pronto! O projeto será aberto no navegador em `http://127.0.0.1:5500`.

### Usando Python HTTP Server
Caso prefira não utilizar o Live Server e tenha Python instalado:

1. **Clone o repositório**:

   ```bash
   git clone https://github.com/KaduKessler/PUCRS-FSW-PetShop.git
   ```

2. **Navegue até a pasta do projeto**:

   ```bash
   cd PUCRS-FSW-PetShop
   ```

3. **Inicie o servidor HTTP do Python**:

   ```bash
   python -m http.server 8080
   ```

4. **Abra o navegador e acesse**:

   ```bash
   http://localhost:8080
   ```

## 📁 Funcionalidades Extras

Algumas funcionalidades implementadas no projeto:

- 🐕 **Cadastro de Pets** com pré-visualização de imagem.
- 🛒 **Carrinho de Compras** e **Filtros de Produtos** dinâmicos.
- 🏠 **Serviços** como banho, tosa, hospedagem, e consultas veterinárias.
