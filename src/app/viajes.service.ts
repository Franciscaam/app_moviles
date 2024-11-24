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

  // Solicitar viaje
  solicitarViaje(
    pasajeroId: string,
    pasajeroNombre: string,
    origen: { lat: number; lng: number },
    destino: { lat: number; lng: number },
    precio: number
  ): Promise<void> {
    const viaje = {
      pasajeroId,
      pasajeroNombre,
      origen, // Coordenadas {lat, lng}
      destino, // Coordenadas {lat, lng}
      precio,
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

  // Obtener historial de viajes
  obtenerHistorialViajes(pasajeroId: string): Observable<any[]> {
    return this.firestore
      .collection('viajes', (ref) =>
        ref.where('pasajeroId', '==', pasajeroId).orderBy('fechaSolicitud', 'desc')
      )
      .valueChanges({ idField: 'id' });
  }

  // Obtener viajes pendientes
  obtenerViajes(): Observable<any[]> {
    return this.firestore
      .collection('viajes', (ref) => ref.where('estado', '==', 'pendiente'))
      .valueChanges({ idField: 'id' });
  }

  // Aceptar un viaje
  aceptarViaje(viajeId: string): Promise<void> {
    return this.viajesCollection
      .doc(viajeId)
      .update({ estado: 'aceptado' })
      .then(() => {
        return this.viajesCollection
          .doc(viajeId)
          .get()
          .toPromise()
          .then((doc) => {
            if (doc && doc.exists) {
              this.viajeActual = doc.data();
              this.viajeActual.id = doc.id;
            } else {
              throw new Error('Documento no encontrado');
            }
          });
      });
  }
  obtenerDireccion(lat: number, lng: number): Promise<string> {
    return new Promise((resolve, reject) => {
      const geocoder = new google.maps.Geocoder();
      const latLng = { lat, lng };
  
      geocoder.geocode({ location: latLng }, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK) {
          if (results && results.length > 0) {
            resolve(results[0].formatted_address); // Dirección más relevante
          } else {
            resolve('Dirección no encontrada');
          }
        } else {
          reject('Error al obtener la dirección: ' + status);
        }
      });
    });
  }
  

  // Finalizar un viaje
  finalizarViaje(): Promise<void> {
    if (this.viajeActual) {
      return this.viajesCollection
        .doc(this.viajeActual.id)
        .update({ estado: 'finalizado' })
        .then(() => {
          this.viajeActual = null;
        });
    }
    return Promise.reject(new Error('No hay un viaje actual para finalizar'));
  }
}
