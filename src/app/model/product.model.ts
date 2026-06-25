export class ProductModel {
    public id: number = 0;
    public productName: string = '';
    public category: string = '';
    public productCode: string = '';
    public price: number = 0;
    public stockQuantity: number = 0;
    public isActive: boolean = true;
    public availableForDelivery: boolean = false;
    public releaseDate: Date = new Date();
}

