import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WelcomeLoginPage } from './welcome-login.page';

const routes: Routes = [
  {
    path: '',
    component: WelcomeLoginPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WelcomeLoginPageRoutingModule {}
