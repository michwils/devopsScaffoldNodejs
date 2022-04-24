
import { EventEmitter } from "events";

export class Sync{

  private _sync_count: number = 0;
  private _sync_cb: any[] = [];
  private _watch_started: boolean = false;
  private _sync_op: EventEmitter;
  private _trigger_event;

  constructor(contextGroup: string, sync_op: EventEmitter) {
    this._sync_op = sync_op;

    this._trigger_event = "SYNC_TRIGGER" + contextGroup;
  }

  Add(event: string): string {
   this._sync_op.on(event, () => {
      this._sub();
    });

    this._add();

    return this._trigger_event;
  }

  Watch(callback: any): void {
    this._sync_op.on(this._trigger_event, () => {
      callback();
    });
  }

  private async _add() {
    this._sync_count++;

    this._watch_started = true;
  }

  private async _sub() {
    this._sync_count--;

    if(this._sync_count <= 0) {

      if (this._watch_started == true) {
        this._sync_op.emit(this._trigger_event);
      }

      //cleanup
      this._sync_count = 0;
      this._watch_started = false;
    }
  }
}

export async function asyncFor(arr: Array<any>, callback: any) {
  for (let i = 0; i < arr.length; i ++) {
    await callback(arr[i], i, arr);
  }
}

export function getConfig(key: string, def = "Default") : string {
  return process.env[key] || def;
}

export function getRandomID() : string {
  return (new Date()).getTime().toString(36);
}

export function getExtendedRandomID() : string {
  return ((new Date()).getTime().toString(36) + Math.random().toString(36).slice(2));
}

export function jsonStringifyMapTypeReplacer(key: any, value: any) {
  if (value instanceof Map) {
    return {
      dataType: 'Map',
      value: Array.from(value.entries()),
    };
  }

  return value;
}

export function jsonParseMapTypeHydrator(key: any, value: any) {
  if (typeof value === 'object' && value !== null) {
    if (value.dataType === 'Map') {
      return new Map(value.value);
    }
  }

  return value;
}