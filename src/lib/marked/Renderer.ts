import escape from '../../helpers/escape';

export class Renderer {
  constructor(options = {}) {
    this.options = options;
  }

  private options;

  public code = (code, lang, escaped, fenced) => {
    if (this.options.highlight) {
      let out = this.options.highlight(code, lang);
      if (out != null && out !== code) {
        escaped = true;
        code = out;
      }
    }

    if (!lang) {
      return '<pre><code>'
        + (escaped ? code : escape(code, true))
        + '\n</code></pre>';
    }

    return '<pre><code class="'
      + this.options.langPrefix
      + escape(lang, true)
      + '">'
      + (escaped ? code : escape(code, true))
      + '\n</code></pre>\n';
  }

  public blockquote = (quote) => {
    return '<blockquote>\n' + quote + '</blockquote>\n';
  }

  public html = (html) => {
    return html;
  };

  public heading = (text, level, raw) => {
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

  public hr = () => {
    return this.options.xhtml ? '<hr/>\n' : '<hr>\n';
  };

  public list = (body, ordered) => {
    let type = ordered ? 'ol' : 'ul';
    return '<' + type + '>\n' + body + '</' + type + '>\n';
  };

  public listitem = (text) => {
    return '<li>' + text + '</li>\n';
  };

  public paragraph = (text) => {
    return '<p>' + text + '</p>\n';
  };

  public table = (header, body) => {
    return '<table>\n'
      + '<thead>\n'
      + header
      + '</thead>\n'
      + '<tbody>\n'
      + body
      + '</tbody>\n'
      + '</table>\n';
  };

  public tablerow = (content) => {
    return '<tr>\n' + content + '</tr>\n';
  };

  public tablecell = (content, flags) => {
    let type = flags.header ? 'th' : 'td';
    let tag = flags.align
      ? '<' + type + ' style="text-align:' + flags.align + '">'
      : '<' + type + '>';
    return tag + content + '</' + type + '>\n';
  };

  // span level renderer
  public strong = (text) => {
    return '<strong>' + text + '</strong>';
  };

  public em = (text) => {
    return '<em>' + text + '</em>';
  };

  public codespan = (text) => {
    return '<code>' + text + '</code>';
  };

  public br = () => {
    return this.options.xhtml ? '<br/>' : '<br>';
  };

  public del = (text) => {
    return '<del>' + text + '</del>';
  };

  public link = (href, title, text) => {
    if (this.options.sanitize) {
      let prot;
      try {
        prot = decodeURIComponent(unescape(href))
          .replace(/[^\w:]/g, '')
          .toLowerCase();
      } catch (e) {
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

  public image = (href, title, text) => {
    let out = '<img src="' + href + '" alt="' + text + '"';
    if (title) {
      out = out.concat(' title="' + title + '"');
    }
    out = out.concat(this.options.xhtml ? '/>' : '>');
    return out;
  }

  public newSequence = () => {
    return '';
  };
}