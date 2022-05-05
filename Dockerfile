# 指定基于node:latest 这个镜像继续制作当前应用镜像
FROM node:16.13.0-alpine

# 将根目录下的文件都copy到container（运行此镜像的容器）文件系统的app文件夹下
ADD . /app/
# cd到app文件夹下
WORKDIR /app


run npm config set proxy null
run npm config set https-proxy null


run npm config set registry https://registry.npmmirror.com

run npm install -g cnpm --registry=https://registry.npmmirror.com

# 安装项目依赖包
RUN cnpm install



# remove development dependencies(不会报错，但是大小变化不大)
#RUN npm prune --production

# 配置环境变量
ENV HOST 0.0.0.0
ENV PORT 8015
ENV DBCONFIG_SERVER_1 mongodb://192.168.254.233:27017/ddep2
ENV SITE_URL https://ddep-phase2.a4apple.cn:63303

# 暴露8004端口
EXPOSE 8015

# 启动容器时执行应用启动命令
CMD [ "node", "app.js" ]
