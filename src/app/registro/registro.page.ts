import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { LoginService } from '../login.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage {
  email: string = '';
  password: string = '';
  confirmPassword: string = '';

  constructor(private navCtroller: NavController, private loginSrv: LoginService) {}

  async registrarse() {
    if (this.password !== this.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    try {
      await this.loginSrv.register(this.email, this.password);
      alert('Registro exitoso');
      this.navCtroller.navigateForward('/bienvenida');
    } catch (error) {
      alert('Error en el registro, intenta nuevamente.');
    }
  }
}
