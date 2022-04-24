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
exports.KubeProbes = exports.ProbeCheckState = exports.ProbeType = exports.ProbesConfig = void 0;
class ProbesConfig {
}
exports.ProbesConfig = ProbesConfig;
//TODO: update to support TCP and other protocols later
//TODO: not the best way to manage this
class ProbeType {
    constructor(path, event) {
        this.Path = path;
        this.Event = event;
    }
}
exports.ProbeType = ProbeType;
class ProbeCheckState {
    constructor(initStatus, details) {
        if (initStatus)
            this.Status = initStatus;
        else
            this.Status = 200;
        if (details)
            this.Details = details;
    }
}
exports.ProbeCheckState = ProbeCheckState;
class KubeProbes {
    constructor(probeconfig, op) {
        this._config = probeconfig;
        this._op = op;
        this._livenessStatus = new ProbeCheckState(200, { details: "Initializing" });
    }
    setupWithExpress(expressApp) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (((_a = this._config) === null || _a === void 0 ? void 0 : _a.LivenessProbe) != undefined) {
                expressApp.get(this._config.LivenessProbe.Path, (req, res) => {
                    res.status(this._livenessStatus.Status).send(this._livenessStatus.Details);
                });
            }
        });
    }
    SetLivenessProbeState(newState) {
        return __awaiter(this, void 0, void 0, function* () {
            this._livenessStatus = newState;
        });
    }
}
exports.KubeProbes = KubeProbes;
//# sourceMappingURL=probes.js.map