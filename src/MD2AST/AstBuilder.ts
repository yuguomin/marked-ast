export class AstBuilder {
  constructor() {
    for (var key in this.handlerArgs) {
      AstBuilder.prototype[key] = this.makeHandler(key, this.handlerArgs[key]);
    }
  }

  public newSequence = () => {
    return [];
  }

  private handlerArgs = {
    code: ['code', 'lang', 'escaped', 'fenced'],
    blockquote: ['quote'],
    html: ['html'],
    heading: ['text', 'level', 'raw'],
    hr: [],
    list: ['body', 'ordered'],
    listitem: ['text'],
    paragraph: ['text'],
    table: ['header', 'body'],
    tablerow: ['content'],
    tablecell: ['content', 'flags'],
    strong: ['text'],
    em: ['text'],
    codespan: ['text'],
    br: [],
    del: ['text'],
    link: ['href', 'title', 'text'],
    image: ['href', 'title', 'text']
  };

  private makeHandler = (type, args) => {
    return function () {
      const result = { type: type };
      for (var i = 0; i < args.length; ++i) {
        result[args[i]] = arguments[i];
      }
      return result;
    };
  }
}