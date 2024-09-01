# ImageGeneratorGemini

## Como rodar via Docker

Para rodar o projeto usando Docker, siga estes passos:

1. **Crie um arquivo `.env`** com as seguintes variáveis:
    ```
    PORT=3000
    GEMINI_KEY=your_gemini_key

    DB_DIALECT=postgres
    DB_HOST=localhost
    DB_USERNAME=your_db_username
    DB_PASSWORD=your_db_password
    DB_DATABASE=your_db_name

    DATABASE_URL=postgres://your_db_username:your_db_password@localhost:5432/your_db_name
    ```

2. **Execute o comando:**
    docker-compose up --build

   Isso irá construir a imagem e iniciar os containers definidos no `docker-compose.yml`.

## Como rodar via IDE

Para rodar o projeto diretamente na IDE, siga estes passos:

1. **Crie um arquivo `.env`** com as seguintes variáveis:
    ```
    PORT=3000
    GEMINI_KEY=your_gemini_key

    DB_DIALECT=postgres
    DB_HOST=localhost
    DB_USERNAME=your_db_username
    DB_PASSWORD=your_db_password
    DB_DATABASE=your_db_name

    DATABASE_URL=postgres://your_db_username:your_db_password@localhost:5432/your_db_name
    ```

2. **Execute os comandos necessários para atualizar a aplicação e o Prisma no terminal:**
    ```sh
    npm install                # Instala as dependências do projeto
    npx prisma migrate deploy  # Aplica as migrações existentes no banco de dados
    npx prisma generate        # Gera o Prisma Client atualizado
    npm start                  # Inicia o projeto
    ```

### Notas

- Certifique-se de substituir os valores no arquivo `.env` pelos valores apropriados para seu ambiente de desenvolvimento ou produção.
- O arquivo `.env` deve ser mantido em segredo e não deve ser incluído em controle de versão (como Git). Considere adicionar um arquivo `.env.example` com valores de exemplo para orientar outros desenvolvedores.
