FROM node:16.14.2-alpine as DEBUG

#TODO:
# Make this config from compose
WORKDIR /app

COPY package*.json ./

#RUN npm install --production
RUN npm install

RUN npm install typescript yarn
RUN npm install -g typescript nodemon ts-node
#yarn

COPY . .

#RUN tsc -p .

#RUN npm link typescript

#EXPOSE 9229 6060
#CMD ["npm", "run", "debugNodemon"]
#CMD ["npm", "debug"]
#CMD ["npm", "start"]
RUN yarn install --dev

CMD ["npm", "start"]