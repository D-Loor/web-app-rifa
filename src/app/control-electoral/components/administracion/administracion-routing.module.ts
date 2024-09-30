import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { InicioComponent } from './inicio/inicio.component';
import { accessUsuarios, accessRifas, accessTickets, isUserAuthenticatedGuard, accessContabilidad } from '../../guards/auth.guard';

const routes: Routes = [
    { path: 'inicio', component: InicioComponent, 
        canActivate: [isUserAuthenticatedGuard] 
    },    
    { 
        path: '', 
        loadChildren: () => import('./gestion-usuario/gestion-usuario.module').then(m => m.GestionUsuarioModule), 
        canActivate: [accessUsuarios] 
    },
    { 
        path: 'gestion-rifa', 
        loadChildren: () => import('./gestion-rifa/gestion-rifa.module').then(m => m.GestionRifaModule), 
        canActivate: [accessRifas] 
    },
    { 
        path: 'gestion-ticket', 
        loadChildren: () => import('./gestion-ticket/gestion-ticket.module').then(m => m.GestionTicketModule), 
        canActivate: [accessTickets] 
    },
    { 
        path: 'gestion-contabilidad', 
        loadChildren: () => import('./gestion-contabilidad/gestion-contabilidad.module').then(m => m.GestionContabilidadModule), 
        canActivate: [accessContabilidad] 
    },

];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [RouterModule]
})
export class AdministracionRoutingModule {
}
