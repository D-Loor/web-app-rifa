import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ResultadosComponent } from './resultados/resultados.component';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forChild([{ path: 'resultados', component: ResultadosComponent },
    { path: '**', redirectTo: '/notfound' }
    ])],
  exports: [RouterModule]
})
export class GestionContabilidadRoutingModule { }
