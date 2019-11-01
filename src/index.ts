/** 
 * @description export MDTool
 * 1. MarkDown to AST
 * 2. MarkDown to HTML
 * 3. AST to HTML
 * 4. AST to MarkDown
 */

import { MD2HTML } from './MD2HTML';
import { MD2AST } from './MD2AST';
import { AST2HTML } from './AST2HTML';
import { AST2MD } from './AST2MD';

interface IMDTool {
  MD2AST: any;
  MD2HTML: (src: string, options?, callback?) => any;
  AST2HTML: any;
  AST2MD: any;
}

const MDTool: IMDTool = {
  MD2AST,
  MD2HTML,
  AST2HTML,
  AST2MD
};

export default MDTool;
