import { AstBuilder } from './AstBuilder';
import Marked from '../lib/marked/index';

export const MD2AST = (text) => {
  return new Marked(text, {
    renderer: new AstBuilder() as any
  }).marked();
}