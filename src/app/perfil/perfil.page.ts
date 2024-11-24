import { Component } from '@angular/core';
import { LoginService } from '../login.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage {

  usuarioEmail: string = '';

  constructor(private loginService: LoginService, private navCtrl: NavController) {
    this.usuarioEmail = this.loginService.nombreUsuario; }

  cerrarSesion() {
    this.loginService.logout().then(() => {
      this.navCtrl.navigateRoot('/login'); 
    });
  }

  cambiarContrasena() {
    this.navCtrl.navigateForward('/restablecer'); 

  }
  volverInicio() {
    this.navCtrl.navigateBack('/home');
  }
}
