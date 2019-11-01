"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const escape = (html, isEncode) => {
    return html
        .replace(!isEncode ? /&(?!#?\w+;)/g : /&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
};
exports.default = escape;
