import { Component, inject } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ViajesService } from '../viajes.service';

@Component({
  selector: 'app-conductor',
  templateUrl: './conductor.page.html',
  styleUrls: ['./conductor.page.scss'],
})
export class ConductorPage {
  comunaSeleccionada: string = '';
  comunas = [
    'Cerrillos', 'La Reina', 'Pudahuel', 'Cerro Navia', 'Las Condes', 'Quilicura', 'Conchalí',
    'Lo Barnechea', 'Quinta Normal', 'El Bosque', 'Lo Espejo', 'Recoleta', 'Estación Central',
    'Lo Prado', 'Renca', 'Huechuraba', 'Macul', 'San Miguel', 'Independencia', 'Maipú', 'San Joaquín',
    'La Cisterna', 'Ñuñoa', 'San Ramón', 'La Florida', 'Pedro Aguirre Cerda', 'Santiago (Centro)',
    'La Pintana', 'Peñalolén', 'Vitacura', 'La Granja', 'Providencia', 'Colina', 'Peñaflor',
    'San Bernardo', 'Lampa', 'Pirque', 'San José de Maipo', 'Padre Hurtado', 'Puente Alto'
  ];

  viajesPendientes: any[] = [];

  navController = inject(NavController);
  viajesService = inject(ViajesService);

  constructor() {}

  volver() {
    this.navController.back();
  }

  cargarViajesPendientes() {
    if (this.comunaSeleccionada) {
      this.viajesService.obtenerViajesPorComuna(this.comunaSeleccionada).subscribe((viajes) => {
        this.viajesPendientes = viajes;
      });
    } else {
      alert('Por favor selecciona una comuna.');
    }
  }

  aceptarViaje(viajeId: string) {
    this.viajesService.aceptarViaje(viajeId).then(() => {
      alert('Viaje aceptado exitosamente');
      this.cargarViajesPendientes();
    });
  }
}
