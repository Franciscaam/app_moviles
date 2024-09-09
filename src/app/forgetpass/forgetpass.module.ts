import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ForgetpassPageRoutingModule } from './forgetpass-routing.module';
import { ForgetPassPage } from './forgetpass.page'; // Asegúrate de usar ForgetPassPage

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ForgetpassPageRoutingModule
  ],
  declarations: [ForgetPassPage]  // Declarar ForgetPassPage
})
export class ForgetpassPageModule {}
