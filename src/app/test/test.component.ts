import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Entry } from '../_model/entry';
import { ApexContractualService } from '../_services/apex-contractual.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {
  displayedColumns: string[] = ['dateAdded', 'employeeName', 'productName', 'quantity'];
  dataSource: any;
 // @ViewChild(MatSort, { static: false }) sort!: MatSort;
  constructor(private congService: ApexContractualService) {}

  ngOnInit(): void {
    this.assetGrid();
    console.log(this.dataSource);
  }

  myArray =  [{
    'id': 1, 'name': "aaaa"
  },
  {
    'id': 12, 'name': "zzzz"
  },
  {
    'id': 31, 'name': "cccc"
  },
  {
    'id': 4, 'name': "gggg"
  }

]
  assetGrid() {
    console.log(this.myArray)
    console.log(this.myArray.sort((n1,n2) => {
    if (n1.name > n2.name) {
        return 1;
    }

    if (n1.name < n2.name) {
        return -1;
    }

    return 0;
}));
  }

}
