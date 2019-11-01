import MDTool from '../dist/index';

const MD = `
#### detail

| 类别 | 详情1 | 第三个 |
| :-- | ---- | --- |
| request-method | GET | x |
| request-url | /pb/card/list | s |`;

const AST = MDTool.MD2AST(MD);

console.log(AST);

console.log(MDTool.MD2HTML(MD));

console.log(MDTool.AST2MD(AST));

console.log(MDTool.AST2HTML(AST));