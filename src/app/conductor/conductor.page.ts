import { Component, inject, OnInit } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import { ViajesService } from '../viajes.service';

@Component({
  selector: 'app-conductor',
  templateUrl: './conductor.page.html',
  styleUrls: ['./conductor.page.scss'],
})
export class ConductorPage implements OnInit {
  viajesPendientes: any[] = [];

  navController = inject(NavController);
  viajesService = inject(ViajesService);
  toastController = inject(ToastController);

  constructor() {}

  ngOnInit() {
    this.cargarViajesPendientes(); 
  }

  cargarViajesPendientes() {
    this.viajesService.obtenerViajes().subscribe(async (viajes: any[]) => {
      console.log('Viajes cargados:', viajes);
      const viajesConDirecciones = await Promise.all(
        viajes.map(async (viaje) => {
          const origenDireccion = viaje.origen
            ? await this.viajesService.obtenerDireccion(viaje.origen.lat, viaje.origen.lng)
            : 'Desconocido';
  
          const destinoDireccion = viaje.destino
            ? await this.viajesService.obtenerDireccion(viaje.destino.lat, viaje.destino.lng)
            : 'Desconocido';
  
          return {
            ...viaje,
            origen: origenDireccion,
            destino: destinoDireccion,
            pasajeroNombre: viaje.pasajeroNombre || 'Desconocido',
            precio: viaje.precio || 0,
          };
        })
      );
  
      this.viajesPendientes = viajesConDirecciones;
    });
  }
  

  aceptarViaje(viajeId: string) {
    this.viajesService.aceptarViaje(viajeId).then(() => {
      this.showToast('Viaje aceptado. Redirigiendo a la ruta...', 'success');
      this.navController.navigateForward('/viaje-ruta'); 
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

  volver() {
    this.navController.back();
  }

  irAInicio() {
    this.navController.navigateRoot('/bienvenida'); 
  }
}
