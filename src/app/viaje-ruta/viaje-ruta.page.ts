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

  ionViewWillEnter() {
    const viajeAceptado = this.viajesService.viajeActual;  

    if (viajeAceptado) {
      this.pasajeroNombre = viajeAceptado.pasajeroNombre || 'Pasajero';
      this.gananciaConductor = viajeAceptado.precio || 0;
      this.mostrarToast('Has aceptado el viaje', 'success');
      this.loadMap(); // Asegúrate de cargar el mapa
    } else {
      this.mostrarToast('No hay un viaje activo', 'danger');
      this.navController.navigateRoot('/conductor'); // Navegar al inicio del conductor
    }
  }

  loadMap() {
    const mapOptions = {
      center: { lat: -33.4372, lng: -70.6506 }, // Coordenadas por defecto
      zoom: 12,
    };

    this.map = new google.maps.Map(document.getElementById('map') as HTMLElement, mapOptions);
    this.directionsRenderer.setMap(this.map);

    const origenCoords = this.viajesService.viajeActual?.origen;
    const destinoCoords = this.viajesService.viajeActual?.destino;

    if (origenCoords && destinoCoords) {
      this.mostrarRuta(origenCoords, destinoCoords);
    } else {
      this.mostrarToast('Coordenadas del viaje no disponibles', 'danger');
    }
  }

  mostrarRuta(origen: { lat: number; lng: number }, destino: { lat: number; lng: number }) {
    if (!this.map) {
      this.mostrarToast('El mapa no está cargado.', 'danger');
      return;
    }

    const request = {
      origin: origen,
      destination: destino,
      travelMode: google.maps.TravelMode.DRIVING, // Modo de viaje: Conducción
    };

    this.directionsService.route(request, (result, status) => {
      if (status === google.maps.DirectionsStatus.OK) {
        this.directionsRenderer.setDirections(result); // Dibujar la ruta en el mapa
        this.mostrarToast('Ruta calculada correctamente', 'success');
      } else {
        this.mostrarToast('No se pudo calcular la ruta', 'danger');
      }
    });
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
    this.navController.navigateRoot('/conductor');
  }

  async finalizarViaje() {
    const loading = await this.toastController.create({
      message: 'Finalizando viaje...',
      duration: 2000,
      color: 'primary',
    });

    await loading.present();

    try {
      await this.viajesService.finalizarViaje();  
      this.mostrarToast('El viaje ha sido finalizado con éxito.', 'success');
      this.navController.navigateRoot('/conductor');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      this.mostrarToast('Error al finalizar el viaje: ' + errorMessage, 'danger');
    } finally {
      loading.dismiss();
    }
  }
}
