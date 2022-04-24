"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.func = void 0;
//export async function func(req: express.Request, res: express.Response, context: IFunContext)  {
function func(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        //do work
        console.log("called");
        console.log("called2");
        console.log("called3");
        res.status(200).send({ body: { "id": "123r" } });
    });
}
exports.func = func;
//# sourceMappingURL=app_service.js.map