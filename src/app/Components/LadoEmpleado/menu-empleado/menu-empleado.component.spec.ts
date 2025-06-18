import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuEmpleadoComponent } from './menu-empleado.component';

describe('MenuEmpleadoComponent', () => {
  let component: MenuEmpleadoComponent;
  let fixture: ComponentFixture<MenuEmpleadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MenuEmpleadoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuEmpleadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
