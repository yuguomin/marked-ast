"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const entities_1 = require("entities");
exports.genList = (node, indent, index, ast, writeNode) => node.body.map((item, c) => {
    const charPrefix = node.ordered ? ((c + 1) + '. ') : '* ';
    const formattedItems = item.text.map((childNode, childIndex) => {
        if (typeof childNode === 'string') {
            return entities_1.decodeHTML(childNode);
        }
        if (childNode.type !== 'list') {
            return writeNode(childNode, childIndex, ast);
        }
        return exports.genList(childNode, `${indent}  `, childIndex, node.body[childIndex], writeNode);
    }).join('');
    return `\n${indent}${charPrefix}${formattedItems}`;
}).join('');
