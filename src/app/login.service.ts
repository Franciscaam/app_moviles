import { Injectable, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  nombreUsuario = '';
  logeado: boolean = false;  
  firebaseCargado: Promise<void>;  

  toastController = inject(ToastController);  

  constructor(private afAuth: AngularFireAuth) {
    this.firebaseCargado = this.inicializarFirebase();
  }

  async inicializarFirebase() {
    await this.afAuth.authState.subscribe(user => {
      this.logeado = !!user;  
      this.nombreUsuario = user?.email || '';  
    });
  }

  async showToast(message: string, color: string = 'primary') {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      position: 'top',
      color
    });
    await toast.present();
  }

  login(email: string, password: string) {
    return this.afAuth.signInWithEmailAndPassword(email, password)
      .then(userCredential => {
        this.logeado = true;  
        this.nombreUsuario = userCredential.user?.email || '';
        localStorage.setItem('userId', userCredential.user?.uid || '');  
        this.showToast('Inicio de sesión exitoso', 'success');  
        return userCredential;
      })
      .catch(error => {
        this.logeado = false;  
        this.showToast('Error al iniciar sesión: ' + error.message, 'danger');  
      });
  }

  register(email: string, password: string) {
    return this.afAuth.createUserWithEmailAndPassword(email, password)
      .then(userCredential => {
        this.logeado = true; 
        this.nombreUsuario = userCredential.user?.email || '';
        this.showToast('Registro exitoso', 'success');  
        return userCredential;
      })
      .catch(error => {
        this.logeado = false;  
        this.showToast('Error al registrar: ' + error.message, 'danger');  
      });
  }

  resetPassword(email: string) {
    return this.afAuth.sendPasswordResetEmail(email)
      .then(() => {
        this.showToast('Se ha enviado un correo para restablecer la contraseña', 'success'); 
      })
      .catch(error => {
        this.showToast('Error al enviar el correo de restablecimiento: ' + error.message, 'danger');  //
      });
  }

  logout() {
    return this.afAuth.signOut()
      .then(() => {
        this.logeado = false;  
        this.nombreUsuario = '';
        localStorage.removeItem('userId');  
        this.showToast('Sesión cerrada correctamente', 'success'); 
      })
      .catch(error => {
        this.showToast('Error al cerrar sesión: ' + error.message, 'danger');  
      });
  }
}
