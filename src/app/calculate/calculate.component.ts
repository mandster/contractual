import { formatDate } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TOOLTIP_PANEL_CLASS } from '@angular/material/tooltip';
import { EmployeeMasterComponent } from '../employee-master/employee-master.component';
import { Employee } from '../_model/employee';
import { Entry } from '../_model/entry';
import { Price } from '../_model/price';
import { Product } from '../_model/product';
import { ApexContractualService } from '../_services/apex-contractual.service';

@Component({
  selector: 'app-calculate',
  templateUrl: './calculate.component.html',
  styleUrls: ['./calculate.component.css'],
})
export class CalculateComponent implements OnInit {
  @ViewChild(MatSort) matSort!: MatSort;

  displayedColumns: string[] = [
    'date',
    'productName',
    'quantity',
    'rate',
    'rowTotal',
  ];
  priceCategory = [];
  success = false;
  entries = [];
  dataSource: MatTableDataSource<any>;
  employees = [];
  employeeId: any;
  sorted = [];
  fg: FormGroup;
  prices = [];
  finalEntries = [];
  thisMonth;
  thisYear;
  rate;
  productName = [];
  rowCalc;
  finalPrices = [];
  totalCalc = 0;
  product: Product;
  employee: Employee;
  entry: Entry;
  price: Price;
  dataAvailable = false;
  finalData = [];

  constructor(
    private contService: ApexContractualService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    if (this.dataSource) {
      this.dataSource.sort = this.matSort;
    }
    this.getEmployees();
    const format = 'dd/MM/yyyy';
    const myDate = Date.now();
    var today = new Date();
    const locale = 'en-US';
    const formattedDate = formatDate(today, format, locale);
    this.thisMonth = today.getMonth() + 1;
    this.thisYear = today.getFullYear().toString();
    //  this.thisYear = this.thisYear.substring(2,4);
    if (this.thisMonth.length > 1) {
      this.thisMonth = this.thisMonth.substring(1, 3);
    } else {
      this.thisMonth = ('0' + (new Date().getMonth() + 1)).toString();
    }
    this.fg = this.fb.group({
      selectedMonth: this.thisMonth,
      selectedYear: this.thisYear,
      employeeId: [''],
      consolidated: ['']
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

  async getPrices(empId?) {
    this.prices = [];
    this.finalPrices = [];
    this.contService.getPrices(empId).subscribe((arg) => {
      arg.forEach((res) => {
        this.finalPrices.push({
          data: res.payload.doc.data(),
          docId: res.payload.doc.id,
        });
      });
      this.createFinalData();
    });
  }

  getCollaborativeTotal() {

  }

  getEntries() {
    this.entries = [];
    this.finalEntries = [];
    this.finalData = [];
    this.totalCalc = 0;
    let dateFromDB;
    const isConsolidated = this.fg.get('consolidated').value;
    const selectedMonth = this.fg.get('selectedMonth').value;
    const selectedYear = this.fg.get('selectedYear').value;
    const selectedYearMonth = selectedMonth + '/' + selectedYear;
    const employeeId = this.fg.get('employeeId').value;
    this.contService.getEmployeePriceCat(employeeId).then((arg1) => {
      this.priceCategory.push(arg1.data().priceCategory);
      this.contService.getEntriesCalc(employeeId).subscribe((arg) => {
        arg.forEach((res) => {
          dateFromDB = res.data().dateAdded.substring(3,10)
          if (dateFromDB == selectedYearMonth)
          {
            this.finalEntries.push(res.data());
          }
        });
      });
      if (isConsolidated)
      {
        this.createConsolidatedArray(this.finalEntries, arg1.data().priceCategory);
      } else {
        this.createArray(this.finalEntries, arg1.data().priceCategory);
      }
    });
  }

  createConsolidatedArray(entriesArray, priceCategory) {
    let that = this;
    let reqPrice;
    setTimeout(function () {
      entriesArray.forEach((entry) => {
        that.contService.getProductById(entry.productId).then((prod) => {
          that.contService
            .getPriceByCat(entry.productId, priceCategory)
            .subscribe((arg) => {
              arg.forEach((price) => {
                if (priceCategory == 1) {
                  reqPrice = price.data().price;
                }
                if (priceCategory == 2) {
                  reqPrice = price.data().price2;
                }
               // if () {}
            const rowTotal = entry.quantity * reqPrice
                that.totalCalc = that.totalCalc + rowTotal;
                that.finalData.push({
                  productName: prod.data().productName,
                  quantity: entry.quantity,
                  date: entry.dateAdded,
                  rate: reqPrice,
                  rowTotal: rowTotal,
                  totalCalc: that.totalCalc
                });
              });
            });
        });
      });
    }, 500);
    this.dataAvailable = true;
    this.dataSource = null;
    this.dataSource = new MatTableDataSource(this.finalData);
    this.dataSource.sort = this.matSort;
  }

  createArray(entriesArray, priceCategory) {
    let that = this;
    let reqPrice;
    setTimeout(function () {
      entriesArray.forEach((entry) => {
        that.contService.getProductById(entry.productId).then((prod) => {
          that.contService
            .getPriceByCat(entry.productId, priceCategory)
            .subscribe((arg) => {
              arg.forEach((price) => {
                if (priceCategory == 1) {
                  reqPrice = price.data().price;
                }
                if (priceCategory == 2) {
                  reqPrice = price.data().price2;
                }
            const rowTotal = entry.quantity * reqPrice
                that.totalCalc = that.totalCalc + rowTotal;
                that.finalData.push({
                  productName: prod.data().productName,
                  quantity: entry.quantity,
                  date: entry.dateAdded,
                  rate: reqPrice,
                  rowTotal: rowTotal,
                  totalCalc: that.totalCalc
                });
              });
            });
        });
      });
    }, 500);
    this.dataAvailable = true;
    this.dataSource = null;
    this.dataSource = new MatTableDataSource(this.finalData);
    this.dataSource.sort = this.matSort;
  }

  createFinalData() {
    console.log(this.dataSource);
  }
}
