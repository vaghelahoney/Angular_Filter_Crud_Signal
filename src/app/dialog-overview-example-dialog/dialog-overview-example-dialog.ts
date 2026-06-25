import { Component, inject, OnInit, Signal, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,

} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ProductModel } from '../model/product.model';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { ProductService } from '../service/product-service';

export interface Country {
  id: number;
  name: string;
}

export interface State {
  id: number;
  name: string;
  countryId: number;
}

export interface City {
  id: number;
  name: string;
  stateId: number;
}

@Component({
  selector: 'app-dialog-overview-example-dialog',
  standalone: true,
  imports: [ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogContent,
    MatDialogActions,
    MatSelectModule, MatCheckboxModule, MatSlideToggleModule, MatDatepickerModule],
  providers: [provideNativeDateAdapter()],
  templateUrl: './dialog-overview-example-dialog.html',
  styleUrl: './dialog-overview-example-dialog.css',
})
export class DialogOverviewExampleDialog implements OnInit {

selectCountry(id: any) {
   const filteredStates = this.allStates.filter(s => s.countryId === id);
    this.stateList.set(filteredStates);
}

  selectState(id: number) {
     const filteredStates = this.allCities.filter(s => s.stateId === id);
    this.cityList.set(filteredStates);
  }

  allCountries: Country[] = [
    { id: 1, name: 'India' },
    { id: 2, name: 'USA' }
  ];

  allStates: State[] = [
    { id: 1, name: 'Gujarat', countryId: 1 }, // India
    { id: 2, name: 'Maharashtra', countryId: 1 }, // India
    { id: 3, name: 'New York', countryId: 2 } // USA
  ];

  allCities: City[] = [
    { id: 1, name: 'Radhanpur', stateId: 1 }, // Gujarat
    { id: 2, name: 'Ahmedabad', stateId: 1 }, // Gujarat
    { id: 3, name: 'Mumbai', stateId: 2 }, // Maharashtra
    { id: 4, name: 'Albany', stateId: 3 } // New York
  ];

  countryList = signal<Country[]>(this.allCountries);
  stateList = signal<State[]>([]);
  cityList = signal<City[]>([]);

  private ProductService = inject(ProductService);
  private fb = inject(FormBuilder);

  readonly dialogRef = inject(MatDialogRef<DialogOverviewExampleDialog>);
  public receivedData: ProductModel = inject(MAT_DIALOG_DATA);



  userForm = this.fb.group({
    id: [0],
    productName: ['', [Validators.required, Validators.minLength(3)]],
    productCode: ['', [Validators.required, Validators.minLength(3)]],
    price: [0, [Validators.required, Validators.min(0)]],
    stockQuantity: [0, [Validators.required, Validators.min(0)]],
    category: ['', [Validators.required]],
    availableForDelivery: [false],
    isActive: [true],
    country: [''],
    state: [''],
    city: [''],
    releaseDate: [new Date(), [Validators.required]],
  });

  ngOnInit(): void {
    this.userForm;
    if (this.receivedData) {
      this.userForm.patchValue(this.receivedData);
    }
  }

  get f() {
    return this.userForm.controls;
  }

  public saveClick() {
    debugger
    if (!this.userForm.valid) {
      this.userForm.markAllAsTouched();
      alert('Please fill in all required fields correctly.');
      return;
    }

    const formData = this.userForm.value as ProductModel;

    this.ProductService.GetProductCode(formData.productCode, formData.id).subscribe({
      next: (isDuplicate: boolean) => {
        if (isDuplicate) {
          this.userForm.controls.productCode.setErrors({ 'exists': true });
          this.userForm.markAllAsTouched();
          return
        }
        if (formData.id === 0) {
          this.ProductService.createProductModel(formData).subscribe({
            next: (data) => {
              console.log('Product model created:', data);
              this.dialogRef.close(true);
            },
            error: (err) => {
              console.error('Failed to fetch product models', err);
            }
          });
        } else {
          this.ProductService.updateProductModel(formData).subscribe({
            next: (data) => {
              this.dialogRef.close(true);
              console.log('Product model updated:', data);
            },
            error: (err) => {
              console.error('Failed to fetch product models', err);
            }
          });
        }
      },
      error: (err) => {
        console.error('Failed to fetch product models', err);
      }
    });
  }

  public onNoClick(): void {
    this.dialogRef.close(false);
  }
}
