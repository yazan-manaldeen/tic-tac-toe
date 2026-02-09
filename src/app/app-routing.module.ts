import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from "@app/pages/home/home.component";
import {GameComponent} from "@app/pages/game/game.component";

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    title: 'Tic-Tac-Toe'
  },
  {
    path: 'game',
    component: GameComponent,
    title: 'Game - Tic-Tac-Toe'
  },

  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
