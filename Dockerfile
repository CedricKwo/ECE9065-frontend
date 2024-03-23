# 基础镜像
FROM node:18 as build-stage

# 设置工作目录
WORKDIR /app

# 复制package.json和package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm install

# 复制项目文件到容器内
COPY . .

# 构建应用
RUN npm run build

# 生产环境使用nginx
FROM nginx:stable-alpine as production-stage
# 复制构建的静态文件
COPY --from=build-stage /app/build /usr/share/nginx/html
# 复制自定义的Nginx配置文件
COPY custom-nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]


