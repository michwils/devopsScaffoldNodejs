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
exports.jsonParseMapTypeHydrator = exports.jsonStringifyMapTypeReplacer = exports.getExtendedRandomID = exports.getRandomID = exports.getConfig = exports.asyncFor = exports.Sync = void 0;
class Sync {
    constructor(contextGroup, sync_op) {
        this._sync_count = 0;
        this._sync_cb = [];
        this._watch_started = false;
        this._sync_op = sync_op;
        this._trigger_event = "SYNC_TRIGGER" + contextGroup;
    }
    Add(event) {
        this._sync_op.on(event, () => {
            this._sub();
        });
        this._add();
        return this._trigger_event;
    }
    Watch(callback) {
        this._sync_op.on(this._trigger_event, () => {
            callback();
        });
    }
    _add() {
        return __awaiter(this, void 0, void 0, function* () {
            this._sync_count++;
            this._watch_started = true;
        });
    }
    _sub() {
        return __awaiter(this, void 0, void 0, function* () {
            this._sync_count--;
            if (this._sync_count <= 0) {
                if (this._watch_started == true) {
                    this._sync_op.emit(this._trigger_event);
                }
                //cleanup
                this._sync_count = 0;
                this._watch_started = false;
            }
        });
    }
}
exports.Sync = Sync;
function asyncFor(arr, callback) {
    return __awaiter(this, void 0, void 0, function* () {
        for (let i = 0; i < arr.length; i++) {
            yield callback(arr[i], i, arr);
        }
    });
}
exports.asyncFor = asyncFor;
function getConfig(key, def = "Default") {
    return process.env[key] || def;
}
exports.getConfig = getConfig;
function getRandomID() {
    return (new Date()).getTime().toString(36);
}
exports.getRandomID = getRandomID;
function getExtendedRandomID() {
    return ((new Date()).getTime().toString(36) + Math.random().toString(36).slice(2));
}
exports.getExtendedRandomID = getExtendedRandomID;
function jsonStringifyMapTypeReplacer(key, value) {
    if (value instanceof Map) {
        return {
            dataType: 'Map',
            value: Array.from(value.entries()),
        };
    }
    return value;
}
exports.jsonStringifyMapTypeReplacer = jsonStringifyMapTypeReplacer;
function jsonParseMapTypeHydrator(key, value) {
    if (typeof value === 'object' && value !== null) {
        if (value.dataType === 'Map') {
            return new Map(value.value);
        }
    }
    return value;
}
exports.jsonParseMapTypeHydrator = jsonParseMapTypeHydrator;
//# sourceMappingURL=extensions.js.map