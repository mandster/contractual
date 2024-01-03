import { formatDate } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Entry } from '../_model/entry';
import { ApexContractualService } from '../_services/apex-contractual.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent implements OnInit {
  @ViewChild(MatSort) matSort!: MatSort;

  thisYear;
  thisMonth;
  fg: FormGroup;
  success = false;
  entries = [];
  finalEnteries = [];
  products = [];
  productsFromDB = [];
  employeesFromDB = [];
  employees = [];
  finalData = [];
  quantity;
  deleted = false;
  employeeId: string;
  productId: string;
  selectedMonth;
  selectedYear;
  productName;
  employeeName;
  dateAddedFromDB;
  dateMonthFromDB;
  dataSource: MatTableDataSource<any>;
  dateMonthRequired;
  fEdit: FormGroup;
  editEntryForm= false;
  editSuccess= false;
  displayedColumns: string[] = [
    'dateAdded',
    'employeeName',
    'productName',
    'quantity',
    'definition',
    'actions',
  ];

  constructor(
    private contService: ApexContractualService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    if (this.dataSource) {
      console.log('touched');
      this.dataSource.sort = this.matSort;
    }
    this.getEmployees();
    this.getProducts();
    var today = new Date();
    const format = 'dd/MM/yyyy';
    const myDate = Date.now();
    const locale = 'en-US';
    this.thisMonth = (today.getMonth() + 1).toString();
    if (this.thisMonth.length > 1) {
      this.thisMonth = this.thisMonth.substring(1, 3);
    } else {
      this.thisMonth = ('0' + (new Date().getMonth() + 1)).toString();
    }
    this.thisYear = today.getFullYear().toString();
    this.thisYear = this.thisYear.substring(2,4)
    console.log(this.thisMonth + "/" + this.thisYear)
    const formattedDate = formatDate(myDate, format, locale);
    this.fg = this.fb.group({
      employeeId: ['0'],
      monthRequired: this.thisMonth,
      yearRequired: this.thisYear,
      dateAdded: formattedDate,
    });
  }

  deleteEntry(entryId) {
    var result = confirm('Sure to delete?');
    if (result) {
      //Logic to delete the item
      this.contService.deleteEntry(entryId).then(arg => {
        this.deleted = true;
      })
      console.log(entryId);
    }
  }

  preEditEntry(entryId, productName, productId, employeeName, employeeId, definition, quantity, dateAdded) {
    this.fEdit = this.fb.group({
      productId: productId,
      productName: productName,
      entryId: entryId,
      employeeName: employeeName,
      employeeId: employeeId,
      definition: definition,
      quantity: quantity,
      dateAdded: dateAdded,
    });
    this.editEntryForm = true;
  }

  editEntry() {
    const productId = this.fEdit.get('productId').value;
    const entryId = this.fEdit.get('entryId').value;
    const employeeId = this.fEdit.get('employeeId').value;
    const definition = this.fEdit.get('definition').value;
    const quantity = this.fEdit.get('quantity').value;
    const dateAdded = this.fEdit.get('dateAdded').value;
    this.contService.editEntry(entryId, productId, employeeId,definition,quantity, dateAdded).then((arg) => {
      this.editSuccess = true;
    });
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

  async getEntries() {
    const month = this.fg.get('monthRequired').value;
    const year = this.fg.get('yearRequired').value;
    const employeeId = this.fg.get('employeeId').value;
    this.entries = [];
    this.finalEnteries = [];
    this.contService.getEntries().subscribe((arg) => {
      arg.forEach((res) => {
        this.finalEnteries.push({
          data: res.payload.doc.data(),
          docId: res.payload.doc.id,
        });
      });
      this.createFinalData(month, year, employeeId);
    });
  }

  async createFinalData(month, year, employeeId) {
    this.finalData = [];
    this.finalEnteries.forEach((arg) => {
      const monthAdded = arg.data.dateAdded.substring(3, 5);
      const yearAdded = arg.data.dateAdded.substring(8, 10);
      this.dateMonthFromDB = monthAdded + '/' + yearAdded;
      this.dateMonthRequired = month + '/' + year;
      // console.log(this.dateMonthFromDB + ',' + this.dateMonthRequired);
      this.quantity = arg.data.quantity;
      this.dateAddedFromDB = arg.data.dateAdded;
      //  console.log(arg.data.employeeId + '/' + employeeId);
      if (this.dateMonthFromDB == this.dateMonthRequired) {
        if (arg.data.employeeId == employeeId) {
          this.products.forEach((product) => {
            if (product.docId == arg.data.productId) {
              this.productName = product.data.productName;
              this.productId = product.docId;
            }
          });
          this.employees.forEach((emp) => {
            if (emp.docId == arg.data.employeeId) {
              this.employeeName = emp.data.employeeName;
              this.employeeId = emp.docId;
            }
          });
          this.finalData.push({
            productName: this.productName,
            employeeName: this.employeeName,
            quantity: this.quantity,
            dateAdded: this.dateAddedFromDB,
            productId: this.productId,
            employeeId: this.employeeId,
            docId: arg.docId,
            definition: arg.data.definition
          });
        }
      }
    });
    this.dataSource = null;
    this.dataSource = new MatTableDataSource<Entry>(this.finalData);
    this.dataSource.sort = this.matSort;
    this.success = true;
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


}
