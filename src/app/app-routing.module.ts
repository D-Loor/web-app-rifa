import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { NotfoundComponent } from './demo/components/notfound/notfound.component';
import { AppLayoutComponent } from "./layout/app.layout.component";
import { isUserAuthenticatedGuard } from './app-rifa/guards/auth.guard';
import { ValidarTicketComponent } from './app-rifa/components/validar-ticket/validar-ticket.component';

const routes: Routes = [
    {
        path: 'gestion', component: AppLayoutComponent,
        children: [
            { 
                path: '', 
                loadChildren: () => import('./app-rifa/components/administracion/administracion.module').then(m => m.AdministracionModule), 
                canActivate: [isUserAuthenticatedGuard] 
            },
        ]
    },
    {
        path: 'validar-ticket/:codigoTicket',
        loadChildren: () => import('./app-rifa/components/validar-ticket/validar-ticket.module').then(m => m.ValidarTicketModule),
    },
    {
        path: '',
        loadChildren: () => import('./app-rifa/components/autenticacion/inicio-sesion/inicio-sesion.module').then(m => m.InicioSesionModule),
        pathMatch: 'full'
    },
    {
        path: 'notfound',
        component: NotfoundComponent
    },
    {
        path: '**',
        redirectTo: '/notfound'  // Redirige a la página no encontrada
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled', onSameUrlNavigation: 'reload'})],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
