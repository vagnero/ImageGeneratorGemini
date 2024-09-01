# ImageGeneratorGemini

## Como rodar via Docker

Para rodar o projeto usando Docker, siga estes passos:

1. **Crie um arquivo `.env`** com as seguintes variáveis:
    ```
    PORT=3000
    GEMINI_KEY=your_gemini_key

    DATABASE_URL=postgres://your_db_username:your_db_password@localhost:5432/your_db_name
    ```

2. **Execute o comando:**
    docker-compose up --build

   Isso irá construir a imagem e iniciar os containers definidos no `docker-compose.yml`.

## Como rodar via IDE

Para rodar o projeto diretamente na IDE, siga estes passos:

1. **Crie um arquivo `.env`** com as seguintes variáveis:
    PORT=3000
    GEMINI_KEY=your_gemini_key
    DB_USERNAME=postgres
    DB_PASSWORD=1234
    POSTGRES_DB=teste_shopper

    DATABASE_URL=postgres://your_db_username:your_db_password@localhost:5432/your_db_name

2. **Execute os comandos necessários para atualizar a aplicação e o Prisma no terminal:**

    DB_USERNAME=postgres
    DB_PASSWORD=1234
    POSTGRES_DB=teste_shopper
    npm install                # Instala as dependências do projeto
    npx prisma migrate deploy  # Aplica as migrações existentes no banco de dados
    npx prisma generate        # Gera o Prisma Client atualizado
    npm start                  # Inicia o projeto
