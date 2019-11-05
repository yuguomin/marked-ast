"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Renderer_1 = require("../Renderer");
exports.defaultOptions = {
    gfm: true,
    tables: true,
    breaks: false,
    pedantic: false,
    sanitize: false,
    smartLists: false,
    silent: false,
    highlight: null,
    langPrefix: 'lang-',
    smartypants: false,
    headerPrefix: '',
    renderer: new Renderer_1.Renderer(),
    xhtml: false
};
