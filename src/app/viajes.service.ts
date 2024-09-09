import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ViajesService {
  private viajesCollection = this.firestore.collection('viajes');

  constructor(private firestore: AngularFirestore) {}

  solicitarViaje(pasajeroId: string, comunaOrigen: string, comunaDestino: string): Promise<void> {
    const viaje = {
      pasajeroId,
      origen: comunaOrigen,
      destino: comunaDestino,
      estado: 'pendiente',
      fechaSolicitud: new Date()
    };

    return this.viajesCollection
      .add(viaje)
      .then(() => {
        console.log('Viaje solicitado exitosamente');
      })
      .catch((error) => {
        console.error('Error al solicitar el viaje:', error);
        throw new Error('Error al solicitar el viaje');
      });
  }

  obtenerHistorialViajes(pasajeroId: string): Observable<any[]> {
    return this.firestore
      .collection('viajes', (ref) =>
        ref
          .where('pasajeroId', '==', pasajeroId)
          .orderBy('fechaSolicitud', 'desc')
      )
      .valueChanges({ idField: 'id' });
  }

  obtenerViajesPorComuna(comunaSeleccionada: string): Observable<any[]> {
    return this.firestore
      .collection('viajes', (ref) =>
        ref
          .where('origen', '==', comunaSeleccionada)
          .where('estado', '==', 'pendiente')
      )
      .valueChanges({ idField: 'id' });
  }

  aceptarViaje(viajeId: string): Promise<void> {
    return this.viajesCollection.doc(viajeId).update({ estado: 'aceptado' });
  }
}
