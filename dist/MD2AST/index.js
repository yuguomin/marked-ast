"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AstBuilder_1 = require("./AstBuilder");
const index_1 = __importDefault(require("../lib/marked/index"));
exports.MD2AST = (text) => {
    return new index_1.default(text, {
        renderer: new AstBuilder_1.AstBuilder()
    }).marked();
};
