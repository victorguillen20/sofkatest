import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormProductsComponent } from '../../src/app/modules/customer/components/form-products/form-products.component';
import { ReactiveFormsModule } from '@angular/forms';
import { InterviewService } from '../../src/app/shared/services/interview.service';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { SharedInputComponent } from '../../src/app/shared/components/shared-input/shared-input.component';
import { HttpClientModule } from '@angular/common/http';

describe('FormProductsComponent', () => {
  let component: FormProductsComponent;
  let fixture: ComponentFixture<FormProductsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FormProductsComponent ],
      imports: [ ReactiveFormsModule, SharedInputComponent, HttpClientModule ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('El botón reiniciar debe resetear el formulario', () => {
    component.productDataForm.patchValue({
      id: 'testId',
      name: 'Test Name',
      description: 'Test Description',
      logo: 'testLogo.png',
      date_release: '12/12/2020',
    });
    fixture.detectChanges();
    expect(component.productDataForm.get('id')?.value).toBe('testId');

    const resetButton = fixture.debugElement.query(By.css('button[type="reset"]'));
    resetButton.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(component.productDataForm.get('id')?.value).toBeNull();
    expect(component.productDataForm.get('name')?.value).toBeNull();
    expect(component.productDataForm.get('description')?.value).toBeNull();
    expect(component.productDataForm.get('logo')?.value).toBeNull();
    expect(component.productDataForm.get('date_release')?.value).toBeNull();
    expect(component.productDataForm.get('date_revision')?.disabled).toBe(true);
  });
});

describe('FormProductsComponent - Submit Button', () => {
  let component: FormProductsComponent;
  let fixture: ComponentFixture<FormProductsComponent>;
  let serviceSpy: jest.Mocked<InterviewService>;

  beforeEach(waitForAsync(() => {
    const spy = {
      registryProduct: jest.fn(),
      updateProduct: jest.fn()
    };
    TestBed.configureTestingModule({
      declarations: [ FormProductsComponent ],
      imports: [ ReactiveFormsModule ],
      providers: [{ provide: InterviewService, useValue: spy }]
    }).compileComponents();
    serviceSpy = TestBed.inject(InterviewService) as jest.Mocked<InterviewService>;
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormProductsComponent);
    component = fixture.componentInstance;
    // Set create mode by default
    component.isUpdateMode = false;
    fixture.detectChanges();
  });

  test('El botón Reenviar debe llamar a registryProduct y establecer el mensaje de alerta "Producto Registrado" en modo creación', () => {
    component.productDataForm.patchValue({
      id: 'trj-prb',
      name: 'Test Product',
      description: 'Test Description',
      logo: 'testlogo.png',
      date_release: '12/12/2026'
    });
    serviceSpy.registryProduct.mockReturnValue(of({}));
    component.onSubmit();
    expect(serviceSpy.registryProduct).toHaveBeenCalled();
    expect(component.alertMessage).toBe('Producto Registrado');
  });
});

describe('FormProductsComponent - Submit Button Update Mode', () => {
  let component: FormProductsComponent;
  let fixture: ComponentFixture<FormProductsComponent>;
  let serviceSpy: jest.Mocked<InterviewService>;

  beforeEach(waitForAsync(() => {
    const spy = {
      registryProduct: jest.fn(),
      updateProduct: jest.fn()
    };
    TestBed.configureTestingModule({
      declarations: [ FormProductsComponent ],
      imports: [ ReactiveFormsModule ],
      providers: [{ provide: InterviewService, useValue: spy }]
    }).compileComponents();
    serviceSpy = TestBed.inject(InterviewService) as jest.Mocked<InterviewService>;
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormProductsComponent);
    component = fixture.componentInstance;
    component.isUpdateMode = true;
    fixture.detectChanges();
  });

  test('El botón Reenviar debe llamar a updateProduct y establecer el mensaje de alerta "Producto actualizado" en modo actualización', () => {
    component.productDataForm.patchValue({
      id: 'trj-prb',
      name: 'Test Product Updated',
      description: 'Test Description Updated',
      logo: 'testlogo_updated.png',
      date_release: '12/12/2026'
    });
  
    serviceSpy.updateProduct.mockReturnValue(of({}));
    component.onSubmit();
  
    expect(serviceSpy.updateProduct).toHaveBeenCalledWith('trj-prb', expect.any(Object));
    expect(component.alertMessage).toBe('Producto actualizado');
  });
});