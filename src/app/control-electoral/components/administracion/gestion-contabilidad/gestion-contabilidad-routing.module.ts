import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ResultadosComponent } from './resultados/resultados.component';
import { ContabilidadComponent } from './contabilidad/contabilidad.component';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forChild([
    { path: 'resultados', component: ResultadosComponent },
    {path: 'contabilidad', component: ContabilidadComponent},
    { path: '**', redirectTo: '/notfound' }
    ])],
  exports: [RouterModule]
})
export class GestionContabilidadRoutingModule { }
