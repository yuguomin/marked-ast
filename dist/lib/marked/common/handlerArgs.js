"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handlerArgs = {
    code: ['code', 'lang', 'escaped', 'fenced'],
    blockquote: ['quote'],
    html: ['html'],
    heading: ['text', 'level', 'raw'],
    hr: [],
    list: ['body', 'ordered'],
    listitem: ['text'],
    paragraph: ['text'],
    table: ['header', 'body'],
    tablerow: ['content'],
    tablecell: ['content', 'flags'],
    strong: ['text'],
    em: ['text'],
    codespan: ['text'],
    br: [],
    del: ['text'],
    link: ['href', 'title', 'text'],
    image: ['href', 'title', 'text']
};
exports.default = exports.handlerArgs;
