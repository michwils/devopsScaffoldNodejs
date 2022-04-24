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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.baseService = void 0;
const events_1 = require("events");
const express_1 = __importDefault(require("express"));
const extensions_1 = require("./extensions");
const probes_1 = require("../pkg/kubernetes/probes");
const app_service_1 = require("./app_service");
class baseService {
    constructor(op) {
        this._op = new events_1.EventEmitter;
        //incase bind this back to stop, as can be invocated outside of scope
        this.stop = this.stop.bind(this);
        this._app = this._createExpressApp();
        this._op = op;
        const pconfig = new probes_1.ProbesConfig();
        this._kubeLiveness = (0, extensions_1.getConfig)("KUBE_PROBE_LIVENESS");
        this._kubeLivenessEvent = (0, extensions_1.getConfig)("KUBE_PROBE_LIVENESS_EVENT_WATCHER");
        pconfig.LivenessProbe = new probes_1.ProbeType(this._kubeLiveness, this._kubeLivenessEvent);
        this._probes = new probes_1.KubeProbes(pconfig, op);
        this._probes.setupWithExpress(this._app);
    }
    init(context) {
        console.log("initing service");
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("starting service");
            this._app.get('/test', app_service_1.func);
            this._server = this._app.listen(6060);
        });
    }
    stop() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._server != undefined) {
                yield this._server.close(() => {
                    console.log("Express server close ... shutdown");
                });
            }
            //TODO: get from context, config etc
            this._op.emit("SERVICECLOSED");
        });
    }
    _createExpressApp() {
        const _app = (0, express_1.default)();
        _app.use(express_1.default.urlencoded({ extended: true, limit: '16mb' }));
        _app.use(express_1.default.json({ limit: '16mb' }));
        return _app;
    }
}
exports.baseService = baseService;
//# sourceMappingURL=service.js.map