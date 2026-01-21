import { Routes } from '@angular/router';
import { FormProductsComponent } from './modules/customer/components/form-products/form-products.component';
import { TableProductsComponent } from './modules/customer/components/table-products/table-products.component';

export const routes: Routes = [
    {
        path: 'list',
        component: TableProductsComponent
    },
    {
        path: 'form',
        component: FormProductsComponent
    },
    {
        path: '**',
        redirectTo: 'list'
    },
];