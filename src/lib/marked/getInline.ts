import merge from '../../helpers/merge';
import replace from '../../helpers/replace';
import { noop } from './common';


interface IInline {
  escape: RegExp;
  autolink: RegExp;
  url: () => void;
  tag: RegExp;
  link: RegExp;
  reflink: RegExp;
  nolink: RegExp;
  strong: RegExp;
  em: RegExp;
  code: RegExp;
  br: RegExp;
  del: () => void;
  text: RegExp;
  _inside: RegExp | null;
  _href: RegExp | null;
  normal: RegExp | null;
  pedantic: RegExp | null;
  gfm: RegExp | null;
  breaks: RegExp | null;
};

/**
 * Inline-Level Grammar
 */
export const getInline = () => {
  const inline: IInline = {
    escape: /^\\([\\`*{}\[\]()#+\-.!_>])/,
    autolink: /^<([^ >]+(@|:\/)[^ >]+)>/,
    url: noop,
    tag: /^<!--[\s\S]*?-->|^<\/?\w+(?:"[^"]*"|'[^']*'|[^'">])*?>/,
    link: /^!?\[(inside)\]\(href\)/,
    reflink: /^!?\[(inside)\]\s*\[([^\]]*)\]/,
    nolink: /^!?\[((?:\[[^\]]*\]|[^\[\]])*)\]/,
    strong: /^__([\s\S]+?)__(?!_)|^\*\*([\s\S]+?)\*\*(?!\*)/,
    em: /^\b_((?:__|[\s\S])+?)_\b|^\*((?:\*\*|[\s\S])+?)\*(?!\*)/,
    code: /^(`+)\s*([\s\S]*?[^`])\s*\1(?!`)/,
    br: /^ {2,}\n(?!\s*$)/,
    del: noop,
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
  inline.link = replace(inline.link)
    ('inside', inline._inside)
    ('href', inline._href)
    ();

  // @ts-ignore
  inline.reflink = replace(inline.reflink)
    ('inside', inline._inside)
    ();

  /**
   * Normal Inline Grammar
   */

  inline.normal = merge({}, inline);

  /**
   * Pedantic Inline Grammar
   */

  inline.pedantic = merge({}, [inline.normal, {
    strong: /^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,
    em: /^_(?=\S)([\s\S]*?\S)_(?!_)|^\*(?=\S)([\s\S]*?\S)\*(?!\*)/
  }]);

  /**
   * GFM Inline Grammar
   */
  inline.gfm = merge({}, [inline.normal, {
    // @ts-ignore
    escape: replace(inline.escape)('])', '~|])')(),
    url: /^(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/,
    del: /^~~(?=\S)([\s\S]*?\S)~~/,
    // @ts-ignore
    text: replace(inline.text)
      (']|', '~]|')
      ('|', '|https?://|')
      ()
  }]);

  /**
   * GFM + Line Breaks Inline Grammar
   */

  inline.breaks = merge({}, [inline.gfm, {
    // @ts-ignore
    br: replace(inline.br)('{2,}', '*')(),
    // @ts-ignore
    text: replace(inline.gfm.text)('{2,}', '*')()
  }]);

  return inline;
}
