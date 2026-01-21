import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormProductsComponent } from './components/form-products/form-products.component';
import { TableProductsComponent } from './components/table-products/table-products.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SharedInputComponent } from '../../shared/components/shared-input/shared-input.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule, 
    HttpClientModule,
    SharedInputComponent,
    FormProductsComponent,
    TableProductsComponent
  ],
  declarations: [
  ],
  exports: [
    FormProductsComponent,
    TableProductsComponent,
    HttpClientModule 
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class CustomerModule { }
