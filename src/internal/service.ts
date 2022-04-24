import { EventEmitter } from "events"
import express from "express";
import * as http from 'http';
import { getConfig } from "./extensions";
import { ProbesConfig, ProbeType, KubeProbes } from "../pkg/kubernetes/probes";

import { func } from "./app_service";

export class baseService implements IService {
  private _op: EventEmitter = new EventEmitter;
  private _app: express.Application;
  private _server: http.Server | undefined;

  //config load

  private _probes: KubeProbes;
  private _kubeLiveness!: string;
  private _kubeLivenessEvent!: string;


  constructor(op: EventEmitter) {
    //incase bind this back to stop, as can be invocated outside of scope
    this.stop = this.stop.bind(this);
    this._app = this._createExpressApp();
    this._op = op;

    const pconfig = new ProbesConfig();

    this._kubeLiveness = getConfig("KUBE_PROBE_LIVENESS");
    this._kubeLivenessEvent = getConfig("KUBE_PROBE_LIVENESS_EVENT_WATCHER");

    pconfig.LivenessProbe = new ProbeType(this._kubeLiveness, this._kubeLivenessEvent);

    this._probes = new KubeProbes(pconfig, op);

    this._probes.setupWithExpress(this._app);
  }

  init(context?: any): void {
    console.log("initing service");

  }

  async start(): Promise<void> {
    console.log("starting service");

    this._app.get('/test', func);

    this._server = this._app.listen(6060);
  }

  async stop(): Promise<void> {

    if(this._server != undefined) {
      await this._server.close(() => {
        console.log("Express server close ... shutdown");
      });
    }

    //TODO: get from context, config etc
    this._op.emit("SERVICECLOSED");
  }

  private _createExpressApp() {
    const _app = express();

    _app.use(express.urlencoded({ extended: true, limit: '16mb' }));
    _app.use(express.json({limit: '16mb'}));

    return _app
  }
}

export interface IService {
  init(op: EventEmitter, context?: any): void;
  start() : Promise<void>;
  stop() : Promise<void>;

}
