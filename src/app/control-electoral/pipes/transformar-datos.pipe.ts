import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'transformarDatos'
})
export class TransformarDatosPipe implements PipeTransform {

  transform(obj: any, path: string): any {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  }


}
