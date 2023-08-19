FROM node:18.16.0 AS pm-srv-development
WORKDIR /app/
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY tsconfig.json ./
EXPOSE 4000
CMD npm start

# ----------------------------------------------------------------------------------
# build Layer
#FROM 18.16.0 AS ssm-srv-build
#WORKDIR /app/
#COPY package.json package-lock.json ./
#RUN true
#COPY tsconfig.json ./
#RUN true
#COPY src /app/src
#
#RUN npm install --legacy-peer-deps
#RUN npm run build
