import Marked from '../lib/marked';

export const MD2HTML = (src) => {
  return new Marked(src).marked();
};
