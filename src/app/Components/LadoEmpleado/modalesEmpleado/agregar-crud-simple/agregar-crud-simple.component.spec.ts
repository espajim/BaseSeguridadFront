import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarCrudSimpleComponent } from './agregar-crud-simple.component';

describe('AgregarCrudSimpleComponent', () => {
  let component: AgregarCrudSimpleComponent;
  let fixture: ComponentFixture<AgregarCrudSimpleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AgregarCrudSimpleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgregarCrudSimpleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
