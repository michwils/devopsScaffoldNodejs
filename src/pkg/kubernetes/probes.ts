import { EventEmitter } from "events";
import express from "express";

export class ProbesConfig {
  public LivenessProbe: ProbeType | undefined;
  public RedinessProbe: ProbeType | undefined;
  public StartupProbe: ProbeType | undefined;

}

//TODO: update to support TCP and other protocols later
//TODO: not the best way to manage this
export class ProbeType {
  public readonly Path: string;
  public readonly Event: string;

  constructor(path: string, event: string) {
    this.Path = path;
    this.Event = event;
  }
}

export class ProbeCheckState {
  public Status: number;
  public Details: any;

  constructor(initStatus?: number, details?: any) {
    if(initStatus)
      this.Status = initStatus;
    else
      this.Status = 200;

    if(details)
      this.Details = details;
  }
}

export class KubeProbes {
  private readonly _config: ProbesConfig;
  private readonly _op: EventEmitter;

  private _livenessStatus: ProbeCheckState;

  constructor(probeconfig: ProbesConfig, op: EventEmitter) {
    this._config = probeconfig;
    this._op = op;

    this._livenessStatus = new ProbeCheckState(200, { details: "Initializing" })
  }

  async setupWithExpress(expressApp: express.Application) {

    if(this._config?.LivenessProbe != undefined) {
      expressApp.get(this._config.LivenessProbe.Path, (req, res) => {
        res.status(this._livenessStatus.Status).send(this._livenessStatus.Details);
      });
    }


  }

  public async SetLivenessProbeState(newState: ProbeCheckState) {
    this._livenessStatus = newState;
  }
}