/** 
 * @description export
 * 1. markdown to AST
 * 2. markdown to HTML
 * 3. AST to HTML
 */

import marked, { MarkedOptions } from 'marked';

interface IMDTool {
  MD2AST: number;
  MD2HTML: (src: string, options?: MarkedOptions, callback?: (error: any | undefined, parseResult: string) => void) => string;
  AST2HTML: number;
}


export const MDTool: IMDTool = {
  MD2AST: 1,
  MD2HTML: marked.parse,
  AST2HTML: 2
};

 console.log(MDTool.MD2HTML(`
 #### detail

| 类别 | 详情1 | 第三个 |
| -- | ---- | --- |
| request-method | GET | x |
| request-url | /pb/card/list | s |`))