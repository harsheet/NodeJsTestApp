import express from 'express';
import config from './config';
import fs from 'fs';
import apiRouter from './api';

const server = express();
server.set('view engine', 'ejs');

server.get('/', (req, res) => {
  res.render('index', {
    content: '<em>Hello</em> again!!!'
  });
});


server.use('/api', apiRouter);
server.use(express.static('public'));


server.listen(config.port, () => {
  console.info(config.port);
});