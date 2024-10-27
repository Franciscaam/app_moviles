import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ViajesService {
  private viajesCollection = this.firestore.collection('viajes');
  viajeActual: any;

  constructor(private firestore: AngularFirestore) {}

  solicitarViaje(pasajeroId: string, pasajeroNombre: string, comunaOrigen: string, comunaDestino: string, precio: number): Promise<void> {
    const viaje = {
      pasajeroId,
      pasajeroNombre,
      origen: comunaOrigen,
      destino: comunaDestino,
      precio: precio,
      estado: 'pendiente',
      fechaSolicitud: new Date(),
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

  obtenerViajes(): Observable<any[]> {
    return this.firestore
      .collection('viajes', (ref) => ref.where('estado', '==', 'pendiente'))
      .valueChanges({ idField: 'id' });
  }
  

  aceptarViaje(viajeId: string): Promise<void> {
    return this.viajesCollection.doc(viajeId).update({ estado: 'aceptado' })
      .then(() => {
        return this.viajesCollection.doc(viajeId).get().toPromise().then((doc) => {
          if (doc && doc.exists) {
            this.viajeActual = doc.data();
            this.viajeActual.id = doc.id;
          } else {
            throw new Error('Documento no encontrado');
          }
        });
      });
  }

  finalizarViaje() {
    if (this.viajeActual) {
      this.viajesCollection.doc(this.viajeActual.id).update({ estado: 'finalizado' });
      this.viajeActual = null;
    }
  }
}
