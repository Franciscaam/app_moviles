import { Component } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
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
  nombre: string = ''; // Declaración de propiedad faltante
  apellido: string = ''; // Declaración de propiedad faltante
  phone: string = '';
  rut: string = '';

  constructor(
    private navCtrl: NavController,
    private loginSrv: LoginService,
    private toastCtrl: ToastController
  ) {}

  async registrarse() {
    if (
      !this.email ||
      !this.password ||
      !this.confirmPassword ||
      !this.nombre || // Validación de campo faltante
      !this.apellido || // Validación de campo faltante
      !this.phone ||
      !this.rut
    ) {
      this.presentToast('Por favor, completa todos los campos.', 'danger');
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.presentToast('Las contraseñas no coinciden.', 'danger');
      return;
    }

    if (!this.validateEmail(this.email)) {
      this.presentToast('Por favor, ingresa un correo electrónico válido.', 'danger');
      return;
    }

    if (!this.validateRUT(this.rut)) {
      this.presentToast('Por favor, ingresa un RUT válido.', 'danger');
      return;
    }

    try {
      await this.loginSrv.register(this.email, this.password);
      this.presentToast('Registro exitoso.', 'success');
      this.navCtrl.navigateForward('/bienvenida');
    } catch (error) {
      this.presentToast('Error en el registro, intenta nuevamente.', 'danger');
    }
  }

  validateEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  validateRUT(rut: string): boolean {
    const cleanRut = rut.replace(/[.\-]/g, '');
    if (cleanRut.length < 8 || cleanRut.length > 9) return false;

    const body = cleanRut.slice(0, -1);
    const dv = cleanRut.slice(-1).toUpperCase();

    let sum = 0;
    let multiplier = 2;

    for (let i = body.length - 1; i >= 0; i--) {
      sum += parseInt(body[i]) * multiplier;
      multiplier = multiplier === 7 ? 2 : multiplier + 1;
    }

    const calculatedDV = 11 - (sum % 11);
    const expectedDV = calculatedDV === 10 ? 'K' : calculatedDV === 11 ? '0' : calculatedDV.toString();

    return dv === expectedDV;
  }

  async presentToast(message: string, color: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      color,
      position: 'top',
    });
    toast.present();
  }

  volverInicio() {
    this.navCtrl.navigateRoot('/home');
  }
}
