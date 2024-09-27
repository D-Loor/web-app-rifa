import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { NotfoundComponent } from './demo/components/notfound/notfound.component';
import { AppLayoutComponent } from "./layout/app.layout.component";
import { LandingPageComponent } from './control-electoral/components/landing-page/landing-page.component';
import { isUserAuthenticatedGuard } from './control-electoral/guards/auth.guard';

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
