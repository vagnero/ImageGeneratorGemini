# ImageGeneratorGemini


# Como rodar?
É necessário criar um .env com as seguintes variáveis: 
PORT
GEMINI_KEY

DB_DIALECT
DB_HOST
DB_USERNAME
DB_PASSWORD
DB_DATABASE

DATABASE_URL

Comandos necessários para atualizar a aplicação e o prisma:
npm install                # Instala as dependências do projeto
npx prisma migrate deploy   # Aplica as migrações existentes no banco de dados
npx prisma generate         # Gera o Prisma Client atualizado
npm start                   # Inicia o projeto
