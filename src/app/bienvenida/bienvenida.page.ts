import { Component, inject } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-bienvenida',
  templateUrl: './bienvenida.page.html',
  styleUrls: ['./bienvenida.page.scss'],
})
export class BienvenidaPage {

  navController = inject(NavController);

  volver() {
    this.navController.back();
  }

  irAConductor() {
    this.navController.navigateForward('/conductor');
  }

  irAPasajero() {
    this.navController.navigateForward('/pasajero');
  }

  irAPerfil() {
    this.navController.navigateForward('/perfil'); // Redirige a la página de perfil
  }
}
