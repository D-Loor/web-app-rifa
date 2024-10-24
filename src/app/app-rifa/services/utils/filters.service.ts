import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FiltersService {

  constructor() { }

  filterTextContains(text: string, property: string, data: any[]): any[] {
    const lowerCaseText = text.toLowerCase();
    return data.filter(item => 
      item[property]?.toLowerCase().includes(lowerCaseText)
    );
  }  

  atLeastOneFieldValidator(...fields: string[]): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const hasAtLeastOne = fields.some(field => !!formGroup.get(field)?.value);
  
      return hasAtLeastOne ? null : { atLeastOneRequired: true };
    };
  }

}
