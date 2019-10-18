import regExpNoop from './regExpNoop';
import merge from '../../../helpers/merge';
import replace from '../../../helpers/replace';

interface IBlock {
  newline: RegExp;
  code: RegExp;
  fences: regExpNoop;
  hr: RegExp;
  heading: RegExp;
  nptable: regExpNoop;
  lheading: RegExp;
  blockquote: RegExp;
  list: RegExp;
  html: RegExp;
  def: RegExp;
  table: regExpNoop;
  paragraph: RegExp;
  text: RegExp;
  bullet: RegExp | null;
  item: RegExp | null;
  _tag: string | null;
  normal: RegExp | null;
  gfm: RegExp | null;
  tables: RegExp | null;
}

export const getBlock = () => {
  /**
   * Block-Level Grammar
   */
  const block: IBlock = {
    newline: /^\n+/,
    code: /^( {4}[^\n]+\n*)+/,
    fences: regExpNoop,
    hr: /^( *[-*_]){3,} *(?:\n+|$)/,
    heading: /^ *(#{1,6}) *([^\n]+?) *#* *(?:\n+|$)/,
    nptable: regExpNoop,
    lheading: /^([^\n]+)\n *(=|-){2,} *(?:\n+|$)/,
    blockquote: /^( *>[^\n]+(\n(?!def)[^\n]+)*\n*)+/,
    list: /^( *)(bull) [\s\S]+?(?:hr|def|\n{2,}(?! )(?!\1bull )\n*|\s*$)/,
    html: /^ *(?:comment *(?:\n|\s*$)|closed *(?:\n{2,}|\s*$)|closing *(?:\n{2,}|\s*$))/,
    def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +["(]([^\n]+)[")])? *(?:\n+|$)/,
    table: regExpNoop,
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
  block.item = replace(block.item, 'gm')
    (/bull/g, block.bullet)
    ();

  // @ts-ignore
  block.list = replace(block.list)
    (/bull/g, block.bullet)
    ('hr', '\\n+(?=\\1?(?:[-*_] *){3,}(?:\\n+|$))')
    ('def', '\\n+(?=' + block.def.source + ')')
    ();

  // @ts-ignore
  block.blockquote = replace(block.blockquote)
    ('def', block.def)
    ();

  block._tag = '(?!(?:'
    + 'a|em|strong|small|s|cite|q|dfn|abbr|data|time|code'
    + '|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo'
    + '|span|br|wbr|ins|del|img)\\b)\\w+(?!:/|[^\\w\\s@]*@)\\b';

  // @ts-ignore
  block.html = replace(block.html)
    ('comment', /<!--[\s\S]*?-->/)
    ('closed', /<(tag)[\s\S]+?<\/\1>/)
    ('closing', /<tag(?:"[^"]*"|'[^']*'|[^'">])*?>/)
    (/tag/g, block._tag)
    ();

  // @ts-ignore
  block.paragraph = replace(block.paragraph)
    ('hr', block.hr)
    ('heading', block.heading)
    ('lheading', block.lheading)
    ('blockquote', block.blockquote)
    ('tag', '<' + block._tag)
    ('def', block.def)
    ();

  /**
   * Normal Block Grammar
   */
  block.normal = merge({}, [block]);

  /**
   * GFM Block Grammar
   */

  block.gfm = merge({}, [block.normal, {
    fences: /^ *(`{3,}|~{3,}) *(\S+)? *\n([\s\S]+?)\s*\1 *(?:\n+|$)/,
    paragraph: /^/
  }]);

  // @ts-ignore
  block.gfm.paragraph = replace(block.paragraph)
    ('(?!', '(?!'
      // @ts-ignore
      + block.gfm.fences.source.replace('\\1', '\\2') + '|'
      + block.list.source.replace('\\1', '\\3') + '|')
    ();

  /**
   * GFM + Tables Block Grammar
   */

  block.tables = merge({}, [block.gfm, {
    nptable: /^ *(\S.*\|.*)\n *([-:]+ *\|[-| :]*)\n((?:.*\|.*(?:\n|$))*)\n*/,
    table: /^ *\|(.+)\n *\|( *[-:]+[-| :]*)\n((?: *\|.*(?:\n|$))*)\n*/
  }]);

  return block;
}

export default getBlock;