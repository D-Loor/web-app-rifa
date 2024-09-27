import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { InicioComponent } from './inicio/inicio.component';
import { accessGestionPadronGuard, accessGestionUsuarioGuard, accessGestionVoluntarioGuard, isUserAuthenticatedGuard } from '../../guards/auth.guard';

const routes: Routes = [
    { path: 'inicio', component: InicioComponent, 
        // canActivate: [isUserAuthenticatedGuard] 
    },    
    { 
        path: '', 
        loadChildren: () => import('./gestion-usuario/gestion-usuario.module').then(m => m.GestionUsuarioModule), 
        // canActivate: [accessGestionUsuarioGuard] 
    },
    { 
        path: 'gestion-rifa', 
        loadChildren: () => import('./gestion-rifa/gestion-rifa.module').then(m => m.GestionRifaModule), 
        // canActivate: [accessGestionUsuarioGuard] 
    },
    { 
        path: 'gestion-ticket', 
        loadChildren: () => import('./gestion-ticket/gestion-ticket.module').then(m => m.GestionTicketModule), 
        // canActivate: [accessGestionUsuarioGuard] 
    },
    { 
        path: 'padron', 
        loadChildren: () => import('./gestion-padron/gestion-padron.module').then(m => m.GestionPadronModule), 
        // canActivate: [accessGestionPadronGuard] 
    },
    { 
        path: 'voluntarios', 
        loadChildren: () => import('./gestion-voluntario/gestion-voluntario.module').then(m => m.GestionVoluntarioModule), 
        // canActivate: [accessGestionVoluntarioGuard] 
    },
    { 
        path: 'estadisticas', 
        loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule), 
        // canActivate: [accessGestionVoluntarioGuard] 
    }

];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [RouterModule]
})
export class AdministracionRoutingModule {
}
