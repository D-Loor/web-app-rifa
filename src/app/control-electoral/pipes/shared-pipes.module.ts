import { NgModule } from '@angular/core';
import { TransformarDatosPipe } from './transformar-datos.pipe';
import { TransformarOracionPipe } from './transformar-oracion.pipe';

@NgModule({
  declarations: [TransformarDatosPipe, TransformarOracionPipe],
  exports: [TransformarDatosPipe,TransformarOracionPipe]
})
export class SharedPipesModule { }
