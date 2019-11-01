"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const entities_1 = require("entities");
const times_1 = __importDefault(require("whisk/times"));
const tables_1 = require("./tables");
const lists_1 = require("./lists");
exports.AST2MD = (ast) => ast.map(exports.writeNode).join('');
exports.writeNode = (node, index, ast) => {
    const handler = generators[node.type];
    if (typeof node == 'string' || (node instanceof String)) {
        return entities_1.decodeHTML(node);
    }
    return typeof handler == 'function' ? handler(node, index, ast) : '';
};
const generators = {
    heading: (node, index, ast) => `${HEADERS[node.level]} ${toText(node.text, ' ')}${newLines(ast, index)}`,
    paragraph: (node, index, ast) => `${toText(node.text)}${newLines(ast, index)}`,
    strong: (node) => `**${toText(node.text)}**`,
    em: (node) => `_${toText(node.text)}_`,
    link: (node) => (Array.isArray(node.text) ? `[${toText(node.text)}](${getUrl(node)})` : `<${getUrl(node)}>`),
    image: (node) => `![${node.text}](${getUrl(node)})`,
    list: (node, index, ast) => `${lists_1.genList(node, '', index, ast, exports.writeNode).slice(1)}${newLines(ast, index)}`,
    blockquote: (node, index, ast) => `> ${node.quote.map(exports.writeNode)}${newLines(ast, index)}`,
    code: (node, index, ast) => `${CODE_BLOCK}${node.lang || ''}\n${node.code}\n${CODE_BLOCK}${newLines(ast, index)}`,
    codespan: (node) => `\`${entities_1.decodeHTML(node.text)}\``,
    html: (node) => `${toText(node.html)}`,
    hr: (node, index, ast) => `---${newLines(ast, index)}`,
    table: (node, index, ast) => ([
        node.header.map(exports.writeNode),
        node.header.map(tables_1.writeTableHeaderLine).join(''),
        node.body.map(exports.writeNode).join('\n')
    ].join('\n') + newLines(ast, index)),
    tablerow: (node) => `| ${node.content.map(exports.writeNode).join(' | ')} |`,
    tablecell: (node) => toText(node.content),
};
const CODE_BLOCK = '```';
const createHeader = (level) => times_1.default(level).map(() => '#').join('');
const HEADERS = times_1.default(7).map((_, headerLevel) => createHeader(headerLevel));
const toText = (list, separator = '') => list.map(exports.writeNode).join(separator);
const getUrl = (node) => `${node.href}${node.title ? ' "' + node.title + '"' : ''}`;
const newLines = (ast, index) => (ast.slice(index + 1).length > 0 ? '\n\n' : '');
