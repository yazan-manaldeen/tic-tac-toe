import {Component} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";
import {zoomIn, zoomOut} from "@app/animations/zoom";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  animations: [zoomIn, zoomOut]
})
export class HomeComponent {
  title = 'Tic-Tac-Toe';

  selectedTheme = localStorage.getItem('theme');
  selectedLang = localStorage.getItem('lang');
  themeColorMeta: HTMLElement = document.getElementById('theme-color-meta');

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private translateService: TranslateService) {
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: {},
      queryParamsHandling: ''
    })
  }

  changeTheme(theme: string) {
    this.selectedTheme = theme;
    let themeClass: string = theme;
    if (theme === 'auto') {
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        themeClass = 'dark';
      } else {
        themeClass = 'light';
      }
    }
    document.body.classList.add(themeClass);
    if (themeClass === 'dark') {
      this.themeColorMeta.setAttribute('content', '#030712');
      document.body.classList.remove('light');
    } else {
      this.themeColorMeta.setAttribute('content', '#F0F3F5');
      document.body.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }

  changeLang() {
    const lang = localStorage.getItem('lang') === 'en' ? 'de' : 'en';
    this.selectedLang = lang;
    localStorage.setItem('lang', lang);
    document.documentElement.lang = lang;
    this.translateService.use(lang);
  }
}
