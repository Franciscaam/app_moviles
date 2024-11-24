import { Component, inject, OnInit } from '@angular/core';
import { ViajesService } from '../viajes.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { NavController, LoadingController, ToastController } from '@ionic/angular';
/// <reference types="@types/google.maps" />

@Component({
  selector: 'app-pasajero',
  templateUrl: './pasajero.page.html',
  styleUrls: ['./pasajero.page.scss'],
})
export class PasajeroPage implements OnInit {
  comunaOrigen: string = '';
  comunaDestino: string = '';
  map: google.maps.Map | null = null;
  markerInicio: google.maps.Marker | null = null;
  markerDestino: google.maps.Marker | null = null;
  seleccionandoDestino = false;
  historialViajes: any[] = [];
  pasajeroId: string | null = null;

  viajesService = inject(ViajesService);
  afAuth = inject(AngularFireAuth);
  navController = inject(NavController);
  loadingController = inject(LoadingController);
  toastController = inject(ToastController);

  ngOnInit() {
    this.afAuth.currentUser.then(user => {
      if (user) {
        this.pasajeroId = user.uid;
        this.cargarHistorialViajes(); 
      }
    });
    this.loadMap();
  }

  loadMap() {
    const mapOptions = {
      center: { lat: -33.4372, lng: -70.6506 },
      zoom: 12,
    };

    this.map = new google.maps.Map(document.getElementById('map') as HTMLElement, mapOptions);

    this.map.addListener('click', (event: google.maps.MapMouseEvent) => {
      this.handleMapClick(event);
    });
  }

  handleMapClick(event: google.maps.MapMouseEvent) {
    if (!event.latLng) return;

    const position = event.latLng;

    if (!this.seleccionandoDestino) {
      if (this.markerInicio) this.markerInicio.setMap(null);
      this.markerInicio = new google.maps.Marker({
        position: position,
        map: this.map,
        label: 'Inicio',
      });
      this.showToast('Punto de inicio seleccionado');
      this.seleccionandoDestino = true;
    } else {
      
      if (this.markerDestino) this.markerDestino.setMap(null);
      this.markerDestino = new google.maps.Marker({
        position: position,
        map: this.map,
        label: 'Destino',
      });
      this.showToast('Punto de destino seleccionado');
      this.seleccionandoDestino = false;
    }
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

  async solicitarViaje() {
    if (!this.pasajeroId) {
      this.showToast('No estás autenticado. Inicia sesión para solicitar un viaje.', 'danger');
      return;
    }
  
    if (!this.markerInicio || !this.markerDestino) {
      this.showToast('Por favor selecciona el inicio y el destino en el mapa.', 'danger');
      return;
    }
  
    const origenCoords = this.markerInicio.getPosition();
    const destinoCoords = this.markerDestino.getPosition();
  
    if (!origenCoords || !destinoCoords) {
      this.showToast('Coordenadas no válidas para el viaje.', 'danger');
      return;
    }
  
    const loading = await this.loadingController.create({
      message: 'Solicitando viaje...',
      spinner: 'circles',
      duration: 3000
    });
  
    await loading.present();
  
    const pasajeroNombre = 'Nombre del Pasajero'; 
    const precio = this.calcularPrecio();
  
    // Convierte las coordenadas a objetos { lat, lng }
    const origen = { lat: origenCoords.lat(), lng: origenCoords.lng() };
    const destino = { lat: destinoCoords.lat(), lng: destinoCoords.lng() };
  
    this.viajesService.solicitarViaje(
      this.pasajeroId,
      pasajeroNombre,
      origen,
      destino,
      precio
    )
    .then(() => {
      loading.dismiss();
      this.showToast(`Viaje solicitado exitosamente. El costo del viaje será de $${precio}`, 'success');
      this.cargarHistorialViajes();
    })
    .catch((error) => {
      loading.dismiss();
      this.showToast('Error al solicitar el viaje: ' + error.message, 'danger');
    });
  }
  
  cargarHistorialViajes() {
    if (this.pasajeroId) {
      this.viajesService.obtenerHistorialViajes(this.pasajeroId).subscribe((viajes) => {
        this.historialViajes = viajes.map(viaje => ({
          ...viaje,
          fechaSolicitud: viaje.fechaSolicitud.toDate(),
        }));
      }, error => {
        console.error('Error al cargar el historial de viajes:', error);
      });
    }
  }

  calcularPrecio(): number {
    return Math.floor(Math.random() * 10000) + 5000;
  }
}
