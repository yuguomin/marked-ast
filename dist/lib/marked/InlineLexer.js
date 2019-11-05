"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Renderer_1 = require("./Renderer");
const getInline_1 = require("./common/getInline");
const escape_1 = __importDefault(require("../../helpers/escape"));
const defaultOptions_1 = require("./common/defaultOptions");
class InlineLexer {
    constructor(links, options, renderer) {
        this.inline = getInline_1.getInline();
        this.output = (src) => {
            let out = this.renderer.newSequence();
            let link;
            let text;
            let href;
            let cap;
            while (src) {
                // escape
                if (cap = this.rules.escape.exec(src)) {
                    src = src.substring(cap[0].length);
                    out = out.concat(cap[1]);
                    continue;
                }
                // autolink
                if (cap = this.rules.autolink.exec(src)) {
                    src = src.substring(cap[0].length);
                    if (cap[2] === '@') {
                        text = cap[1].charAt(6) === ':'
                            ? this.mangle(cap[1].substring(7))
                            : this.mangle(cap[1]);
                        href = this.mangle('mailto:') + text;
                    }
                    else {
                        text = escape_1.default(cap[1]);
                        href = text;
                    }
                    out = out.concat(this.renderer.link(href, null, text));
                    continue;
                }
                // url (gfm)
                if (!this.inLink && (cap = this.rules.url.exec(src))) {
                    src = src.substring(cap[0].length);
                    text = escape_1.default(cap[1]);
                    href = text;
                    out = out.concat(this.renderer.link(href, null, text));
                    continue;
                }
                // tag
                if (cap = this.rules.tag.exec(src)) {
                    if (!this.inLink && /^<a /i.test(cap[0])) {
                        this.inLink = true;
                    }
                    else if (this.inLink && /^<\/a>/i.test(cap[0])) {
                        this.inLink = false;
                    }
                    src = src.substring(cap[0].length);
                    out = out.concat(this.options.sanitize
                        ? escape_1.default(cap[0])
                        : cap[0]);
                    continue;
                }
                // link
                if (cap = this.rules.link.exec(src)) {
                    src = src.substring(cap[0].length);
                    this.inLink = true;
                    out = out.concat(this.outputLink(cap, {
                        href: cap[2],
                        title: cap[3]
                    }));
                    this.inLink = false;
                    continue;
                }
                // reflink, nolink
                if ((cap = this.rules.reflink.exec(src))
                    || (cap = this.rules.nolink.exec(src))) {
                    src = src.substring(cap[0].length);
                    link = (cap[2] || cap[1]).replace(/\s+/g, ' ');
                    link = this.links[link.toLowerCase()];
                    if (!link || !link.href) {
                        out = out.concat(cap[0].charAt(0));
                        src = cap[0].substring(1) + src;
                        continue;
                    }
                    this.inLink = true;
                    out = out.concat(this.outputLink(cap, link));
                    this.inLink = false;
                    continue;
                }
                // strong
                if (cap = this.rules.strong.exec(src)) {
                    src = src.substring(cap[0].length);
                    out = out.concat(this.renderer.strong(this.output(cap[2] || cap[1])));
                    continue;
                }
                // em
                if (cap = this.rules.em.exec(src)) {
                    src = src.substring(cap[0].length);
                    out = out.concat(this.renderer.em(this.output(cap[2] || cap[1])));
                    continue;
                }
                // code
                if (cap = this.rules.code.exec(src)) {
                    src = src.substring(cap[0].length);
                    out = out.concat(this.renderer.codespan(escape_1.default(cap[2], true)));
                    continue;
                }
                // br
                if (cap = this.rules.br.exec(src)) {
                    src = src.substring(cap[0].length);
                    out = out.concat(this.renderer.br());
                    continue;
                }
                // del (gfm)
                if (cap = this.rules.del.exec(src)) {
                    src = src.substring(cap[0].length);
                    out = out.concat(this.renderer.del(this.output(cap[1])));
                    continue;
                }
                // text
                if (cap = this.rules.text.exec(src)) {
                    src = src.substring(cap[0].length);
                    out = out.concat(escape_1.default(this.smartypants(cap[0])));
                    continue;
                }
                if (src) {
                    throw new Error('Infinite loop on byte: ' + src.charCodeAt(0));
                }
            }
            return out;
        };
        this.outputLink = (cap, link) => {
            const href = escape_1.default(link.href);
            const title = link.title ? escape_1.default(link.title) : null;
            return cap[0].charAt(0) !== '!'
                ? this.renderer.link(href, title, this.output(cap[1]))
                : this.renderer.image(href, title, escape_1.default(cap[1]));
        };
        this.mangle = (text) => {
            let out = '';
            const l = text.length;
            let ch;
            for (let i = 0; i < l; i++) {
                ch = text.charCodeAt(i);
                if (Math.random() > 0.5) {
                    ch = 'x' + ch.toString(16);
                }
                out += '&#' + ch + ';';
            }
            return out;
        };
        this.smartypants = (text) => {
            if (!this.options.smartypants) {
                return text;
            }
            return text
                // em-dashes
                .replace(/--/g, '\u2014')
                // opening singles
                .replace(/(^|[-\u2014/(\[{"\s])'/g, '$1\u2018')
                // closing singles & apostrophes
                .replace(/'/g, '\u2019')
                // opening doubles
                .replace(/(^|[-\u2014/(\[{\u2018\s])"/g, '$1\u201c')
                // closing doubles
                .replace(/"/g, '\u201d')
                // ellipses
                .replace(/\.{3}/g, '\u2026');
        };
        this.options = options || defaultOptions_1.defaultOptions;
        this.links = links;
        this.rules = this.inline.normal;
        this.renderer = this.options.renderer || new Renderer_1.Renderer();
        this.renderer.options = this.options;
        if (!this.links) {
            throw new Error('Tokens array requires a `links` property.');
        }
        if (this.options.gfm) {
            if (this.options.breaks) {
                this.rules = this.inline.breaks;
            }
            else {
                this.rules = this.inline.gfm;
            }
        }
        else if (this.options.pedantic) {
            this.rules = this.inline.pedantic;
        }
    }
}
exports.InlineLexer = InlineLexer;
// @ts-ignore
InlineLexer.rules = getInline_1.getInline();
// @ts-ignore
InlineLexer.output = (src, links, options) => {
    const inline = new InlineLexer(links, options);
    return inline.output(src);
};
