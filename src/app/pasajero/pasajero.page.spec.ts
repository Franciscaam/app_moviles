import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { PasajeroPage } from './pasajero.page';
import { provideHttpClient } from '@angular/common/http';

// Mock de Google Maps
const googleMapsMock = {
  maps: {
    Map: jasmine.createSpy().and.returnValue({
      addListener: jasmine.createSpy(),
    }),
    Marker: jasmine.createSpy().and.returnValue({
      setMap: jasmine.createSpy(),
    }),
    DirectionsService: jasmine.createSpy(),
    DirectionsRenderer: jasmine.createSpy(),
    DirectionsStatus: { OK: 'OK' },
    TravelMode: { DRIVING: 'DRIVING' },
  },
};

describe('PasajeroPage', () => {
  let component: PasajeroPage;
  let fixture: ComponentFixture<PasajeroPage>;

  beforeEach(async () => {
    // Inyectar el mock de Google Maps en el contexto global
    (window as any).google = googleMapsMock;

    await TestBed.configureTestingModule({
      declarations: [PasajeroPage],
      imports: [IonicModule.forRoot()],
      providers: [provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(PasajeroPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate a price within the valid range', () => {
    const MIN_PRICE = 5000;
    const MAX_PRICE = 15000;

    for (let i = 0; i < 100; i++) {
      const price = component.calcularPrecio();
      expect(price).toBeGreaterThanOrEqual(MIN_PRICE);
      expect(price).toBeLessThanOrEqual(MAX_PRICE);
    }
  });

  it('should load the map and add a click listener', () => {
    component.loadMap();
    expect((window as any).google.maps.Map).toHaveBeenCalled();
    expect((window as any).google.maps.Map().addListener).toHaveBeenCalledWith('click', jasmine.any(Function));
  });
});
