import { Renderer } from './Renderer';
import { getInline } from './common/getInline';
import escape from '../../helpers/escape';
import { defaultOptions } from './common/defaultOptions';

export class InlineLexer {
  constructor(links, options, renderer?) {
    this.options = options || defaultOptions;
    this.links = links;
    this.rules = this.inline.normal;
    this.renderer = this.options.renderer || new Renderer();
    this.renderer.options = this.options;

    if (!this.links) {
      throw new
        Error('Tokens array requires a `links` property.');
    }

    if (this.options.gfm) {
      if (this.options.breaks) {
        this.rules = this.inline.breaks;
      } else {
        this.rules = this.inline.gfm;
      }
    } else if (this.options.pedantic) {
      this.rules = this.inline.pedantic;
    }
  }

  private options;
  private links;
  private rules;
  private renderer;
  private inLink;

  private inline = getInline();
  // @ts-ignore
  private static rules = getInline();
  // @ts-ignore
  private static output = (src, links, options) => {
    const inline = new InlineLexer(links, options);
    return inline.output(src);
  }

  public output = (src) => {
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
        } else {
          text = escape(cap[1]);
          href = text;
        }
        out = out.concat(this.renderer.link(href, null, text));
        continue;
      }

      // url (gfm)
      if (!this.inLink && (cap = this.rules.url.exec(src))) {
        src = src.substring(cap[0].length);
        text = escape(cap[1]);
        href = text;
        out = out.concat(this.renderer.link(href, null, text));
        continue;
      }

      // tag
      if (cap = this.rules.tag.exec(src)) {
        if (!this.inLink && /^<a /i.test(cap[0])) {
          this.inLink = true;
        } else if (this.inLink && /^<\/a>/i.test(cap[0])) {
          this.inLink = false;
        }
        src = src.substring(cap[0].length);
        out = out.concat(this.options.sanitize
          ? escape(cap[0])
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
        out = out.concat(this.renderer.codespan(escape(cap[2], true)));
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
        out = out.concat(escape(this.smartypants(cap[0])));
        continue;
      }

      if (src) {
        throw new
          Error('Infinite loop on byte: ' + src.charCodeAt(0));
      }
    }

    return out;
  }

  private outputLink = (cap, link) => {
    const href = escape(link.href);
    const title = link.title ? escape(link.title) : null;

    return cap[0].charAt(0) !== '!'
      ? this.renderer.link(href, title, this.output(cap[1]))
      : this.renderer.image(href, title, escape(cap[1]));
  }

  public mangle = (text) => {
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
  }

  public smartypants = (text) => {
    if (!this.options.smartypants) { return text; }
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
  }
}