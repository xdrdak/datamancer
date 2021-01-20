import { App, Controller } from '../dist';

class Greeter extends Controller {
  connect() {
    console.log('Greeter is ready!');
  }

  sayHello() {
    console.log('Allo allo!');
  }
}

const app = new App();
app.register('greeter', Greeter);
