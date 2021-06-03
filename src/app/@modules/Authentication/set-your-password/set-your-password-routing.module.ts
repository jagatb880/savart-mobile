import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SetYourPasswordPage } from './set-your-password.page';

const routes: Routes = [
  {
    path: '',
    component: SetYourPasswordPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SetYourPasswordPageRoutingModule {}
