import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EleccionesComponent } from './elecciones/elecciones.component';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forChild([
    { path: 'elecciones', component:EleccionesComponent },
    { path: '**', redirectTo: '/notfound' }
])],
  exports: [RouterModule]
})
export class GestionPadronRoutingModule { }
