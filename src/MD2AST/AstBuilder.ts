import handlerArgs from '../lib/marked/common/handlerArgs';

export class AstBuilder {
  constructor() {
    for (const key in handlerArgs) {
      AstBuilder.prototype[key] = this.makeHandler(key, handlerArgs[key]);
    }
  }

  public newSequence = () => {
    return [];
  }

  private makeHandler = (type, args) => {
    return function () {
      const result = { type };
      for (let i = 0; i < args.length; ++i) {
        result[args[i]] = arguments[i];
      }
      return result;
    };
  }
}