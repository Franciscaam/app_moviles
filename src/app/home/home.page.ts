import { Component, inject } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import { LoginService } from '../login.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  usuario: string = '';
  pass: string = '';

  navController = inject(NavController);
  loginService = inject(LoginService);
  toastController = inject(ToastController);

  constructor() {}

  async ingresar() {
    try {
      const userCredential = await this.loginService.login(this.usuario, this.pass);
      if (userCredential) {
        this.navController.navigateForward('/bienvenida');
      }
    } catch (error) {
      const toast = await this.toastController.create({
        message: 'Credenciales incorrectas',
        duration: 3000,
        position: 'top',
        color: 'danger' // Mejora visual: Añadí un color de error para el toast
      });
      await toast.present();
    }
  }

  registrarse() {
    this.navController.navigateForward('/registro');
  }

  olvidoContrasena() {
    this.navController.navigateForward('/forgetpass');
  }
}
