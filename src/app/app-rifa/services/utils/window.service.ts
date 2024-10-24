import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WindowRef {

  constructor() { }

  get nativeWindow(): any {
    return this._window();
  }

   _window(): any {
    return window;
  }

  isMobile(): boolean {
    return this.nativeWindow.innerWidth <= 768;
  }
}
