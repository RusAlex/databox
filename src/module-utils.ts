import Server, { Context as ServerContext } from './server';

export interface InitContext {
  server: typeof Server;
  context: Context;
}

export interface Context extends ServerContext {}

export interface Module {
  handler?: (ctx: Context) => Promise<any>;
  handlers?: { fun: (ctx: Context) => Promise<any>; interval?: number }[];
  interval?: number;
  init: (ctx: InitContext) => Module;
}
