import { Component, inject, OnInit } from '@angular/core';
import { ViajesService } from '../viajes.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { NavController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-pasajero',
  templateUrl: './pasajero.page.html',
  styleUrls: ['./pasajero.page.scss'],
})
export class PasajeroPage implements OnInit {
  comunaOrigen: string = '';
  comunaDestino: string = '';
  comunas = [
    'Cerrillos', 'La Reina', 'Pudahuel', 'Cerro Navia', 'Las Condes', 'Quilicura', 'Conchalí',
    'Lo Barnechea', 'Quinta Normal', 'El Bosque', 'Lo Espejo', 'Recoleta', 'Estación Central',
    'Lo Prado', 'Renca', 'Huechuraba', 'Macul', 'San Miguel', 'Independencia', 'Maipú', 'San Joaquín',
    'La Cisterna', 'Ñuñoa', 'San Ramón', 'La Florida', 'Pedro Aguirre Cerda', 'Santiago (Centro)',
    'La Pintana', 'Peñalolén', 'Vitacura', 'La Granja', 'Providencia', 'Colina', 'Peñaflor',
    'San Bernardo', 'Lampa', 'Pirque', 'San José de Maipo', 'Padre Hurtado', 'Puente Alto'
  ];

  historialViajes: any[] = [];
  pasajeroId: string | null = null;

  viajesService = inject(ViajesService);
  afAuth = inject(AngularFireAuth);
  navController = inject(NavController);
  loadingController = inject(LoadingController);

  ngOnInit() {
    this.afAuth.currentUser.then(user => {
      if (user) {
        this.pasajeroId = user.uid;
      } else {
        alert('No hay un usuario autenticado');
      }
    });
  }

  volver() {
    this.navController.back();
  }

  async solicitarViaje() {
    // Verifica si se seleccionaron ambas comunas y el pasajero está autenticado
    if (!this.comunaOrigen || !this.comunaDestino) {
      alert('Por favor selecciona ambas comunas.');
      return;
    }

    if (!this.pasajeroId) {
      alert('No estás autenticado. Inicia sesión para solicitar un viaje.');
      return;
    }

    // Si todo está correcto, muestra el loading y realiza la solicitud de viaje
    const loading = await this.loadingController.create({
      message: 'Solicitando viaje...',
      spinner: 'circles',
      duration: 3000
    });

    await loading.present();

    this.viajesService.solicitarViaje(this.pasajeroId, this.comunaOrigen, this.comunaDestino)
      .then(() => {
        loading.dismiss();
        alert('Viaje solicitado exitosamente');
        this.cargarHistorialViajes();
      })
      .catch((error) => {
        loading.dismiss();
        alert('Error al solicitar el viaje: ' + error.message);
      });
  }

  cargarHistorialViajes() {
    if (this.pasajeroId) {
      this.viajesService.obtenerHistorialViajes(this.pasajeroId).subscribe((viajes) => {
        this.historialViajes = viajes;
      }, error => {
        console.error('Error al cargar el historial de viajes:', error);
      });
    }
  }
}
