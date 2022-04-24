import { EventEmitter } from "events";
import { baseService } from "../internal/service";

async function main() {
  console.log("Application Starting...");

  const opEventEmitter = new EventEmitter({ captureRejections: true });

  //await createService(opEventEmitter);

  const svc = new baseService(opEventEmitter);

  svc.init();

  handleSIG(opEventEmitter, svc.stop);

  await svc.start();
}

async function handleSIG(op: EventEmitter, cleanupPkgServices: () => Promise<void>) {
  process.on("SIGINT", () => {
    console.log("Exiting...")

    //default timeout is 30 seconds
    op.on("SIG", async () => {
      console.log("Closing app");
      await cleanupPkgServices();

      setTimeout(() => {
        console.log("WARNING: Cleanup took longer the current configured timeout.  Process is forcing exit.");
        process.exit(0);
      }, 30 * 1000)
    });

    op.on("SERVICECLOSED", () => {
      console.log("Services are shutdown and cleaned.");
      process.exit(0);
    });

    op.emit("SIG");
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
      if(err.code == "EPIPE") {
        process.exit(0);
      }
    });
  })
  .catch((reason) => {
    console.log("Unhandled Exception - Error...");
    console.log(reason);
  })