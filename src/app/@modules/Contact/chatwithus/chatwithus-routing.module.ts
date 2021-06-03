import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChatwithusPage } from './chatwithus.page';

const routes: Routes = [
  {
    path: '',
    component: ChatwithusPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChatwithusPageRoutingModule {}
