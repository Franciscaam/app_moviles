import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ForgetPassPage } from './forgetpass.page';

const routes: Routes = [
  {
    path: '',
    component: ForgetPassPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ForgetpassPageRoutingModule {}
