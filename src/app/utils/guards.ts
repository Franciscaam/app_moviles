import { inject } from "@angular/core";
import { LoginService } from "../login.service";  
import { NavController } from "@ionic/angular";

export const authGuard = async () => {
    const login = inject(LoginService);
    const nav = inject(NavController);

    await login.firebaseCargado;  
    if (!login.logeado) {
        nav.navigateRoot('/', { replaceUrl: true });  
    }
    return login.logeado;  
};

export const guestGuard = async () => {
    const login = inject(LoginService);
    const nav = inject(NavController);

    await login.firebaseCargado;  
    if (login.logeado) {
        nav.navigateRoot('/bienvenida', { replaceUrl: true });  
    }
    return !login.logeado;  
};
