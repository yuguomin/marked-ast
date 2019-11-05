"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const merge_1 = __importDefault(require("../../../helpers/merge"));
const replace_1 = __importDefault(require("../../../helpers/replace"));
const RegExpNoop_1 = __importDefault(require("./RegExpNoop"));
/**
 * Inline-Level Grammar
 */
exports.getInline = () => {
    const inline = {
        escape: /^\\([\\`*{}\[\]()#+\-.!_>])/,
        autolink: /^<([^ >]+(@|:\/)[^ >]+)>/,
        url: RegExpNoop_1.default,
        tag: /^<!--[\s\S]*?-->|^<\/?\w+(?:"[^"]*"|'[^']*'|[^'">])*?>/,
        link: /^!?\[(inside)\]\(href\)/,
        reflink: /^!?\[(inside)\]\s*\[([^\]]*)\]/,
        nolink: /^!?\[((?:\[[^\]]*\]|[^\[\]])*)\]/,
        strong: /^__([\s\S]+?)__(?!_)|^\*\*([\s\S]+?)\*\*(?!\*)/,
        em: /^\b_((?:__|[\s\S])+?)_\b|^\*((?:\*\*|[\s\S])+?)\*(?!\*)/,
        code: /^(`+)\s*([\s\S]*?[^`])\s*\1(?!`)/,
        br: /^ {2,}\n(?!\s*$)/,
        del: RegExpNoop_1.default,
        text: /^[\s\S]+?(?=[\\<!\[_*`]| {2,}\n|$)/,
        _inside: null,
        _href: null,
        normal: null,
        pedantic: null,
        gfm: null,
        breaks: null,
    };
    inline._inside = /(?:\[[^\]]*\]|[^\[\]]|\](?=[^\[]*\]))*/;
    inline._href = /\s*<?([\s\S]*?)>?(?:\s+['"]([\s\S]*?)['"])?\s*/;
    // @ts-ignore
    inline.link = replace_1.default(inline.link)('inside', inline._inside)('href', inline._href)();
    // @ts-ignore
    inline.reflink = replace_1.default(inline.reflink)('inside', inline._inside)();
    /**
     * Normal Inline Grammar
     */
    inline.normal = merge_1.default({}, [inline]);
    /**
     * Pedantic Inline Grammar
     */
    inline.pedantic = merge_1.default({}, [inline.normal, {
            strong: /^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,
            em: /^_(?=\S)([\s\S]*?\S)_(?!_)|^\*(?=\S)([\s\S]*?\S)\*(?!\*)/
        }]);
    /**
     * GFM Inline Grammar
     */
    inline.gfm = merge_1.default({}, [inline.normal, {
            // @ts-ignore
            escape: replace_1.default(inline.escape)('])', '~|])')(),
            url: /^(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/,
            del: /^~~(?=\S)([\s\S]*?\S)~~/,
            // @ts-ignore
            text: replace_1.default(inline.text)(']|', '~]|')('|', '|https?://|')()
        }]);
    /**
     * GFM + Line Breaks Inline Grammar
     */
    inline.breaks = merge_1.default({}, [inline.gfm, {
            // @ts-ignore
            br: replace_1.default(inline.br)('{2,}', '*')(),
            // @ts-ignore
            text: replace_1.default(inline.gfm.text)('{2,}', '*')()
        }]);
    return inline;
};
