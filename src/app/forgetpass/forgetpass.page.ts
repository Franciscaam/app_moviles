import { Component, inject } from '@angular/core';
import { ToastController, NavController } from '@ionic/angular';
import { LoginService } from '../login.service';

@Component({
  selector: 'app-forgetpass',
  templateUrl: './forgetpass.page.html',
  styleUrls: ['./forgetpass.page.scss'],
})
export class ForgetPassPage {

  email: string = '';

  toastController = inject(ToastController);
  loginService = inject(LoginService);
  navController = inject(NavController);

  constructor() {}

  async enviarCorreo(form: any) {
    if (form.valid) {
      try {
        await this.loginService.resetPassword(this.email);
        const toast = await this.toastController.create({
          message: 'Correo de restablecimiento enviado',
          duration: 3000,
          position: 'top',
          color: 'success' 
        });
        await toast.present();
        this.navController.back();
      } catch (error) {
        this.mostrarError('Error al enviar el correo');
      }
    } else {
      this.mostrarError('Por favor ingresa un correo válido');
    }
  }

  async mostrarError(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 3000,
      position: 'top',
      color: 'danger'
    });
    await toast.present();
  }
}
