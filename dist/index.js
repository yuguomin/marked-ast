"use strict";
/**
 * @description export
 * 1. MarkDown to AST
 * 2. MarkDown to HTML
 * 3. AST to HTML
 * 4. AST to MarkDown
 */
Object.defineProperty(exports, "__esModule", { value: true });
const MD2HTML_1 = require("./MD2HTML");
const MD2AST_1 = require("./MD2AST");
const AST2HTML_1 = require("./AST2HTML");
const AST2MD_1 = require("./AST2MD");
const MDTool = {
    MD2AST: MD2AST_1.MD2AST,
    MD2HTML: MD2HTML_1.MD2HTML,
    AST2HTML: AST2HTML_1.AST2HTML,
    AST2MD: AST2MD_1.AST2MD
};
exports.default = MDTool;
