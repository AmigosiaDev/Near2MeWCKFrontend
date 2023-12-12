import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';

//To avoid console.log
import { environment } from './environments/environment';
import { enableProdMode } from '@angular/core';
if (environment.production) {
  window.console.log = () => {};
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));
