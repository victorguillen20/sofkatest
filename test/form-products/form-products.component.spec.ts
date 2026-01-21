import { waitForAsync, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormProductsComponent } from '../../src/app/modules/customer/components/form-products/form-products.component';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { InterviewService } from '../../src/app/shared/services/interview.service';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { SharedInputComponent } from '../../src/app/shared/components/shared-input/shared-input.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CommonModule } from '@angular/common';

describe('FormProductsComponent', () => {
  let component: FormProductsComponent;
  let fixture: ComponentFixture<FormProductsComponent>;
  let mockInterviewService: any;

  beforeEach(waitForAsync(() => {
    mockInterviewService = {
      registryProduct: jest.fn().mockReturnValue(of({})),
      updateProduct: jest.fn().mockReturnValue(of({})),
      validateProductId: jest.fn().mockReturnValue(of(false))
    };

    TestBed.configureTestingModule({
      imports: [ 
        FormProductsComponent, 
        ReactiveFormsModule, 
        SharedInputComponent, 
        HttpClientTestingModule,
        CommonModule
      ],
      providers: [
        { provide: InterviewService, useValue: mockInterviewService }
      ]
    }).compileComponents();
  }));

  beforeEach(fakeAsync(() => {
    fixture = TestBed.createComponent(FormProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    tick(1000); // Para manejar el setTimeout en ngOnInit
    fixture.detectChanges();
  }));

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('El botón reiniciar debe resetear el formulario', () => {
    component.productDataForm.patchValue({
      id: 'testId',
      name: 'Test Name Longer',
      description: 'Test Description is long enough',
      logo: 'testLogo.png',
      date_release: '12/12/2026',
    });
    fixture.detectChanges();
    expect(component.productDataForm.get('id')?.value).toBe('testId');

    const resetButton = fixture.debugElement.query(By.css('button[type="reset"]'));
    resetButton.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(component.productDataForm.get('id')?.value).toBeNull();
  });

  test('El botón Reenviar debe llamar a registryProduct en modo creación', fakeAsync(() => {
    component.isUpdateMode = false;
    component.productDataForm.patchValue({
      id: 'trj-prb',
      name: 'Test Product',
      description: 'Test Description is long enough',
      logo: 'testlogo.png',
      date_release: '12/12/2026'
    });
    
    component.productDataForm.get('date_revision')?.setValue('12/12/2027');
    component.productDataForm.get('date_revision')?.enable(); 
    fixture.detectChanges();

    component.onSubmit();
    tick(1200);
    fixture.detectChanges();

    expect(mockInterviewService.registryProduct).toHaveBeenCalled();
    
    tick(5000); // Limpiar alertMsg
    fixture.detectChanges();
  }));

  test('El botón Reenviar debe llamar a updateProduct en modo actualización', fakeAsync(() => {
    component.isUpdateMode = true;
    component.productDataForm.patchValue({
      id: 'trj-prb',
      name: 'Test Product Updated',
      description: 'Test Description is long enough',
      logo: 'testlogo_updated.png',
      date_release: '12/12/2026'
    });
    
    component.productDataForm.get('date_revision')?.setValue('12/12/2027');
    component.productDataForm.get('date_revision')?.enable(); 
    fixture.detectChanges();

    component.onSubmit();
    tick(1200);
    fixture.detectChanges();

    expect(mockInterviewService.updateProduct).toHaveBeenCalled();

    tick(5000); // Limpiar alertMsg
    fixture.detectChanges();
  }));
});
