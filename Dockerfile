# 设置基础镜像
FROM node:18

# 设置工作目录
WORKDIR /app

# 复制`package.json`和`package-lock.json`（如果有）
COPY package*.json ./

# 安装项目依赖
RUN npm install

# 复制所有项目文件到工作目录下
COPY . .

# 应用的服务端口
EXPOSE 3000

# 启动服务
CMD ["npm", "start"]

