import { Component, computed, inject, model, OnInit, signal, ViewChild } from '@angular/core';
import { ProductModel } from '../../model/product.model';
import { ProductService } from '../../service/product-service';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDialog } from '@angular/material/dialog';
import { DialogOverviewExampleDialog } from '../../dialog-overview-example-dialog/dialog-overview-example-dialog';

@Component({
  selector: 'app-product-componets',
  imports: [MatFormFieldModule, MatInputModule, MatSelectModule, MatSlideToggleModule],
  templateUrl: './product-componets.html',
  styleUrl: './product-componets.css',
})
export class ProductComponets implements OnInit {

  private ProductService = inject(ProductService);
  readonly name = model('');
  readonly dialog = inject(MatDialog);

  searchTerm = signal<string>('');
  users = signal<ProductModel[]>([]);
  searchCategory = signal<string>('');
  searchActive = signal<boolean>(true);
  

  public deleteClick(id: number) {
    this.ProductService.deleteProductModel(id).subscribe({
      next: (data) => {
        this.users.update((data) => data.filter(user => user.id !== id));
      },
      error: (err) => {
        console.error('Failed to fetch product models', err);
      }
    });
  }

  public editClick(user: ProductModel) {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      data: user
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.loadPosts();
      }
    });
  }

  public openDialog(): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      data: { name: this.name() },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.loadPosts();
      }
    });
  }

  ngOnInit(): void {
    this.loadPosts();
  }

  filteredUsers = computed(() => {
    const query = this.searchTerm().toLowerCase();
    const category = this.searchCategory().toLowerCase();
    const isActive = this.searchActive();

    return this.users().filter(user => {
      const matchesName = user.productName.toLowerCase().includes(query);
      const matchesCode = user.productCode.toLowerCase().includes(query);
      const matchesCategory = user.category.toLowerCase().includes(category);
      const matchesStatus = user.isActive == isActive;
      return (matchesName || matchesCode) && matchesCategory && matchesStatus;
    });
  });

  public loadPosts(): void {
    this.ProductService.getProductModels().subscribe({
      next: (data) => {
        this.users.set(data);
      },
      error: (err) => {
        console.error('Failed to fetch product models', err);
      }
    });
  }
}
