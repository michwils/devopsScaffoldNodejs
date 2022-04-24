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
const events_1 = require("events");
const service_1 = require("../internal/service");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Application Starting...");
        const opEventEmitter = new events_1.EventEmitter({ captureRejections: true });
        //await createService(opEventEmitter);
        const svc = new service_1.baseService(opEventEmitter);
        svc.init();
        handleSIG(opEventEmitter, svc.stop);
        yield svc.start();
    });
}
function handleSIG(op, cleanupPkgServices) {
    return __awaiter(this, void 0, void 0, function* () {
        process.on("SIGINT", () => {
            console.log("Exiting...");
            //default timeout is 30 seconds
            op.on("SIG", () => __awaiter(this, void 0, void 0, function* () {
                console.log("Closing app");
                yield cleanupPkgServices();
                setTimeout(() => {
                    console.log("WARNING: Cleanup took longer the current configured timeout.  Process is forcing exit.");
                    process.exit(0);
                }, 30 * 1000);
            }));
            op.on("SERVICECLOSED", () => {
                console.log("Services are shutdown and cleaned.");
                process.exit(0);
            });
            op.emit("SIG");
        });
    });
}
//call main
main()
    .then(() => {
    process.stdout.on('error', (err) => {
        console.log("STDOUT...");
        console.log(err);
        //check if underlying socket failure with sdks
        //could be eventhub js / mongo / rx / or just node
        //will debug at sometime
        if (err.code == "EPIPE") {
            process.exit(0);
        }
    });
})
    .catch((reason) => {
    console.log("Unhandled Exception - Error...");
    console.log(reason);
});
//# sourceMappingURL=index.js.map