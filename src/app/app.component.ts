import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  darkMode = false
  constructor(
    private platform: Platform) {
    this.platform.ready().then(() => {
      const theme = localStorage.getItem('theme');
      if (theme == null) {
        const prefersDark = window.matchMedia('(prefers-color-scheme: light)');
        this.darkMode = prefersDark.matches;
        document.body.classList.toggle('dark', this.darkMode);
      } else {
        this.darkMode = theme == 'true' ? true : false;
        document.body.classList.toggle('dark', this.darkMode);
      }
    })
  }

  ChangeColorMode() {
    document.body.classList.toggle('dark', this.darkMode);
    //this.ui.ShowToast("Modo oscuro " + (this.darkMode ? "activado" : "desactivado"))
    localStorage.setItem('theme', String(this.darkMode));
  }
}
