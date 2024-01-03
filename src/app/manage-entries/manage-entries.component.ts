import { formatDate } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ApexContractualService } from '../_services/apex-contractual.service';

@Component({
  selector: 'app-manage-entries',
  templateUrl: './manage-entries.component.html',
  styleUrls: ['./manage-entries.component.css']
})
export class ManageEntriesComponent implements OnInit {
  @ViewChild(MatSort) sort!: MatSort;

  success = false;
  entries = [];
  finalEnteries=[];
  products = [];
  productsFromDB = [];
  employeesFromDB = [];
  employees = [];
  finalDatas = [];
  test = [];
  quantity;
  employeeId: string;
  productId: string;
  fg: FormGroup;
  selectedMonth;
  selectedYear;
  productName;
  employeeName;
  dateAddedFromDB;
  dateMonthFromDB;
  dateMonthRequired;
  displayedColumns: string[] = [
    'dateAdded',
    'employeeName',
    'productName',
    'quantity',
  ];
  dataSource: MatTableDataSource<any>;
  preDataSource = [];

  constructor(
    private contService: ApexContractualService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.employees = [];
    this.getEmployees();
    this.getProducts();
    const format = 'dd/MM/yyyy';
    const myDate = Date.now();
    const locale = 'en-US';
    const formattedDate = formatDate(myDate, format, locale);
    this.selectedMonth = (new Date().getMonth() + 1).toString();
    if (this.selectedMonth.length > 1) {
      this.selectedMonth = this.selectedMonth.substring(1, 3);
      console.log(this.selectedMonth);
    } else {
      this.selectedMonth = ('0' + (new Date().getMonth() + 1)).toString();
    }
    this.selectedYear = new Date().getFullYear().toString();
    this.selectedYear = this.selectedYear.substring(2, 4);
    this.getEntries(this.selectedMonth, this.selectedYear);
    this.fg = this.fb.group({
      quantity: ['', [Validators.required, Validators.pattern('[0-9]+')]],
      definition: [''],
      productId: [''],
      employeeId: [''],
      dateAdded: formattedDate,
    });
  }

  getEntries(month?, year?) {
    this.entries = [];
   // this.finalEnteries = [];
    this.contService.getEntries().subscribe((arg) => {
      arg.forEach((res) => {

        this.finalEnteries.push(res);
      });
    });
     this.createFinalData(month, year);

  }


   createFinalData(month?, year?) {
    console.log('dsa');
    console.log(this.finalEnteries);
    this.finalEnteries.forEach((arg) => {
    console.log(this.finalEnteries);
      const monthAdded = arg.dateAdded.substring(3, 5);
      const yearAdded = arg.dateAdded.substring(8, 10);
      this.dateMonthFromDB = monthAdded + '/' + yearAdded;
      this.dateMonthRequired = month + '/' + year;
      console.log(this.dateMonthFromDB + ',' + this.dateMonthRequired);

      this.quantity = arg.quantity;
      this.dateAddedFromDB = arg.dateAdded;
      console.log(arg.payload.doc.data());
      if (this.dateMonthFromDB == this.dateMonthRequired) {
        this.products.forEach((product) => {
          if (product.docId == arg.productId) {
            this.productName = product.data.productName;
            this.productId = product.docId;
          }
        });
        this.employees.forEach((emp) => {
          if (emp.docId == arg.employeeId) {
            this.employeeName = emp.data.employeeName;
            this.employeeId = emp.docId;
          }
        });
        console.log(this.productName);
        this.finalDatas.push({
          productName: this.productName,
          employeeName: this.employeeName,
          quantity: this.quantity,
          dateAdded: this.dateAddedFromDB,
          productId: this.productId,
          employeeId: this.employeeId,
        });
      }
    });

    console.log(this.finalDatas);
  }

  // async getEntries(month?, year?) {
  //   this.entries = [];
  //   this.finalEnteries = [];
  //   this.contService.getEntries().subscribe((arg) => {
  //     arg.forEach((res) => {
  //       res.forEach(data => {
  //         this.preDataSource.push(data.payload.doc.data());
  //       })
  //     });
  //   });
  //   this.createFinalData(month, year);
  // }

  // async createFinalData(month?, year?) {
  //   console.log(this.preDataSource);
  //   this.finalDatas = [];
  //   this.preDataSource.forEach((arg) => {
  //     const monthAdded = arg.dateAdded.substring(3, 5);
  //     const yearAdded = arg.dateAdded.substring(8, 10);
  //     this.dateMonthFromDB = monthAdded + '/' + yearAdded;
  //     this.dateMonthRequired = month + '/' + year;
  //     console.log(this.dateMonthFromDB + ',' + this.dateMonthRequired);
  //     this.quantity = arg.quantity;
  //     this.dateAddedFromDB = arg.dateAdded;
  //     console.log(arg);
  //     if (this.dateMonthFromDB == this.dateMonthRequired) {
  //       this.products.forEach((product) => {
  //         if (product.docId == arg.productId) {
  //           this.productName = product.data.productName;
  //           this.productId = product.docId;
  //         }
  //       });
  //       this.employees.forEach((emp) => {
  //         if (emp.docId == arg.employeeId) {
  //           this.employeeName = emp.data.employeeName;
  //           this.employeeId = emp.docId;
  //         }
  //       });
  //       this.finalDatas.push({
  //         productName: this.productName,
  //         employeeName: this.employeeName,
  //         quantity: this.quantity,
  //         dateAdded: this.dateAddedFromDB,
  //         productId: this.productId,
  //         employeeId: this.employeeId,
  //       });
  //     }
  //   });
  //   console.log(this.finalDatas);

  //   let dataFetch = [];
  //   this.finalEnteries = new MatTableDataSource(this.finalDatas);
  //   this.finalEnteries.sort = this.sort;
  //   this.dataSource = this.finalEnteries
  //   console.log(this.finalDatas);
  // }

  changeMonth(event) {
    this.selectedMonth = event;
    this.getEntries(this.selectedMonth, this.selectedYear);
  }

  changeYear(event) {
    this.selectedYear = event;
    this.getEntries(this.selectedMonth, this.selectedYear);
  }

  getProducts() {
    this.products = [];
    this.contService.getProducts().subscribe((res) => {
      res.forEach((arg) => {
        this.products.push({
          data: arg.payload.doc.data(),
          docId: arg.payload.doc.id,
        });
      });
    });
  }

  getEmployees() {
    this.employees = [];
    this.contService.getEmployees().subscribe((res) => {
      res.forEach((arg) => {
        this.employees.push({
          data: arg.payload.doc.data(),
          docId: arg.payload.doc.id,
        });
      });
    });
  }

  addNewEntry() {
    const quantity = this.fg.get('quantity').value;
    const definition = this.fg.get('definition').value;
    const productId = this.fg.get('productId').value;
    const employeeId = this.fg.get('employeeId').value;
    const dateAdded = this.fg.get('dateAdded').value;
    this.contService
      .addNewEntry(quantity, productId, employeeId, dateAdded, definition)
      .then((res) => {
        this.success = true;
        this.entries = [];
      });
  }

  getEmployee(empId) {
    this.employees.forEach((arg) => {
      if (arg.docId == empId) {
        this.employeeName = arg.data.employeeName;
      }
    });
  }

  async getProduct(prodId) {
    this.products.forEach((arg) => {
      if (arg.docId == prodId) {
        this.productName = arg.data.productName;
      }
    });
  }

  ngAfterViewInit() {
    if (this.dataSource) {
      this.dataSource.sort = this.sort;
    }
  }
}

