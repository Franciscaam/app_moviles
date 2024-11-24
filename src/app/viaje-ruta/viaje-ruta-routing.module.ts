import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViajeRutaPage } from './viaje-ruta.page';

const routes: Routes = [
  {
    path: '',
    component: ViajeRutaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViajeRutaPageRoutingModule {}
