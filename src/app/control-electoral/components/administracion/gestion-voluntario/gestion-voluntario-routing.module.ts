import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


@NgModule({
  imports: [RouterModule.forChild([
    { path: '', loadChildren: () => import('./lista-voluntarios/lista-voluntarios.module').then(m => m.ListaVoluntariosModule) },
    { path: '**', redirectTo: '/notfound' }
])],
  exports: [RouterModule]
})
export class GestionVoluntarioRoutingModule { }
