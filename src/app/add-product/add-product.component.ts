import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {Product} from "../shared/product.model";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ProductService} from "../shared/product.service";

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {

  formValue!: FormGroup;
  productModelObj: Product = new Product();
  private dateDelimiter: string = "/";
  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private productService: ProductService) {
  }

  ngOnInit(): void {
    this.formValue = this.formBuilder.group({
      productName: [''],
      productFee: [0],
      currency: [''],
      expireDate: ['']
    })
  }

  //ddmmyyy to 2021-09-06T00:00:00
  dateConversationToDate(data: string) {
    let dateParts = data.split(this.dateDelimiter);
    const year = dateParts[2];
    const month = dateParts[1];
    const day = dateParts[0];
    let date = new Date();
    date.setFullYear(Number(year));
    date.setMonth(Number(month) - 1);
    date.setDate(Number(day));
    //return new Date(Number(year),Number(month)-1,Number(day)+1)
    return date;
  }

  postProductDetails() {
    this.productModelObj.productName = this.formValue.value.productName;
    this.productModelObj.productFee = this.formValue.value.productFee;
    this.productModelObj.currencyName = this.formValue.value.currency;
    this.productModelObj.productExpireDate = this.dateConversationToDate(this.formValue.value.expireDate);
    //new Date(Date.now());
    //new Date(Date.parse(this.formValue.value.expireDate));
    this.productService.postProduct(this.productModelObj)
      .subscribe(res => {
          alert("Ürün Başarıyla Eklendi");
          let ref = document.getElementById('cancel');
          ref?.click();
          this.formValue.reset();
        },
        (error: any) => {
          alert("Birşeyler Ters Gitti!");
          document.location.reload(true);

        })
  }

}
