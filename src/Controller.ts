export class Controller {
  root: Element;
  targets: Record<string, HTMLElement>;

  constructor(controllerName: string) {
    const root = document.querySelector(`*[data-controller]`);
    let maybeRoot: Element | null = null;

    if (!root) {
      throw new Error(`Cannot instanciate the ${controllerName} controller. Please ensure you've entered the right data attribute`);
    }

    if (root instanceof HTMLElement && root.dataset.controller) {
      const boundControllers = root.dataset.controller.split(' ');
      boundControllers.forEach((controller) => {
        if (controller === controllerName) {
          maybeRoot = root;
        }
      });
    }

    if (!maybeRoot) {
      throw new Error(`Could not find controller for ${controllerName}`);
    }


    this.root = maybeRoot;
    this.targets = {};
  }

  connect() { }

  _register(identifier: string) {
    const actions = this.root.querySelectorAll('*[data-action]');
    actions.forEach((node) => {
      if (node instanceof HTMLElement && node.dataset && node.dataset.action) {
        const [event, controllerAction] = node.dataset.action.split('->') as string[];
        const [controller, actionName] = controllerAction.split('#');

        if (controller !== identifier) {
          // Not the right controller, skip...
          return;
        }

        if (this && this[(actionName as any)]) {
          const cb = this[actionName].bind(this);
          node.addEventListener(event, function eventCallback(event) {
            cb(event, node);
          });
        } else {
          console.warn(`Action ${event}->${actionName} could not be bound.`)
        }
      }
    });

    const targets = this.root.querySelectorAll(`*[data-${identifier}-target]`);
    targets.forEach(node => {
      if (node instanceof HTMLElement) {
        const target = node.dataset[`${identifier}Target`];
        if (target && !this.targets[target]) {
          this.targets[target] = node;
        } else if (target && this.targets[target]) {
          console.warn(`Target ${target} is already bound to this controller. Skipping...`);
        } else {
          throw new Error(`Target ${target} could not be bound.`)
        }
      }
    });
  }
}