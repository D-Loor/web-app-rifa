import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdministracionRoutingModule } from './administracion-routing.module';
import { InicioComponent } from './inicio/inicio.component';

@NgModule({
  declarations: [
    InicioComponent,
  ],
  imports: [
    CommonModule,
    AdministracionRoutingModule,
  ]
})
export class AdministracionModule { }
