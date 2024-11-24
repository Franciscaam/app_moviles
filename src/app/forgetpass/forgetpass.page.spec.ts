import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ForgetPassPage } from './forgetpass.page';

describe('ForgetpassPage', () => {
  let component: ForgetPassPage;
  let fixture: ComponentFixture<ForgetPassPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgetPassPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
