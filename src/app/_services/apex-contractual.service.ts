import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApexContractualService {
  constructor(private afs: AngularFirestore) {}

  addEmployee(employeeName, priceCategory, defintion) {
    return this.afs.collection('employees').add({
      employeeName: employeeName,
      priceCategory: priceCategory,
      defintion: defintion,
    });
  }

  getEmployees() {
    return this.afs
      .collection('employees', (ref) => ref.orderBy('employeeName'))
      .snapshotChanges();
  }

  editEmployee(employeeId, employeeName, priceCategory, definition) {
    return this.afs.collection('employees').doc(employeeId).ref.update({
      employeeName: employeeName,
      priceCategory: priceCategory,
      definition: definition
    });
  }

  deleteEmployee(employeeId) {
    return this.afs.collection('employees').doc(employeeId).ref.delete();
  }

  getEmployee(id) {
    return this.afs.collection('employees').doc(id).ref.get();
  }

  editProduct(productId, productName, definition) {
    return this.afs.collection('products').doc(productId).ref.update({
      productName: productName,
      definition: definition
    });
  }

  addNewProduct(productName, size, definition) {
    return this.afs.collection('products').add({
      productName: productName,
      size: size,
      definition: definition,
    });
  }

  deleteProduct(productId) {
    return this.afs.collection('products').doc(productId).ref.delete();
  }

  getPrices(event) {
    console.log(event);
    return this.afs
      .collection('prices')
      .snapshotChanges();
  }

  getPriceByCat(prodId, cat) {
    return this.afs
    .collection('prices', (ref) => ref
    .where('productId', '==', prodId)
    )
      .get();
  }

  editPrice(priceId, price, price2) {
    return this.afs.collection('prices').doc(priceId).ref.update({
      price: price,
      price2: price2
    });
  }

  deletePrice(priceId) {
    console.log(priceId);
    return this.afs.collection('prices').doc(priceId).ref.delete();
  }

  addNewPrice(productId, price, price2, price3, comments) {
    return this.afs.collection('prices').add({
      productId: productId,
      price: price,
      price2: price2,
      price3: price3,
      comments: comments
    });
  }

  getProducts() {
    return this.afs
      .collection('products', (ref) => ref.orderBy('productName'))
      .snapshotChanges();
  }
  
  getProducts1() {
    return this.afs.collection('products').get();
  }

  getProduct(id) {
    return this.afs.collection('products').doc(id).ref.get();
  }

  addNewEntry(quantity, productId, employeeId, dateAdded, definition) {
    return this.afs.collection('entries').add({
      productId: productId,
      employeeId: employeeId,
      quantity: quantity,
      dateAdded: dateAdded,
      definition: definition,
    });
  }

  getProductById(id) {
    return this.afs.collection('products').doc(id).ref.get();
  }

  getEmployeeById(id) {
    console.log(id)
    return this.afs.collection('employees').doc(id).ref.get();
  }

  getEntries() {
    return this.afs.collection('entries').snapshotChanges();
  }

  getEntriesGet() {
    return this.afs.collection('entries').get();
  }

  editEntry(entryId, productId, employeeId,definition, quantity, dateAdded) {
    return this.afs.collection('entries').doc(entryId).ref.update({
      productId: productId,
      employeeId: employeeId,
      definition: definition,
      quantity: quantity,
      dateAdded: dateAdded,
    });
  }

  getEntriesCalc(employeeId) {
    return this.afs
      .collection('entries', (ref) => ref
      .where('employeeId', '==', employeeId))
      .get();
  }

  getPricesCalc(procuctId) {
    return this.afs
      .collection('prices', (ref) => ref
      .where('productId', '==', procuctId)
      )
      .get();
  }

  getEmployeePriceCat(employeeId)
 {
  return this.afs.collection('employees').doc(employeeId).ref.get();
 }

  getEntry(id) {
    return this.afs.collection('entries').doc(id).ref.get();
  }

  deleteEntry(entryId) {
    return this.afs.collection('entries').doc(entryId).ref.delete();
  }

  GetAssets(): Observable<any[]> {
    let assets: any[] = [
      {
        assetId: 1,
        assetName: 'Item A',
        cpuName: 'CPU A',
        hddName: 'HDD A',
      },
      {
        assetId: 2,
        assetName: 'Item B',
        cpuName: 'CPU B',
        hddName: 'HDD B',
      },
      {
        assetId: 3,
        assetName: 'Item C',
        cpuName: 'CPU C',
        hddName: 'HDD C',
      },
    ];

    return of(assets);
  }
}
