import { Renderer } from './Renderer';
import { InlineLexer } from './InlineLexer';
import { defaultOptions } from './common';

export default class Parser {
  constructor(options, renderer?) {
    this.tokens = [];
    this.token = null;
    this.options = options || defaultOptions;
    this.options = options;
    this.options.renderer = this.options.renderer || new Renderer;
    this.options.renderer = this.options.renderer;
    this.renderer = this.options.renderer;
    this.renderer.options = this.options;
  }

  static parse = (src, options, renderer?) => {
    var parser = new Parser(options, renderer);
    return parser.parse(src);
  }

  private tokens;
  private token;
  private options;
  private renderer;
  private inline;

  public parse = (src) => {
    this.inline = new InlineLexer(src.links, this.options, this.renderer);
    this.tokens = src.reverse();

    var out = this.renderer.newSequence();
    while (this.next()) {
      out = out.concat(this.tok());
    }

    return out;
  }

  public next = () => {
    return this.token = this.tokens.pop();
  }

  public peek = () => {
    return this.tokens[this.tokens.length - 1] || 0;
  }

  public parseText = () => {
    var body = this.token.text;

    while (this.peek().type === 'text') {
      body = body.concat('\n' + this.next().text);
    }

    return this.inline.output(body);
  }

  public tok = () => {
    switch (this.token.type) {
      case 'space': {
        return '';
      }
      case 'hr': {
        return this.renderer.hr();
      }
      case 'heading': {
        return this.renderer.heading(
          this.inline.output(this.token.text),
          this.token.depth,
          this.token.text);
      }
      case 'code': {
        return this.renderer.code(this.token.text,
          this.token.lang,
          this.token.escaped,
          !!this.token.fenced);
      }
      case 'table': {
        var header = this.renderer.newSequence()
          , body = this.renderer.newSequence()
          , i
          , row
          , cell
          , flags
          , j;

        // header
        cell = this.renderer.newSequence();
        for (i = 0; i < this.token.header.length; i++) {
          flags = { header: true, align: this.token.align[i] };
          cell = cell.concat(this.renderer.tablecell(
            this.inline.output(this.token.header[i]),
            { header: true, align: this.token.align[i] }
          ));
        }
        header = header.concat(this.renderer.tablerow(cell));

        for (i = 0; i < this.token.cells.length; i++) {
          row = this.token.cells[i];

          cell = this.renderer.newSequence();
          for (j = 0; j < row.length; j++) {
            cell = cell.concat(this.renderer.tablecell(
              this.inline.output(row[j]),
              { header: false, align: this.token.align[j] }
            ));
          }

          body = body.concat(this.renderer.tablerow(cell));
        }
        return this.renderer.table(header, body);
      }
      case 'blockquote_start': {
        var body = this.renderer.newSequence();

        while (this.next().type !== 'blockquote_end') {
          body = body.concat(this.tok());
        }

        return this.renderer.blockquote(body);
      }
      case 'list_start': {
        var body = this.renderer.newSequence()
          , ordered = this.token.ordered;

        while (this.next().type !== 'list_end') {
          body = body.concat(this.tok());
        }

        return this.renderer.list(body, ordered);
      }
      case 'list_item_start': {
        var body = this.renderer.newSequence();

        while (this.next().type !== 'list_item_end') {
          body = body.concat(this.token.type === 'text'
            ? this.parseText()
            : this.tok());
        }

        return this.renderer.listitem(body);
      }
      case 'loose_item_start': {
        var body = this.renderer.newSequence();

        while (this.next().type !== 'list_item_end') {
          body = body.concat(this.tok());
        }

        return this.renderer.listitem(body);
      }
      case 'html': {
        var html = !this.token.pre && !this.options.pedantic
          ? this.inline.output(this.token.text)
          : this.token.text;
        return this.renderer.html(html);
      }
      case 'paragraph': {
        return this.renderer.paragraph(this.inline.output(this.token.text));
      }
      case 'text': {
        return this.renderer.paragraph(this.parseText());
      }
    }
  }
}