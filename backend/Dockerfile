# Backend — Node.js 20 (alpine = imagem leve, ~50MB)
FROM node:20-alpine
WORKDIR /app

# 1) Copiar package.json primeiro permite ao Docker fazer cache da camada de deps
COPY package.json ./
RUN npm install --omit=dev

# 2) Depois copiamos o resto do código (muda mais frequentemente)
COPY . .

EXPOSE 3000
CMD ["node", "app.js"]
