import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermisoComponent } from './permiso/permiso.component';
import { RolComponent } from './rol/rol.component';
import { UsuarioComponent } from './usuario/usuario.component';

const routes: Routes = [
  { path: 'permisos', component: PermisoComponent },
  { path: 'roles', component: RolComponent },
  { path: 'usuarios', component: UsuarioComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GestionUsuarioRoutingModule { }
