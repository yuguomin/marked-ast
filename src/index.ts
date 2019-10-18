/** 
 * @description export
 * 1. markdown to AST
 * 2. markdown to HTML
 * 3. AST to HTML
 */

import marked from './lib/marked';
import { MD2AST } from './MD2AST';
import { AST2HTML } from './AST2HTML';

interface IMDTool {
  MD2AST: any;
  MD2HTML: (src: string, options?, callback?) => any;
  AST2HTML: any;
}


export const MDTool: IMDTool = {
  MD2AST,
  MD2HTML: marked,
  AST2HTML
};

const ast = MDTool.MD2AST(`
#### detail

| 类别 | 详情1 | 第三个 |
| -- | ---- | --- |
| request-method | GET | x |
| request-url | /pb/card/list | s |`);

console.log(MDTool.AST2HTML(ast));