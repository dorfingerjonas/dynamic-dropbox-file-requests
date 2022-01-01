import { Dropbox } from 'dropbox';
import dotenv from 'dotenv';
import express from 'express';

const app = express();

dotenv.config();

const dropboxClient = new Dropbox({
  accessToken: process.env['DROPBOX_ACCESS_TOKEN']
});

app.get('/', (req, res) => {
  res.send('please use /:path');
});

app.get('/:path', (req, res) => {
  dropboxClient.fileRequestsCreate({
    title: req.params.path,
    destination: `/${ process.env['FILE_REQUEST_PATH'] }/${ req.params.path }`,
    open: true
  })
    .then(response => {
      console.log(`Created file-request "${ response.result.title }" (${ response.result.created })`);
      res.redirect(response.result.url);
    })
    .catch(error => {
      res.send({ error: error.message });
    });
});

app.listen(process.env['PORT'], () => {
  console.log(`Listening on port ${ process.env['PORT'] }`);
});
