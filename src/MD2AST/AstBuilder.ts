import handlerArgs from '../lib/marked/common/handlerArgs';

export class AstBuilder {
  constructor() {
    for (var key in handlerArgs) {
      AstBuilder.prototype[key] = this.makeHandler(key, handlerArgs[key]);
    }
  }

  public newSequence = () => {
    return [];
  }

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