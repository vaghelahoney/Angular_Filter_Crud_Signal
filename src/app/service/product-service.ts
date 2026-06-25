import { inject, Injectable } from '@angular/core';
import { ProductModel } from '../model/product.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = 'https://localhost:7075/api/Employee';

  private http = inject(HttpClient);

  getProductModels(): Observable<ProductModel[]> {
    return this.http.get<ProductModel[]>(this.apiUrl);
  }

  createProductModel(ProductModel: ProductModel): Observable<ProductModel> {
    return this.http.post<ProductModel>(this.apiUrl, ProductModel);
  }

  updateProductModel(ProductModel: ProductModel): Observable<ProductModel> {
    return this.http.put<ProductModel>(this.apiUrl, ProductModel);
  }

  deleteProductModel(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getProductModel(id: number): Observable<ProductModel> {
    return this.http.get<ProductModel>(`${this.apiUrl}/${id}`);
  }

  GetProductCode(productCode: string, id: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/CheckCode/${productCode}/${id}`);
  }


}
