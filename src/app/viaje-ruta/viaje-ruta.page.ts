import { Component, inject } from '@angular/core';
import { ViajesService } from '../viajes.service';  
import { ToastController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-viaje-ruta',
  templateUrl: './viaje-ruta.page.html',
  styleUrls: ['./viaje-ruta.page.scss'],
})
export class ViajeRutaPage {
  pasajeroNombre: string = '';  
  gananciaConductor: number = 0;  
  map: google.maps.Map | null = null;
  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer();

  viajesService = inject(ViajesService);  
  toastController = inject(ToastController);  
  navController = inject(NavController);

  constructor() {}

  ionViewWillEnter() {
    const viajeAceptado = this.viajesService.viajeActual;  
    if (viajeAceptado) {
      this.pasajeroNombre = viajeAceptado.pasajeroNombre;
      this.gananciaConductor = viajeAceptado.precio;
      this.mostrarToast('Has aceptado el viaje');
      this.loadMap();
    }
  }

  loadMap() {
    const mapOptions = {
      center: { lat: -33.4372, lng: -70.6506 },
      zoom: 12,
    };

    this.map = new google.maps.Map(document.getElementById('map') as HTMLElement, mapOptions);
    this.directionsRenderer.setMap(this.map);

    const origenCoords = this.viajesService.viajeActual.origen;
    const destinoCoords = this.viajesService.viajeActual.destino;

    this.mostrarRuta(origenCoords, destinoCoords);
  }

  mostrarRuta(origen: { lat: number; lng: number }, destino: { lat: number; lng: number }) {
    if (this.map) {
      const request = {
        origin: origen,
        destination: destino,
        travelMode: google.maps.TravelMode.DRIVING,
      };

      this.directionsService.route(request, (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          this.directionsRenderer.setDirections(result);
        } else {
          this.mostrarToast('No se pudo calcular la ruta', 'danger');
        }
      });
    }
  }

  async mostrarToast(message: string, color: string = 'primary') {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      position: 'top',
      color,
    });
    await toast.present();
  }

  volver() {
    this.navController.back(); // Navega hacia la página anterior
  }

  finalizarViaje() {
    const viajeId = this.viajesService.viajeActual.id; // Obtener el ID del viaje
    this.viajesService.finalizarViaje();  
    this.navController.navigateRoot('/conductor');  // Navegar de vuelta a la página del conductor
  }
}
