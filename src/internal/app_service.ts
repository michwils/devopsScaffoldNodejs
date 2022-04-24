import { config } from "dotenv";
import { getConfig } from "./extensions";
import express from "express";
import { EventEmitter } from "events";


//export async function func(req: express.Request, res: express.Response, context: IFunContext)  {
export async function func(req: express.Request, res: express.Response) {

  //do work
  console.log("called");
  console.log("called2");
  console.log("called3");

  res.status(200).send({ body: { "id": "123r" } })
}