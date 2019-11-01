"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AST2MD_1 = require("../AST2MD");
const MD2HTML_1 = require("../MD2HTML");
exports.AST2HTML = (tree) => {
    return MD2HTML_1.MD2HTML(AST2MD_1.AST2MD(tree));
};
