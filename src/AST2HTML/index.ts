import { AST2MD } from '../AST2MD';
import { MD2HTML } from '../MD2HTML';

export const AST2HTML = (tree) => {
  return MD2HTML(AST2MD(tree));
}