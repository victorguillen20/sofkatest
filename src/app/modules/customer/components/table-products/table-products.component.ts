import { InterviewService } from './../../../../shared/services/interview.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductI } from '../../../../shared/interfaces/product.interface';
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'table-products',
  standalone: true, 
  imports: [CommonModule], 
  templateUrl: './table-products.component.html',
})
export class TableProductsComponent implements OnInit {
  
  products: ProductI[] = [];
  searchQuery: string = ''; 
  selectedOption: number = 5;  
  deleteModalVisible: boolean = false;
  productToDelete: ProductI | null = null;
  isLoading: boolean = false;

  alertMessage: string = '';
  alertType: 'success' | 'error' = 'success';

  constructor(
    private readonly router: Router,
    private readonly serviceProducts: InterviewService
  ) { }

  ngOnInit() {
    this.loadProducts(); 
  }

  loadProducts(): void {
    this.isLoading = true;
    this.serviceProducts.consultProduct().subscribe({
      next: (res: any) => {
        // Simulamos un delay mínimo para ver el skeleton
        setTimeout(() => {
          this.products = res.data;
          this.isLoading = false;
        }, 800);
      },
      error: (err) => {
        console.error('Error al cargar productos', err);
        this.isLoading = false;
      }
    });
  }

  get filteredProducts(): ProductI[] {
    if (!this.searchQuery) return this.products;
    const query = this.searchQuery.toLowerCase();
    return this.products.filter(product => {
      const releaseDate = product.date_release ? new Date(product.date_release).toLocaleDateString('en-GB') : '';
      const revisionDate = product.date_revision ? new Date(product.date_revision).toLocaleDateString('en-GB') : '';
      return product.name.toLowerCase().includes(query) ||
             product.description.toLowerCase().includes(query) ||
             releaseDate.toLowerCase().includes(query) ||
             revisionDate.toLowerCase().includes(query);
    });
  }

 
  get pagedProducts(): ProductI[] {
    return this.filteredProducts.slice(0, this.selectedOption);
  }

  // Método para generar array de skeleton loaders
  get skeletonRows(): any[] {
    return Array(this.selectedOption).fill(0);
  }

  navigateToForm(): void {
    this.router.navigate(['/form']);
  }

  editProduct(product: ProductI): void {
    this.router.navigate(['/form'], { state: product });
  }

  onSearchInput(event: Event): void {
    this.searchQuery = (event.target as HTMLInputElement).value;
  }

  updateSelectedOption(event: Event): void {
    this.selectedOption = Number((event.target as HTMLSelectElement).value);
  }

  openDeleteModal(product: ProductI): void {
    this.productToDelete = product;
    this.deleteModalVisible = true;
  }

  closeDeleteModal(): void {
    this.deleteModalVisible = false;
    this.productToDelete = null;
  }

  confirmDelete(): void {
    if (this.productToDelete && this.productToDelete.id) {
      this.serviceProducts.deleteProduct(this.productToDelete.id)
        .subscribe({
          next: (response) => {
            this.alertMsg('success', 'Producto eliminado');
            this.loadProducts();
          },
          error: (error) => {
            this.alertMsg('error', 'Error al eliminar producto');
          }
        });
    }
  }

  alertMsg(alertType: any, alertMessage: string): void {
    this.alertType = alertType;
    this.alertMessage = alertMessage;
    this.closeDeleteModal();
    setTimeout(() => (this.alertMessage = ''), 5000);
  }
}