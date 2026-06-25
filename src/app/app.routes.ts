import { Routes } from '@angular/router';
import { ProductComponets } from './product/product-componets/product-componets';

export const routes: Routes = [
   { path: '', redirectTo: '/home', pathMatch: 'full' }, 
  { path: 'home', component: ProductComponets },
  { path: '**', component: ProductComponets }
];
