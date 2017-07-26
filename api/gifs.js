'use strict';

const Router = require('express').Router;

const MOCK_GIFS = [
  {
    title: 'hugs',
    url: 'http://i.giphy.com/26BRAzfrMB2QIveTK.gif'
  },
  {
    title: 'unicorn',
    url: 'http://i.giphy.com/3osxYamKD88c6pXdfO.gif'
  },
  {
    title: 'surprise',
    url: 'http://i.giphy.com/l41YwWrjEhTGpE3zG.gif'
  }
];

class Gifs {
  get(req, res, next) {
    let data = MOCK_GIFS.map((gif, idx) => {
      return `<div>
      <h2>[${idx}] ${gif.title}</h2>
      <img src="${gif.url}"></div>`;
    }).join('');

    res.send(data);
  }

  getGif(req, res, next) {
    let id = parseInt(req.params.id, 10);
    let gif = MOCK_GIFS[id];
    res.send(`<h1>[${id}] ${gif.title}</h1>
    <img src="${gif.url}">
    `);
  }
}

const gifs = new Gifs();
const GifsRouter = Router();
GifsRouter.get('/', gifs.get);
GifsRouter.get('/:id', gifs.getGif);

module.exports = { Gifs, GifsRouter };