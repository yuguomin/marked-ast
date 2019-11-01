"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function merge(obj, copyArr) {
    let target;
    let key;
    copyArr.forEach((value) => {
        target = value;
        for (key in target) {
            if (Object.prototype.hasOwnProperty.call(target, key)) {
                obj[key] = target[key];
            }
        }
    });
    return obj;
}
exports.default = merge;
