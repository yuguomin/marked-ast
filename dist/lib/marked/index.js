"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const merge_1 = __importDefault(require("../../helpers/merge"));
const escape_1 = __importDefault(require("../../helpers/escape"));
const Parser_1 = __importDefault(require("./Parser"));
const Lexer_1 = __importDefault(require("./Lexer"));
const defaultOptions_1 = require("./common/defaultOptions");
class Marked {
    constructor(src, opt = {}, callback) {
        this.marked = () => {
            if (this.callback || typeof this.opt === 'function') {
                if (!this.callback) {
                    this.callback = this.opt;
                    this.opt = {};
                }
                this.opt = merge_1.default({}, [defaultOptions_1.defaultOptions, this.opt || {}]);
                this.opt = this.opt || {};
                this.highlight = this.opt.highlight;
                this.tokens;
                try {
                    this.tokens = Lexer_1.default.lex(this.src, this.opt);
                }
                catch (e) {
                    return this.callback(e);
                }
                let pending = this.tokens.length;
                if (!this.highlight || this.highlight.length < 3) {
                    return this.done();
                }
                delete this.opt.highlight;
                if (!pending) {
                    return this.done();
                }
                ;
                this.tokens.forEach((token) => {
                    if (token.type !== 'code') {
                        return --pending || this.done();
                    }
                    return this.highlight(token.text, token.lang, (err, code) => {
                        if (err)
                            return this.done(err);
                        if (code == null || code === token.text) {
                            return --pending || this.done();
                        }
                        token.text = code;
                        token.escaped = true;
                        --pending || this.done();
                    });
                });
                return;
            }
            try {
                if (this.opt) {
                    this.opt = merge_1.default({}, [defaultOptions_1.defaultOptions, this.opt]);
                }
                ;
                return Parser_1.default.parse(Lexer_1.default.lex(this.src, this.opt), this.opt);
            }
            catch (e) {
                e.message += '\nPlease report this to www';
                if ((this.opt || defaultOptions_1.defaultOptions).silent) {
                    return '<p>An error occured:</p><pre>'
                        + escape_1.default(e.message + '', true)
                        + '</pre>';
                }
                throw e;
            }
        };
        // static setOptions = (opt) => {
        //   merge(defaultOptions, opt);
        //   return MD2HTML;
        // }
        this.done = (err) => {
            this.opt = null || {};
            if (err) {
                this.opt.highlight = this.highlight;
                return this.callback(err);
            }
            let out;
            try {
                out = Parser_1.default.parse(this.tokens, this.opt);
            }
            catch (e) {
                err = e;
            }
            this.opt.highlight = this.highlight;
            return err
                ? this.callback(err)
                : this.callback(null, out);
        };
        this.src = src;
        this.opt = opt;
        this.callback = callback;
    }
}
exports.default = Marked;
