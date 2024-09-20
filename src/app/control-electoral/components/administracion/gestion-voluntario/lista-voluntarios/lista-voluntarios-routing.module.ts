import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListaVoluntariosComponent } from './lista-voluntarios.component';

const routes: Routes = [{ path: '', component: ListaVoluntariosComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ListaVoluntariosRoutingModule { }
