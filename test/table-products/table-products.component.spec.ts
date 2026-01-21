import { waitForAsync, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TableProductsComponent } from '../../src/app/modules/customer/components/table-products/table-products.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedInputComponent } from '../../src/app/shared/components/shared-input/shared-input.component';
import { HttpClientModule } from '@angular/common/http';
import { FormProductsComponent } from '../../src/app/modules/customer/components/form-products/form-products.component';

describe('TableProductsComponent', () => {
  let component: TableProductsComponent;
  let fixture: ComponentFixture<TableProductsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TableProductsComponent ],
      imports: [ FormsModule, ReactiveFormsModule, SharedInputComponent, HttpClientModule ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('Debe de mostrar el resultado filtrado basado en lo que ingreso en el input', fakeAsync(() => {
    component.products = [
      { id: 'dos', name: 'Mastercard', description: 'Tarjeta de crédito', logo: 'logo-1.png', date_release: new Date('2025-12-12'), date_revision: new Date('2026-12-12') },
      { id: 'tres', name: 'Diners Club', description: 'Tarjeta de crédito', logo: 'dinners.png', date_release: new Date('2025-02-20'), date_revision: new Date('2026-02-20') },
      { id: 'cuatro', name: 'Discover', description: 'Tarjeta de crédito/débito', logo: 'discover.png', date_release: new Date('2025-03-21'), date_revision: new Date('2025-03-21') }
    ];
    fixture.detectChanges();
    
    const inputDebugEl = fixture.debugElement.query(By.css('input[placeholder="Search..."]'));
    const inputEl: HTMLInputElement = inputDebugEl.nativeElement;
    
    inputEl.value = 'Diners Club';
    inputEl.dispatchEvent(new Event('input'));
    tick();
    fixture.detectChanges();

    expect(component.filteredProducts.length).toBe(1);
    expect(component.filteredProducts[0].name).toBe('Diners Club');

    const rows = fixture.debugElement.queryAll(By.css('tbody tr'));
    expect(rows.length).toBe(1);
  }));
});

describe('TableProductsComponent - Navigation', () => {
  let component: TableProductsComponent;
  let fixture: ComponentFixture<TableProductsComponent>;
  let router: Router;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TableProductsComponent ],
      imports: [ FormsModule, ReactiveFormsModule, RouterTestingModule.withRoutes([
        { path: 'form', component: FormProductsComponent }
      ]), SharedInputComponent, HttpClientModule ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableProductsComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    jest.spyOn(router, 'navigate');
    fixture.detectChanges();
  });

  test('El botón Agregar debe de redirigir hasta el formulario', fakeAsync(() => {
    const buttonDebugEl = fixture.debugElement.query(By.css('button.btn.secondary'));
    buttonDebugEl.triggerEventHandler('click', null);
    tick();
    expect(router.navigate).toHaveBeenCalledWith(['/form']);
  }));
});

describe('TableProductsComponent - Delete Button', () => {
  let component: TableProductsComponent;
  let fixture: ComponentFixture<TableProductsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TableProductsComponent ],
      imports: [ FormsModule, ReactiveFormsModule, SharedInputComponent, HttpClientModule ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('El botón "Eliminar" debe ejecutar openDeleteModal() pasando el producto como parámetro', fakeAsync(() => {
    const sampleProduct = {
      id: 'dos', 
      name: 'Mastercard', 
      description: 'Tarjeta de crédito', 
      logo: 'logo-1.png', 
      date_release: new Date('2025-12-12'), 
      date_revision: new Date('2026-12-12')
    };
    component.products = [ sampleProduct ];
    fixture.detectChanges();
    
    jest.spyOn(component, 'openDeleteModal');

    const deleteButtonDe = fixture.debugElement.query(By.css('.dropdown-content button:nth-child(2)'));
    deleteButtonDe.triggerEventHandler('click', null);
    tick();
    fixture.detectChanges();

    expect(component.openDeleteModal).toHaveBeenCalledWith(sampleProduct);
  }));
});

describe('TableProductsComponent - Update Button', () => {
  let component: TableProductsComponent;
  let fixture: ComponentFixture<TableProductsComponent>;
  let router: Router;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TableProductsComponent ],
      imports: [ FormsModule, ReactiveFormsModule, RouterTestingModule.withRoutes([
        { path: 'form', component: FormProductsComponent }
      ]), SharedInputComponent, HttpClientModule ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableProductsComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    jest.spyOn(router, 'navigate');
    fixture.detectChanges();
  });

  test('El botón "Actualizar" debe ejecutar editProduct() pasando el producto y redirigir a /form con state: product', fakeAsync(() => {
    const sampleProduct = {
      id: 'dos', 
      name: 'Mastercard', 
      description: 'Tarjeta de crédito', 
      logo: 'logo-1.png', 
      date_release: new Date('2025-12-12'), 
      date_revision: new Date('2026-12-12')
    };
    component.products = [ sampleProduct ];
    fixture.detectChanges();
    
    jest.spyOn(component, 'editProduct').mockImplementation(() => {
      router.navigate(['/form'], { state: sampleProduct });
    });

    const updateButtonDe = fixture.debugElement.query(By.css('.dropdown-content button:first-child'));
    updateButtonDe.triggerEventHandler('click', null);
    tick();
    fixture.detectChanges();

    expect(component.editProduct).toHaveBeenCalledWith(sampleProduct);
    expect(router.navigate).toHaveBeenCalledWith(['/form'], { state: sampleProduct });
  }));
});

describe('TableProductsComponent - Select Functionality', () => {
  let component: TableProductsComponent;
  let fixture: ComponentFixture<TableProductsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TableProductsComponent ],
      imports: [ FormsModule, ReactiveFormsModule, SharedInputComponent, HttpClientModule ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should update selectedOption and pagedProducts when select value changes', fakeAsync(() => {
    const sampleProducts = [];
    for (let i = 1; i <= 15; i++) {
      sampleProducts.push({
        id: '' + i,
        name: 'Product ' + i,
        description: 'Desc ' + i,
        logo: '',
        date_release: new Date(),
        date_revision: new Date()
      });
    }
    component.products = sampleProducts;
    component.searchQuery = '';
    component.selectedOption = 5;
    fixture.detectChanges();

    expect(component.pagedProducts.length).toBe(5);

    const selectDebugEl = fixture.debugElement.query(By.css('select.page-selector'));
    const selectEl: HTMLSelectElement = selectDebugEl.nativeElement;
    
    selectEl.value = '10';
    selectEl.dispatchEvent(new Event('change'));
    tick();
    fixture.detectChanges();

    expect(component.selectedOption).toBe(10);
    expect(component.pagedProducts.length).toBe(10);

    selectEl.value = '20';
    selectEl.dispatchEvent(new Event('change'));
    tick();
    fixture.detectChanges();

    expect(component.selectedOption).toBe(20);
    expect(component.pagedProducts.length).toBe(15);
  }));
});