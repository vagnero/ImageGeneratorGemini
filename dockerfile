# Usar a imagem base do Node.js
FROM node:18

# Definir o diretório de trabalho dentro do container
WORKDIR /app

# Copiar os arquivos package.json e package-lock.json (se disponível) para o diretório de trabalho
COPY package*.json ./

# Instalar as dependências do projeto
RUN npm install


# Copiar os arquivos do prisma
COPY prisma ./prisma/

# Copiar todos os arquivos do projeto para o diretório de trabalho
COPY . .

# Gere o Prisma Client
RUN npx prisma generate

# Compilar os arquivos TypeScript
RUN npm run build

# Expor a porta na qual o servidor irá rodar
EXPOSE 3000

# Definir o comando para iniciar o servidor
CMD ["npm", "start"]