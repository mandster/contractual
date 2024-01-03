import { formatDate, SlicePipe } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Entry } from '../_model/entry';
import { ApexContractualService } from '../_services/apex-contractual.service';

export interface Element {
  quantity: any;
  definition: any;
  productId: any;
  employeeId: any;
  dateAdded: any;
}

@Component({
  selector: 'app-entries',
  templateUrl: './entries.component.html',
  styleUrls: ['./entries.component.css'],
})
export class EntriesComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSort) matSort!: MatSort;

  success = false;
  entries = [];
  finalEnteries = [];
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
  loading = false;




  constructor(
    private contService: ApexContractualService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    if (this.dataSource) {
      console.log('touched');
      this.dataSource.sort = this.matSort;
    }
    this.employees = [];
    this.getEmployees();
    this.getProducts();
    const format = 'dd/MM/yyyy';
    const myDate = Date.now();
    var today = new Date();
    var yesterday = new Date(today.getTime() - (24*60*60*1000));
    const locale = 'en-US';
    const formattedDate = formatDate(yesterday, format, locale);
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
      productId: ['0'],
      employeeId: ['0'],
      dateAdded: formattedDate ,
    });
  }

  getEntries(month?, year?) {
    this.entries = [];
    this.finalEnteries = [];
    this.contService.getEntriesGet().subscribe((arg) => {
      arg.forEach((res) => {
        this.finalEnteries.push(res.data());
      });
      this.createFinalData();
    });
  }


  createFinalData(month?, year?) {
    this.finalDatas = [];
    this.finalEnteries.forEach((arg) => {
      if (arg.dateAdded) {
      const monthAdded = arg.dateAdded.substring(3, 5);
      const yearAdded = arg.dateAdded.substring(8, 10);
      this.dateMonthFromDB = monthAdded + '/' + yearAdded;
      this.dateMonthRequired = this.selectedMonth + '/' + this.selectedYear;
      // console.log(this.dateMonthFromDB + ',' + this.dateMonthRequired);
      this.quantity = arg.quantity;
      this.dateAddedFromDB = arg.dateAdded;

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
        this.finalDatas.push({
          productName: this.productName,
          employeeName: this.employeeName,
          quantity: this.quantity,
          dateAdded: this.dateAddedFromDB,
          productId: this.productId,
          employeeId: this.employeeId,
        });
      }}
    });
    this.dataSource = null;
    this.dataSource = new MatTableDataSource<Entry>(this.finalDatas);
    this.dataSource.sort = this.matSort;
    console.log(this.dataSource);
  }

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
    this.loading = true;
    const quantity = this.fg.get('quantity').value;
    const definition = this.fg.get('definition').value;
    const productId = this.fg.get('productId').value;
    const employeeId = this.fg.get('employeeId').value;
    const dateAdded = this.fg.get('dateAdded').value;
    this.contService
      .addNewEntry(quantity, productId, employeeId, dateAdded, definition)
      .then((res) => {
        this.success = true;
        this.fg.disable();
        this.entries = [];
        this.loading = false;
      });
  }

  addNew() {
    this.success = false;
    this.fg.enable();
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
      console.log('touched');
      this.dataSource.sort = this.matSort;
    }
  }
}
