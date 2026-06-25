import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductComponets } from './product-componets';

describe('ProductComponets', () => {
  let component: ProductComponets;
  let fixture: ComponentFixture<ProductComponets>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductComponets]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductComponets);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
