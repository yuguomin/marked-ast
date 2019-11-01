"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const times_1 = __importDefault(require("whisk/times"));
exports.writeTableHeaderLine = (node) => `| ${node.content.map(toCellHeader).join(' | ')} |`;
const getHeaderLen = (cell) => cell.content.reduce((memo, item) => memo + (item.length || 0), 0);
const toCellHeader = (cell) => {
    let header = times_1.default(Math.max(getHeaderLen(cell), 3)).map(() => '-').join('');
    switch ((cell.flags || {}).align) {
        case 'left': {
            header = ':' + header.slice(1);
            break;
        }
        case 'right': {
            header = header.slice(0, -1) + ':';
            break;
        }
        case 'center': {
            header = ':' + header.slice(1, -1) + ':';
            break;
        }
    }
    return header;
};
