import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';
import { EncryptedService } from '../control-electoral/services/utils/encrypted.service';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

    model: any[] = [];
    accessRol: string;

    constructor(public layoutService: LayoutService, private encryptedService: EncryptedService) { }

    ngOnInit() {
        const encryptedData = localStorage.getItem('userData');
        if (encryptedData) {
            const decryptedData = this.encryptedService.decryptData(encryptedData);
            this.accessRol = decryptedData.access_module;
        }
        this.model = [
            {
                label: 'Home',
                items: [
                    { label: 'Inicio', icon: 'pi pi-fw pi-home', routerLink: ['/gestion/inicio'] }
                ]
            },
            // {
            //     label: 'Asignación Roles',
            //     items: [
            //         { label: 'Lista de Usuarios', icon: 'pi pi-fw pi-id-card', routerLink: ['/gestion/asignacion-roles'] }
            //     ]
            // },
        ];

        // if (this.accessRol && this.accessRol.includes('Gestión Usuarios')) {
            this.model.push({
                label: 'Gestión Usuarios',
                items: [
                    { label: 'Usuarios', icon: 'pi pi-fw pi-users', routerLink: ['/gestion/usuarios'] },
                    // { label: 'Roles', icon: 'pi pi-fw pi-sitemap', routerLink: ['/gestion/roles'] },               
                    // { label: 'Permisos', icon: 'pi pi-fw pi-unlock', routerLink: ['/gestion/permisos'] }
                ]
            });
        // }

        this.model.push({
            label: 'Gestión Rifas',
            items: [
                { label: 'Rifas', icon: 'pi pi-fw pi-users', routerLink: ['/gestion/gestion-rifa/rifas'] },
                { label: 'Resultados', icon: 'pi pi-fw pi-sitemap', routerLink: ['/gestion/resultados'] },
            ]
        });

        this.model.push({
            label: 'Gestión Tickets',
            items: [
                { label: 'Tickets', icon: 'pi pi-fw pi-sitemap', routerLink: ['/gestion/ticket'] }
            ]
        });

    }
}
