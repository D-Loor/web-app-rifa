import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { NotfoundComponent } from './demo/components/notfound/notfound.component';
import { AppLayoutComponent } from "./layout/app.layout.component";
import { isGuestGuard, isUserAuthenticatedGuard } from './control-electoral/guards/auth.guard';
import { LandingPageComponent } from './control-electoral/components/landing-page/landing-page.component';

const routes: Routes = [
    {
        path: 'gestion', component: AppLayoutComponent,
        children: [
            { 
                path: '', 
                loadChildren: () => import('./control-electoral/components/administracion/administracion.module').then(m => m.AdministracionModule), 
                // canActivate: [isUserAuthenticatedGuard] 
            },
        ]
    },
    // {
    //     path: 'registro-voluntario',
    //     children: [
    //         { 
    //             path: '', 
    //             loadChildren: () => import('./control-electoral/components/voluntario/voluntario.module').then(m => m.VoluntarioModule) },      
    //     ]
    // },
    // {
    //     path: 'auth',
    //     loadChildren: () => import('./demo/components/auth/auth.module').then(m => m.AuthModule)
    // },
    // {
    //     path: 'landing',
    //     loadChildren: () => import('./demo/components/landing/landing.module').then(m => m.LandingModule)
    // },
    // {
    //     path: 'correo-telefono',
    //     loadChildren: () => import('./control-electoral/components/pruebas/correo-telefono/correo-telefono.module').then(m => m.CorreoTelefonoModule)
    // },
    // {
    //     path: 'login',
    //     loadChildren: () => import('./control-electoral/components/autenticacion/inicio-sesion/inicio-sesion.module').then(m => m.InicioSesionModule),
    //     canActivate: [isGuestGuard],
    // },
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
