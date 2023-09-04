FROM node

WORKDIR /app

COPY package*.json ./

COPY . .

ENV PORT 3000
ENV DB_URL mongodb+srv://sergiodiorov:7zGitUx3Krjw1TbJ@cluster0.wd9mxjg.mongodb.net/usersdb?retryWrites=true&w=majority
ENV JWT_SECRET_ACCESS JWT_SECRET_ACCESS_KEY
ENV JWT_SECRET_REFREFRESH JWT_SECRET_REFRESH_KEY
ENV CLIENT_URL http://localhost:3001
ENV AWS_BUCKET_NAME crud-avatar-images
ENV AWS_BUCKET_REGION eu-north-1
ENV AWS_ACCESS_KEY AKIA3ABNZ7L6QNX7Z7EU
ENV AWS_SECRET_KEY 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

RUN npm install

RUN npm run build

EXPOSE $PORT

CMD ["npm", "start"]