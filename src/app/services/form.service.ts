import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Country } from '../common/country';
import { State } from '../common/state';

@Injectable({
  providedIn: 'root'
})
export class FormService {

  constructor(private httpClient:HttpClient) { }

  private countryUrl = "http://localhost:8080/api/countries";
  private stateUrl = "http://localhost:8080/api/states";

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

  getCountries():Observable<Country[]>{
    return this.httpClient.get<getCountryList>(this.countryUrl).pipe(
      map(response => response._embedded.countries)
    );
  }

  getStates(countryCode:string):Observable<State[]>{
    const statesSearchUrl = `${this.stateUrl}/search/findByCountryCode?code=${countryCode}`;
    return this.httpClient.get<getStatesList>(statesSearchUrl).pipe(
      map(response => response._embedded.states)
    );
  }
}

interface getCountryList{
  _embedded:{
    countries: Country[];
  }
}

interface getStatesList{
  _embedded:{
    states: State[];
  }
}