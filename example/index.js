import { App, Controller } from '../dist';

const translations = {
  en: {
    text: 'This is some text',
    submit: 'Submit',
  },
  fr: {
    text: 'Voici du texte',
    submit: 'Omelette',
  },
};

class Greeter extends Controller {
  connect() {
    console.log('Greeter been initialized');
  }

  yolo() {
    if (this.targets['content'] instanceof HTMLInputElement) {
      this.targets['output'].textContent = this.targets['content'].value;
    }
  }
}

class I18n extends Controller {
  connect() {
    console.log('i18n has been initialized');
  }

  swapLanguages(_, node) {
    const keys = Object.keys(this.targets);
    const lang = node.value;
    console.log(this.targets);
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
