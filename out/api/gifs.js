'use strict';
var Router = require('express').Router;
var MOCK_GIFS = [
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
var Gifs = (function () {
    function Gifs() {
    }
    Gifs.prototype.get = function (req, res, next) {
        var data = MOCK_GIFS.map(function (gif, idx) {
            return "<div>\n      <h2>[" + idx + "] " + gif.title + "</h2>\n      <img src=\"" + gif.url + "\"></div>";
        }).join('');
        res.send(data);
    };
    Gifs.prototype.getGif = function (req, res, next) {
        var id = parseInt(req.params.id, 10);
        var gif = MOCK_GIFS[id];
        res.send("<h1>[" + id + "] " + gif.title + "</h1>\n    <img src=\"" + gif.url + "\">\n    ");
    };
    return Gifs;
}());
var gifs = new Gifs();
var GifsRouter = Router();
GifsRouter.get('/', gifs.get);
GifsRouter.get('/:id', gifs.getGif);
module.exports = { Gifs: Gifs, GifsRouter: GifsRouter };
//# sourceMappingURL=gifs.js.map