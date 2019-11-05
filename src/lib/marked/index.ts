import merge from '../../helpers/merge';
import escape from '../../helpers/escape';
import Parser from './Parser';
import Lexer from './Lexer';
import { defaultOptions, IOptions } from './common/defaultOptions';

export default class Marked {
  constructor(src: string, opt: IOptions = {}, callback?) {
    this.src = src;
    this.opt = opt;
    this.callback = callback;
  }

  private src: string;
  private opt: IOptions | null;
  private callback;
  private highlight;
  private tokens;

  public marked = () => {
    if (this.callback || typeof this.opt === 'function') {
      if (!this.callback) {
        this.callback = this.opt;
        this.opt = {};
      }

      this.opt = merge({}, [defaultOptions, this.opt || {}]);
      this.opt = this.opt || {};

      this.highlight = this.opt.highlight;
      // this.tokens;

      try {
        this.tokens = Lexer.lex(this.src, this.opt);
      } catch (e) {
        return this.callback(e);
      }

      let pending = this.tokens.length;

      if (!this.highlight || this.highlight.length < 3) {
        return this.done();
      }

      delete this.opt.highlight;

      if (!pending) { return this.done(); }

      this.tokens.forEach((token) => {
        if (token.type !== 'code') {
          return --pending || this.done();
        }
        return this.highlight(token.text, token.lang, (err, code) => {
          if (err) { return this.done(err); }
          if (code == null || code === token.text) {
            return --pending || this.done();
          }
          token.text = code;
          token.escaped = true;
          if (!(--pending)) { this.done(); }
        });
      }
      );

      return;
    }
    try {
      if (this.opt) { this.opt = merge({}, [defaultOptions, this.opt]); }
      return Parser.parse(Lexer.lex(this.src, this.opt), this.opt);
    } catch (e) {
      e.message += '\nPlease report this to www';
      if ((this.opt || defaultOptions).silent) {
        return '<p>An error occured:</p><pre>'
          + escape(e.message + '', true)
          + '</pre>';
      }
      throw e;
    }
  }

  // static setOptions = (opt) => {
  //   merge(defaultOptions, opt);
  //   return MD2HTML;
  // }

  private done = (err?) => {
    this.opt = null || {};
    if (err) {
      this.opt.highlight = this.highlight;
      return this.callback(err);
    }
    let out;
    try {
      out = Parser.parse(this.tokens, this.opt);
    } catch (e) {
      err = e;
    }
    this.opt.highlight = this.highlight;
    return err
      ? this.callback(err)
      : this.callback(null, out);
  }
}
