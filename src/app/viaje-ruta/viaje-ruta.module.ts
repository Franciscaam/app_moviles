import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViajeRutaPageRoutingModule } from './viaje-ruta-routing.module';

import { ViajeRutaPage } from './viaje-ruta.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViajeRutaPageRoutingModule
  ],
  declarations: [ViajeRutaPage]
})
export class ViajeRutaPageModule {}
