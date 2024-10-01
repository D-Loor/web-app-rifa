import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { NotfoundComponent } from './demo/components/notfound/notfound.component';
import { AppLayoutComponent } from "./layout/app.layout.component";
import { isUserAuthenticatedGuard } from './control-electoral/guards/auth.guard';
import { ValidarTicketComponent } from './control-electoral/components/validar-ticket/validar-ticket.component';

const routes: Routes = [
    {
        path: 'gestion', component: AppLayoutComponent,
        children: [
            { 
                path: '', 
                loadChildren: () => import('./control-electoral/components/administracion/administracion.module').then(m => m.AdministracionModule), 
                canActivate: [isUserAuthenticatedGuard] 
            },
        ]
    },
    {
        path: 'validar-ticket/:codigoTicket',
        loadChildren: () => import('./control-electoral/components/validar-ticket/validar-ticket.module').then(m => m.ValidarTicketModule),
    },
    {
        path: '',
        loadChildren: () => import('./control-electoral/components/autenticacion/inicio-sesion/inicio-sesion.module').then(m => m.InicioSesionModule),
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
    imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled', onSameUrlNavigation: 'reload', useHash: true})],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
