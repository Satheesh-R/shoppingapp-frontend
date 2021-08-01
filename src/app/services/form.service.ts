import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormService {

  constructor() { }

  getCreditCardMonth(startMonth:number): Observable<number[]>{
    //array for "Month" dropdown list
    let months:number[] = [];

    for(let month = startMonth;month <=12;month++){
      months.push(month);
    }
    
    return of(months);
  }


  getCreditCardYear(): Observable<number[]>{
    //array for "Year" dropdown list
    let years:number[] = [];
    const startYear = new Date().getFullYear();
    const endYear = startYear + 10;

    for(let year = startYear;year <= endYear;year++){
      years.push(year);
    }
    return of(years);
  }
}
