## what is this
A modified version of pdubroy/marked-ast that can produce an abstract syntax tree for Markdown

## install
add this code in your project package.json/dependencies
```json
"marked-ast": "https://github.com/yuguomin/marked-ast.git"
```
then install
```shell
yarn install
```

## how to use
```TypeScript
// import this tool from package
import MDTool from 'marked-ast';

const MD = `
#### detail

| 类别 | 详情1 | 第三个 |
| :-- | ---- | --- |
| request-method | GET | x |
| request-url | /pb/card/list | s |`;
// MD -> AST
const AST = MDTool.MD2AST(MD);
// MD -> HTML
MDTool.MD2HTML(MD);
// AST -> MD
MDTool.AST2MD(AST);
// AST -> HTML
MDTool.AST2HTML(AST);
```

## dev this package
if you want to dev this package or change, you can do this:

need global devDependencies
[`node`](https://nodejs.org/en/download/package-manager/)
[`TypeScript`](https://ts.xcatliu.com/introduction/get-typescript)
[`yarn`](https://yarn.bootcss.com/docs/install/#mac-stable)

install packages
```shell
yarn install
```

### start
```shell
yarn start
```
this command will execute ./example/index.ts file, tell how to use.

### dev
``` shell
yarn dev
```
this command will parse src to dist, ts to js.

### build
```shell
yarn build
```
this command will rewritten dist folder.