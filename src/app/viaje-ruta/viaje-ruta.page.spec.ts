import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViajeRutaPage } from './viaje-ruta.page';

describe('ViajeRutaPage', () => {
  let component: ViajeRutaPage;
  let fixture: ComponentFixture<ViajeRutaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ViajeRutaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
