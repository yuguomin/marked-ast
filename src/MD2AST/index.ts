import marked from 'marked';
import { AstBuilder } from './AstBuilder';

export const MD2AST = (text) => {
  return marked(text, {
    renderer: new AstBuilder() as any
  });
}