import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarCrudSimpleComponent } from './editar-crud-simple.component';

describe('EditarCrudSimpleComponent', () => {
  let component: EditarCrudSimpleComponent;
  let fixture: ComponentFixture<EditarCrudSimpleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditarCrudSimpleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarCrudSimpleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
