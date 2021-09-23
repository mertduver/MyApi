import {Component, OnInit} from '@angular/core';
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {FormBuilder, FormGroup} from "@angular/forms";
import {Product} from '../shared/product.model';
import {ProductService} from "src/app/shared/product.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  closeResult = '';
  formValue!: FormGroup;
  productModelObj: Product = new Product();
  productData!: any;
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
    this.getAllProducts();

  }

  open(content: any) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  getAllProducts() {
    this.productService.getProduct()
      .subscribe((res: any) => {
        this.productData = res;
      })
  }

  deleteProduct(row: any) {
    if (confirm("Silmek istediğinize emin misiniz? " + row.productName)) {
      this.productService.deleteProduct(row.id)
        .subscribe(res => {
          this.getAllProducts();
        })
      this.getAllProducts();
    }

  }

  odEdit(row: any) {
    this.productModelObj.productId = row.id;
    this.formValue.controls['productName'].setValue(row.productName);
    this.formValue.controls['productFee'].setValue(row.productFee);
    this.formValue.controls['currency'].setValue(row.currencyName);
    this.formValue.controls['expireDate'].setValue(this.dateConversationToDDMMYYYY(row.productExpireDate));
  }


  updateProductDetails() {
    this.productModelObj.productName = this.formValue.value.productName;
    this.productModelObj.productFee = this.formValue.value.productFee;
    this.productModelObj.currencyName = this.formValue.value.currency;
    this.productModelObj.productExpireDate = this.dateConversationToDate(this.formValue.value.expireDate);

    this.productService.updateProduct(this.productModelObj, this.productModelObj.productId)
      .subscribe(res => {
          alert("Güncelleme Başarılı")
          let ref = document.getElementById('cancel');
          ref?.click();
          this.formValue.reset();
          this.getAllProducts();
          document.location.reload(true);
        },
        (error: any) => {
          alert("Bir şeyler Ters Gitti!");
          document.location.reload(true);
        });
  }

  dateConversationToDDMMYYYY(date: Date) {
    let dateString = date.toString();
    // const [month, day, year]       = [date.getMonth(), date.getDate(), date.getFullYear()];
    const year = dateString.substr(0, 4)
    const month = dateString.substr(5, 2)
    const day = dateString.substr(8, 2)
    return day + this.dateDelimiter + month + this.dateDelimiter + year;
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

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

}
