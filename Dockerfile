FROM node:lts-alpine AS img-pedexport-backend

# Etapa 1: Construção
FROM node:18 AS build

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos de configuração e dependências para o container
COPY package.json package-lock.json tsconfig.json ./

# Instala as dependências
RUN npm install

# Copia o código fonte para o diretório de trabalho
COPY . .

# Compila o código TypeScript para JavaScript (Esse é o diferencial)
RUN npm run build

# Copia a pasta resources para dist
RUN cp -r src/resources dist/resources

# Verifica se o diretório /dist foi criado corretamente
RUN ls -la /app/dist

# Etapa 2: Execução
FROM node:18

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia apenas os arquivos compilados e as dependências para o container
COPY --from=build /app/package.json /app/package-lock.json ./
COPY --from=build /app/dist /app/dist

# Instala as dependências necessárias para rodar o código
RUN npm install --omit=dev

# Expõe a porta que o aplicativo vai usar
EXPOSE 8080

# Define o comando para iniciar o aplicativo
CMD ["node", "dist/server.js"]
