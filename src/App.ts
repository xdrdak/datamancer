import type { Controller } from './Controller';

export class App {
  register(name: string, C: typeof Controller) {
    const c = new C(name);
    c._register(name);
    c.connect();
  }
};
