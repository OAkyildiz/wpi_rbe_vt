var showdown  = require('showdown');
var fs = require(fs);
var md = require(markdown-it);
var mdi = mdi.use(require("markdown-it-include"), "info");

converter = new showdown.Converter(),

function mdTxt2html(text){
    return converter.makeHtml(text);
}
