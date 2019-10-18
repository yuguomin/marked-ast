import marked from '../lib/marked/index';
import { AstBuilder } from './AstBuilder';

export const MD2AST = (text) => {
  return marked(text, {
    renderer: new AstBuilder() as any
  });
}

console.log(MD2AST(`
#### detail

| 类别 | 详情1 | 第三个 |
| -- | ---- | --- |
| request-method | GET | x |
| request-url | /pb/card/list | s |`));