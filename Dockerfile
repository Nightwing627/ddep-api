# 指定基于node:latest 这个镜像继续制作当前应用镜像
FROM node:12.6.0-alpine

# 将根目录下的文件都copy到container（运行此镜像的容器）文件系统的app文件夹下
ADD . /app/
# cd到app文件夹下
WORKDIR /app

# 安装项目依赖包
RUN npm install
#RUN npm ci
RUN cd $(npm root -g)/npm
&& npm install fs-extra
&& sed -i -e s/graceful-fs/fs-extra/ -e s/fs.rename/fs.move/ ./lib/utils/rename.js
# remove development dependencies(不会报错，但是大小变化不大)
#RUN npm prune --production

# 配置环境变量
ENV HOST 0.0.0.0
ENV PORT 8004

# 暴露8004端口
EXPOSE 8004

# 启动容器时执行应用启动命令
CMD [ "node", "app.js" ]