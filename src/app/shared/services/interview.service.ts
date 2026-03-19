import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../scripts/environments/environment';
import { GeneralI } from '../interfaces/general.interface';
import { ProductI } from '../interfaces/product.interface';

@Injectable({
  providedIn: 'root',
})
export class InterviewService {

  private readonly apiUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  consultProduct() {
    return this.http.get<GeneralI<ProductI>>(
      `${this.apiUrl}/bp/products`, {
        headers: {
          'Cache-Control': 'no-cache',
        },
      }
    );
  }

  registryProduct(body: ProductI){
    return this.http.post(`${this.apiUrl}/bp/products`, body);
  }

  updateProduct(id: string, body: ProductI){
    return this.http.put(`${this.apiUrl}/bp/products/${id}`, body);
  }

  deleteProduct(id: string){
    return this.http.delete(`${this.apiUrl}/bp/products/${id}`);
  }
}