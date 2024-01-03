import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { ApexContractualService } from '../_services/apex-contractual.service';

@Component({
  selector: 'app-employee-master',
  templateUrl: './employee-master.component.html',
  styleUrls: ['./employee-master.component.css']
})
export class EmployeeMasterComponent implements OnInit {
  @ViewChild(MatSort) sort!: MatSort;

  success= false;
  employees = [];
  sorted = [];
  fg: FormGroup;
  fEdit: FormGroup;
  editSuccess = false;
  editEmployeeForm = false;
  deleteSuccess = false;

  constructor(
    private contService: ApexContractualService, private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.getEmployees();
    this.fg = this.fb.group({
      employeeName: ['', Validators.required],
      priceCategory: ['0'],
      definition  : [''],
    });
  }

  addNewEmployee(){
    const employeeName = this.fg.get("employeeName").value;
    const definition = this.fg.get("definition").value;
    const priceCategory = this.fg.get("priceCategory").value;
    this.contService.addEmployee(employeeName, priceCategory, definition).then(res => {
      this.success = true;
    })
  }

  preEditEmployee(employeeId, employeeName, priceCategory, oldDef) {
    this.fEdit = this.fb.group({
      employeeId: employeeId,
      employeeName: employeeName,
      definition: oldDef,
      priceCategory: priceCategory
    });
    this.editEmployeeForm = true;
  }

  editEmployee() {
    const employeeId = this.fEdit.get('employeeId').value;
    const employeeName = this.fEdit.get('employeeName').value;
    const priceCategory = this.fEdit.get('priceCategory').value;
    const definition = this.fEdit.get('definition').value;
    this.contService
      .editEmployee(employeeId, employeeName, priceCategory, definition)
      .then((arg) => {
        this.editSuccess = true;
        this.editEmployeeForm = false;
      });
  }

  deleteEmployee(employeeId) {
    var result = confirm('Sure to delete?');
    if (result) {
      //Logic to delete the item
      this.contService.deleteEmployee(employeeId).then((arg) => {
        this.deleteSuccess = true;
      });
    }
  }

  getEmployees() {
    this.employees = [];
    this.contService.getEmployees().subscribe(arg => {
      arg.forEach(res => {
        this.employees.push(
          {
            data:  res.payload.doc.data() ,
            docId: res.payload.doc.id
          })
      })
    })
    this.sorted = this.employees.sort((a, b) => {
      return a.employeeName - b.employeeName;
    });
  }

}
