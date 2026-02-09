import {APP_INITIALIZER, NgModule} from '@angular/core';
import {BrowserModule, DomSanitizer} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {MatIcon, MatIconRegistry} from "@angular/material/icon";
import {HttpClientModule} from "@angular/common/http";
import {HomeComponent} from './pages/home/home.component';
import {MatIconButton} from "@angular/material/button";
import {MatMenu, MatMenuTrigger} from "@angular/material/menu";
import {GameComponent} from './pages/game/game.component';
import {provideTranslateService, TranslatePipe, TranslateService} from "@ngx-translate/core";
import {provideTranslateHttpLoader} from "@ngx-translate/http-loader";
import {MatTooltip} from "@angular/material/tooltip";
import {MatFormField} from "@angular/material/input";
import {MatOption, MatSelect} from "@angular/material/select";


const iconList: string[] = [
  'logo',
  'x',
  'o',
  'back',
  'de',
  'en',
  'theme',
  'auto',
  'sun',
  'moon'
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    GameComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MatIcon,
    MatIconButton,
    MatMenu,
    MatMenuTrigger,
    MatTooltip,
    TranslatePipe,
    MatFormField,
    MatSelect,
    MatOption
  ],
  providers: [
    provideAnimationsAsync(),
    provideTranslateService({
      loader: provideTranslateHttpLoader({
        prefix: 'assets/i18n/',
        suffix: '.json'
      }),
      fallbackLang: 'en',
    }),
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializerFactory,
      deps: [TranslateService],
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

  constructor(matIconRegistry: MatIconRegistry, domSanitizer: DomSanitizer) {
    iconList.forEach(icon => {
      matIconRegistry.addSvgIcon(icon, domSanitizer.bypassSecurityTrustResourceUrl(`assets/icons/${icon}.svg`));
    });
    document.getElementById('splash-screen').classList.add('splash-screen-hidden');
  }
}

export function appInitializerFactory(translate: TranslateService) {
  return () => {
    const lang = localStorage.getItem('lang') || 'en';
    localStorage.setItem('lang', lang);
    document.documentElement.lang = lang;
    return translate.use(lang);
  };
}
