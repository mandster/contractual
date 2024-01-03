import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProductMasterComponent } from './product-master/product-master.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularFireModule } from '@angular/fire';
import { EmployeeMasterComponent } from './employee-master/employee-master.component';
import { NavComponent } from './nav/nav/nav.component';
import { EntriesComponent } from './entries/entries.component';
import { SearchComponent } from './search/search.component';
import { PriceComponent } from './price-master/price/price.component';
import { CalculateComponent } from './calculate/calculate.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material/table'
import { MatSortModule } from '@angular/material/sort';
import { TestComponent } from './test/test.component';
import { ManageEntriesComponent } from './manage-entries/manage-entries.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';



// AngularFire Settings
export const firebaseConfig = {
  apiKey: "AIzaSyDod4I8TQ_3FX7ScbIkVxkzuJJtxwOP5Mw",
  authDomain: "contractual-e220f.firebaseapp.com",
  projectId: "contractual-e220f",
  storageBucket: "contractual-e220f.appspot.com",
  messagingSenderId: "506601902944",
  appId: "1:506601902944:web:24d06b93b9ef8281178405",
  measurementId: "G-PBB05C5SEW"
};



@NgModule({
  declarations: [
    AppComponent,
    ProductMasterComponent,
    EmployeeMasterComponent,
    NavComponent,
    EntriesComponent,
    SearchComponent,
    PriceComponent,
    CalculateComponent,
    TestComponent,
    ManageEntriesComponent
  ],

  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(firebaseConfig),
    BrowserAnimationsModule,
    MatTableModule,
    MatSortModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
