import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CalculateComponent } from './calculate/calculate.component';
import { EmployeeMasterComponent } from './employee-master/employee-master.component';
import { EntriesComponent } from './entries/entries.component';
import { PriceComponent } from './price-master/price/price.component';
import { ProductMasterComponent } from './product-master/product-master.component';
import { SearchComponent } from './search/search.component';
import { TestComponent } from './test/test.component';

const routes: Routes = [
    { path: 'employee-master', component: EmployeeMasterComponent },
    { path: 'product-master', component: ProductMasterComponent },
    { path: 'entries', component: EntriesComponent },
    { path: 'search', component: SearchComponent },
    { path: 'price', component: PriceComponent },
    { path: 'test', component: TestComponent },
    { path: 'calculate', component: CalculateComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

