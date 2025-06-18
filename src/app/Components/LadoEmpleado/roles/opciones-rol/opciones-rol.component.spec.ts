import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpcionesRolComponent } from './opciones-rol.component';

describe('OpcionesRolComponent', () => {
  let component: OpcionesRolComponent;
  let fixture: ComponentFixture<OpcionesRolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OpcionesRolComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpcionesRolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
