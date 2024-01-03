import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApexContractualService } from '../_services/apex-contractual.service';

@Component({
  selector: 'app-product-master',
  templateUrl: './product-master.component.html',
  styleUrls: ['./product-master.component.css'],
})
export class ProductMasterComponent implements OnInit {
  @ViewChild('editProd', { static: false }) editProds: ElementRef;

  success = false;
  products = [];
  finalData = [];
  fg: FormGroup;
  fEdit: FormGroup;
  editProductForm = false;
  editSuccess = false;
  deleteSuccess = false;

  constructor(
    private contService: ApexContractualService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.products = [];
    this.getproducts();
    this.fg = this.fb.group({
      productName: ['', Validators.required],
      definition: [''],
      size: [''],
    });
    this.fEdit = this.fb.group({
      productId: [''],
      productName: [''],
      definition: [''],
    });
  }

  addNewProduct() {
    const productName = this.fg.get('productName').value;
    const definition = this.fg.get('definition').value;
    const size = this.fg.get('size').value;
    this.contService
      .addNewProduct(productName, size, definition)
      .then((res) => {
        this.success = true;
      });
  }

  preEditProduct(productId, productName, oldDef) {
    this.fEdit = this.fb.group({
      productId: productId,
      productName: productName,
      definition: oldDef,
    });
      this.editProductForm = true;
     // this.editProds.nativeElement.focus();
  }

  editProduct() {
    const productId = this.fEdit.get('productId').value;
    const productName = this.fEdit.get('productName').value;
    const definition = this.fEdit.get('definition').value;
    this.contService
      .editProduct(productId, productName, definition)
      .then((arg) => {
        this.editSuccess = true;
        this.editProductForm = false;
      });
  }

  deleteProduct(productId) {
    var result = confirm('Sure to delete?');
    if (result) {
      //Logic to delete the item
      this.contService.deleteProduct(productId).then((arg) => {
        this.deleteSuccess = true;
      });
    }
  }

  getproducts() {
    this.products = [];
    this.contService.getProducts().subscribe((arg) => {
      arg.forEach((res) => {
        this.products.push(
          {
            data: res.payload.doc.data(),
            docId: res.payload.doc.id
          })
      });
    });
  }
}
