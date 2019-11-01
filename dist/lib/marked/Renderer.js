"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const escape_1 = __importDefault(require("../../helpers/escape"));
class Renderer {
    constructor(options = {}) {
        this.code = (code, lang, escaped, fenced) => {
            if (this.options.highlight) {
                let out = this.options.highlight(code, lang);
                if (out != null && out !== code) {
                    escaped = true;
                    code = out;
                }
            }
            if (!lang) {
                return '<pre><code>'
                    + (escaped ? code : escape_1.default(code, true))
                    + '\n</code></pre>';
            }
            return '<pre><code class="'
                + this.options.langPrefix
                + escape_1.default(lang, true)
                + '">'
                + (escaped ? code : escape_1.default(code, true))
                + '\n</code></pre>\n';
        };
        this.blockquote = (quote) => {
            return '<blockquote>\n' + quote + '</blockquote>\n';
        };
        this.html = (html) => {
            return html;
        };
        this.heading = (text, level, raw) => {
            return '<h'
                + level
                + ' id="'
                + this.options.headerPrefix
                + raw.toLowerCase().replace(/[^\w]+/g, '-')
                + '">'
                + text
                + '</h'
                + level
                + '>\n';
        };
        this.hr = () => {
            return this.options.xhtml ? '<hr/>\n' : '<hr>\n';
        };
        this.list = (body, ordered) => {
            let type = ordered ? 'ol' : 'ul';
            return '<' + type + '>\n' + body + '</' + type + '>\n';
        };
        this.listitem = (text) => {
            return '<li>' + text + '</li>\n';
        };
        this.paragraph = (text) => {
            return '<p>' + text + '</p>\n';
        };
        this.table = (header, body) => {
            return '<table>\n'
                + '<thead>\n'
                + header
                + '</thead>\n'
                + '<tbody>\n'
                + body
                + '</tbody>\n'
                + '</table>\n';
        };
        this.tablerow = (content) => {
            return '<tr>\n' + content + '</tr>\n';
        };
        this.tablecell = (content, flags) => {
            let type = flags.header ? 'th' : 'td';
            let tag = flags.align
                ? '<' + type + ' style="text-align:' + flags.align + '">'
                : '<' + type + '>';
            return tag + content + '</' + type + '>\n';
        };
        // span level renderer
        this.strong = (text) => {
            return '<strong>' + text + '</strong>';
        };
        this.em = (text) => {
            return '<em>' + text + '</em>';
        };
        this.codespan = (text) => {
            return '<code>' + text + '</code>';
        };
        this.br = () => {
            return this.options.xhtml ? '<br/>' : '<br>';
        };
        this.del = (text) => {
            return '<del>' + text + '</del>';
        };
        this.link = (href, title, text) => {
            if (this.options.sanitize) {
                let prot;
                try {
                    prot = decodeURIComponent(unescape(href))
                        .replace(/[^\w:]/g, '')
                        .toLowerCase();
                }
                catch (e) {
                    return '';
                }
                if (prot.indexOf('javascript:') === 0 || prot.indexOf('vbscript:') === 0) {
                    return '';
                }
            }
            let out = '<a href="' + href + '"';
            if (title) {
                out = out.concat(' title="' + title + '"');
            }
            out = out.concat('>' + text + '</a>');
            return out;
        };
        this.image = (href, title, text) => {
            let out = '<img src="' + href + '" alt="' + text + '"';
            if (title) {
                out = out.concat(' title="' + title + '"');
            }
            out = out.concat(this.options.xhtml ? '/>' : '>');
            return out;
        };
        this.newSequence = () => {
            return '';
        };
        this.options = options;
    }
}
exports.Renderer = Renderer;
