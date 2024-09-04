ImageGeneratorGemini
Descrição
Esta API foi desenvolvida em Node.js, utilizando o PostgreSQL como banco de dados e o Prisma como ORM. O principal objetivo da API é ler uma imagem em formato base64, convertê-la em uma imagem e enviá-la para uma inteligência artificial que extrai o valor numérico da imagem (que representa um medidor de água ou gás). Após a leitura, o valor, o tipo de medida, e uma confirmação se o valor está correto ou não, são salvos no banco de dados.

A IA utilizada é o Gemini, que oferece uma opção gratuita. No entanto, a versão gratuita possui limitações em termos de requisições e precisão nas leituras. O projeto também inclui um Docker tanto para o banco de dados quanto para a aplicação Node.js, permitindo que ambos sejam executados com um único comando.

Há três endpoints disponíveis na API:

Leitura de imagens: Recebe a imagem, realiza a leitura e salva os dados.
Atualização e confirmação de valor: Atualiza o registro com a confirmação de que o valor lido está correto.
Consulta de medidas: Retorna todas as medidas feitas, com a opção de filtragem por código do cliente e tipo de medida.
Desafio Pessoal
Este projeto foi um desafio para mim, pois o prazo era de cerca de três dias. Atualmente, trabalho em dois empregos e faço faculdade presencial à noite, o que deixou o tempo bastante curto. Apesar disso, a experiência foi muito enriquecedora, principalmente por ter aprendido a utilizar Docker para containerizar tanto o banco de dados quanto a aplicação em Node.js.

Agradeço pela oportunidade e espero que o teste seja proveitoso! 😊

Como Rodar via Docker
Para rodar o projeto usando Docker, siga os passos abaixo:

Crie um arquivo .env com as seguintes variáveis:

plaintext
Copiar código
PORT=3000
GEMINI_KEY=your_gemini_key
DB_USERNAME=your_username
DB_PASSWORD=your_password
POSTGRES_DB=your_database_name

DATABASE_URL=postgres://your_db_username:your_db_password@localhost:5432/your_db_name
Execute o comando:

bash
Copiar código
docker-compose up --build
Isso irá construir a imagem e iniciar os containers definidos no docker-compose.yml.

Como Rodar via IDE
Para rodar o projeto diretamente na IDE, siga os passos abaixo:

Crie um arquivo .env com as mesmas variáveis mencionadas acima.

Execute os comandos necessários para configurar a aplicação e o Prisma no terminal:

bash
Copiar código
npm install                # Instala as dependências do projeto
npx prisma migrate deploy  # Aplica as migrações existentes no banco de dados
npx prisma generate        # Gera o Prisma Client atualizado
npm start                  # Inicia o projeto
