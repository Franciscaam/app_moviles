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
    this.viajesService.obtenerViajes().subscribe((viajes: any[]) => {
      console.log('Viajes cargados:', viajes);  
      this.viajesPendientes = viajes.map(viaje => ({
        ...viaje,
        origen: viaje.origen || 'Desconocido',
        destino: viaje.destino || 'Desconocido',
        pasajeroNombre: viaje.pasajeroNombre || 'Desconocido',
        precio: viaje.precio || 0
      }));
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
}
