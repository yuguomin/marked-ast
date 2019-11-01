"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const regExpNoop_1 = __importDefault(require("./regExpNoop"));
const merge_1 = __importDefault(require("../../../helpers/merge"));
const replace_1 = __importDefault(require("../../../helpers/replace"));
exports.getBlock = () => {
    /**
     * Block-Level Grammar
     */
    const block = {
        newline: /^\n+/,
        code: /^( {4}[^\n]+\n*)+/,
        fences: regExpNoop_1.default,
        hr: /^( *[-*_]){3,} *(?:\n+|$)/,
        heading: /^ *(#{1,6}) *([^\n]+?) *#* *(?:\n+|$)/,
        nptable: regExpNoop_1.default,
        lheading: /^([^\n]+)\n *(=|-){2,} *(?:\n+|$)/,
        blockquote: /^( *>[^\n]+(\n(?!def)[^\n]+)*\n*)+/,
        list: /^( *)(bull) [\s\S]+?(?:hr|def|\n{2,}(?! )(?!\1bull )\n*|\s*$)/,
        html: /^ *(?:comment *(?:\n|\s*$)|closed *(?:\n{2,}|\s*$)|closing *(?:\n{2,}|\s*$))/,
        def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +["(]([^\n]+)[")])? *(?:\n+|$)/,
        table: regExpNoop_1.default,
        paragraph: /^((?:[^\n]+\n?(?!hr|heading|lheading|blockquote|tag|def))+)\n*/,
        text: /^[^\n]+/,
        bullet: null,
        item: null,
        _tag: null,
        normal: null,
        gfm: null,
        tables: null,
    };
    block.bullet = /(?:[*+-]|\d+\.)/;
    block.item = /^( *)(bull) [^\n]*(?:\n(?!\1bull )[^\n]*)*/;
    // @ts-ignore
    block.item = replace_1.default(block.item, 'gm')(/bull/g, block.bullet)();
    // @ts-ignore
    block.list = replace_1.default(block.list)(/bull/g, block.bullet)('hr', '\\n+(?=\\1?(?:[-*_] *){3,}(?:\\n+|$))')('def', '\\n+(?=' + block.def.source + ')')();
    // @ts-ignore
    block.blockquote = replace_1.default(block.blockquote)('def', block.def)();
    block._tag = '(?!(?:'
        + 'a|em|strong|small|s|cite|q|dfn|abbr|data|time|code'
        + '|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo'
        + '|span|br|wbr|ins|del|img)\\b)\\w+(?!:/|[^\\w\\s@]*@)\\b';
    // @ts-ignore
    block.html = replace_1.default(block.html)('comment', /<!--[\s\S]*?-->/)('closed', /<(tag)[\s\S]+?<\/\1>/)('closing', /<tag(?:"[^"]*"|'[^']*'|[^'">])*?>/)(/tag/g, block._tag)();
    // @ts-ignore
    block.paragraph = replace_1.default(block.paragraph)('hr', block.hr)('heading', block.heading)('lheading', block.lheading)('blockquote', block.blockquote)('tag', '<' + block._tag)('def', block.def)();
    /**
     * Normal Block Grammar
     */
    block.normal = merge_1.default({}, [block]);
    /**
     * GFM Block Grammar
     */
    block.gfm = merge_1.default({}, [block.normal, {
            fences: /^ *(`{3,}|~{3,}) *(\S+)? *\n([\s\S]+?)\s*\1 *(?:\n+|$)/,
            paragraph: /^/
        }]);
    // @ts-ignore
    block.gfm.paragraph = replace_1.default(block.paragraph)('(?!', '(?!'
        // @ts-ignore
        + block.gfm.fences.source.replace('\\1', '\\2') + '|'
        + block.list.source.replace('\\1', '\\3') + '|')();
    /**
     * GFM + Tables Block Grammar
     */
    block.tables = merge_1.default({}, [block.gfm, {
            nptable: /^ *(\S.*\|.*)\n *([-:]+ *\|[-| :]*)\n((?:.*\|.*(?:\n|$))*)\n*/,
            table: /^ *\|(.+)\n *\|( *[-:]+[-| :]*)\n((?: *\|.*(?:\n|$))*)\n*/
        }]);
    return block;
};
exports.default = exports.getBlock;
