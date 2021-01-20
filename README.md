# Datamancer

Simple and opinionated way to bind `data-*` to controllers. Heavily inspired by [stimulus](https://stimulus.hotwire.dev/).
Not ready for prod. Use at your own risk and peril.

## Core design philosophy

Datamancer was built for super simple static pages that require just a tiny bit of interactivity and maximum
interoperability across browsers.

The idea is to automatically bind event handlers to the DOM in an opinionated way to ensure we control the
eventual spaghettification when you start to slap handlers on the page. Actions our bound via `data-*` tags. This is
done to prevent accidental squashing of important properties, such as `id`, `class` or `name`.

This library is not meant to replace Stimulus, Alpine, React or whatever. It simply the by-product of limitations of
a given product.

## Useage

### Basic controller setup

First, you will need to bind a controller to a particular DOM element. This is done via the `data-controller` property.

```html
<div data-controller="greeter"></div>
```

This will serve as a marker for the Datamancer to crawl thru it's DOM children in an attempt to bind properties to the controller.

Next, you'll want to create a controller and register it.

```js
import { App, Controller } from 'datamancer';

class Greeter extends Controller {
  connect() {
    console.log('Greeter initialized!');
  }
}

const app = new App();
app.register('greeter', Greeter);
```

If everything was done correctly, the `Greeter` class should have crawled thru it's DOM children. The `connect` function
is called after a succesful mount.

### Binding actions

Adding interactivity to a page is done via another `data` tag.

```html
<div data-controller="greeter">
  <button type="button" data-action="click->greeter#sayHello">Greet</button>
</div>
```

```js
import { App, Controller } from 'datamancer';

class Greeter extends Controller {
  connect() {
    console.log('Greeter initialized!');
  }

  sayHello() {
    console.log('Hello world!');
  }
}

const app = new App();
app.register('greeter', Greeter);
```

We have added a new button with the `data-action="click->greeter#sayHello"` property.

The `data-action` signals to the Datamancer that we wish to bind and event handler to this particular DOM element.
The contents of `data-action` is an opinionated way to invoke the right function from the right controller. The
essential gist of it is: `{EVENT_NAME}->{CONTROLLER_NAME}#{FUNCTION_TO_CALL}`.

The event name is any valid [event type](https://developer.mozilla.org/en-US/docs/Web/Events). The controller name is
the name in which we registered the controller to. So, in the previous example, we've done `app.register('greeter', Greeter)`.
What this means is that the controller name `greeter` is bound to the `Greeter` class. Lastly, the function to call
is a function that is found within our `greeter` controller. Meaning, we will attempt to invoke a function from the
instanciated Greeter class.

If everything went well, you should see a `console.log` appear whenever we click on the button.

### Defining targets

We can define targets that a controller can freely mutate.

```html
<div data-controller="greeter">
  <input type="text" data-greeter-target="input"></input>
  <button type="button" data-action="click->greeter#sayHello">Greet</button>
</div>
```

```js
import { App, Controller } from 'datamancer';

class Greeter extends Controller {
  connect() {
    console.log('Greeter initialized!');
  }

  sayHello() {
    const text = this.targets['input'].textContent;
    console.log(`Hello ${text}!`);
  }
}

const app = new App();
app.register('greeter', Greeter);
```

You can noticed we have added the `data-greeter-target="input"` to a newly added `<input />` DOM element.

This signals to the Datamancer that we wish to add a particular DOM element to the `greeter` controller. This element
can then be refered by simply accessing the `this.targets` property within the controller. The name of the target is
based on the value that is passed into our data tag.

The essential gist is: `data-{CONTROLLER_NAME}-target="{IDENTIFIER}"`.

If everything went well, you should see a `console.log` with a nice little gretting appear whenever we click on the button.

### Register multiple controllers

You may register multiple controllers to a particular DOM element. This is particularly useful to seperate functionality
between controllers.

```html
<div data-controller="greeter i18n">
  <select data-action="change->i18n#swapLanguages">
    <option value="en">en</option>
    <option value="fr">fr</option>
  </select>
  <input data-greeter-target="content"></input>
  <div data-i18n-target="text" data-greeter-target="text">This is some text</div>
  <button type="button" data-action="click->greeter#yolo" data-i18n-target="submit">Submit</button>
  <div data-greeter-target="output"></div>
</div>
```

```js
import { App } from './App';
import { Controller } from './Controller';

const translations = {
  en: {
    text: 'This is some text',
    submit: 'Submit'
  },
  fr: {
    text: 'Voici du texte',
    submit: 'Omelette'
  },
} as const;

class Greeter extends Controller {
  connect() {
    console.log('Greeter been initialized')
  }

  yolo() {
    this.targets['output'].textContent = this.targets['content'].value;
  }
}

class I18n extends Controller {
  connect() {
    console.log('i18n has been initialized')
  }

  swapLanguages(_: any, node: HTMLSelectElement) {
    const keys = Object.keys(this.targets);
    const lang = node.value;
    console.log(this.targets)
    keys.forEach((key) => {
      const nextText = translations[lang][key];
      this.targets[key].textContent = nextText;
    });
    console.log(node.value);
  }
}


const app = new App();
app.register('greeter', Greeter);
app.register('i18n', I18n);
```
