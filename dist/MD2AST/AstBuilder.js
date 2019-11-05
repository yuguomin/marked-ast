"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const handlerArgs_1 = __importDefault(require("../lib/marked/common/handlerArgs"));
class AstBuilder {
    constructor() {
        this.newSequence = () => {
            return [];
        };
        this.makeHandler = (type, args) => {
            return function () {
                const result = { type };
                for (let i = 0; i < args.length; ++i) {
                    result[args[i]] = arguments[i];
                }
                return result;
            };
        };
        for (const key in handlerArgs_1.default) {
            AstBuilder.prototype[key] = this.makeHandler(key, handlerArgs_1.default[key]);
        }
    }
}
exports.AstBuilder = AstBuilder;
