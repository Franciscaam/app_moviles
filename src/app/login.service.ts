import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  nombreUsuario = '';

  constructor(private afAuth: AngularFireAuth) {}

  login(email: string, password: string) {
    return this.afAuth.signInWithEmailAndPassword(email, password)
      .then(userCredential => {
        this.nombreUsuario = userCredential.user?.email || '';
        return userCredential;
      })
      .catch(error => {
        alert('Error al iniciar sesión: ' + error.message);
      });
  }

  register(email: string, password: string) {
    return this.afAuth.createUserWithEmailAndPassword(email, password)
      .then(userCredential => {
        this.nombreUsuario = userCredential.user?.email || '';
        alert('Registro exitoso');
        return userCredential;
      })
      .catch(error => {
        alert('Error al registrar: ' + error.message);
      });
  }

  resetPassword(email: string) {
    return this.afAuth.sendPasswordResetEmail(email)
      .then(() => {
        alert('Se ha enviado un correo para restablecer la contraseña');
      })
      .catch(error => {
        alert('Error al enviar el correo de restablecimiento: ' + error.message);
      });
  }

  logout() {
    return this.afAuth.signOut()
      .then(() => {
        this.nombreUsuario = '';
        alert('Sesión cerrada correctamente');
      })
      .catch(error => {
        alert('Error al cerrar sesión: ' + error.message);
      });
  }
}
