"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const replace = (regex, opt = '') => {
    let regexSource = regex.source;
    return function self(name, val) {
        if (!name) {
            return new RegExp(regexSource, opt);
        }
        if (typeof val === 'object') {
            val = val.source;
        }
        val = val ? val.replace(/(^|[^\[])\^/g, '$1') : '';
        regexSource = regexSource.replace(name, val);
        return self;
    };
};
exports.default = replace;
