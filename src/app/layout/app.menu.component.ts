import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';
import { EncryptedService } from '../app-rifa/services/utils/encrypted.service';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

    model: any[] = [];
    accessRol: string;

    constructor(public layoutService: LayoutService, private encryptedService: EncryptedService) { }

    ngOnInit() {
        const encryptedUserData = localStorage.getItem('userData');
        if (encryptedUserData) {
            const userData = this.encryptedService.decryptData(encryptedUserData);
            this.accessRol = userData.rol;
        }
        this.model = [
            {
                label: 'Home',
                items: [
                    { label: 'Inicio', icon: 'pi pi-fw pi-home', routerLink: ['/gestion/inicio'] }
                ]
            }
        ];

        if (this.accessRol && this.accessRol.includes('Administrador')) {
            this.model.push({
                label: 'Gestión Contabilidad',
                items: [
                    { label: 'Contabilidad', icon: 'pi pi-fw pi-dollar', routerLink: ['/gestion/gestion-contabilidad/contabilidad'] },
                    { label: 'Resultados', icon: 'pi pi-fw pi-check-circle', routerLink: ['/gestion/gestion-contabilidad/resultados'] },
                ]
            });
        }

        this.model.push({
            label: 'Gestión Tickets',
            items: [
                { label: 'Vender Tickets', icon: 'pi pi-fw pi-copy', routerLink: ['/gestion/gestion-ticket/tickets'] },
                { label: 'Tickets Vendidos', icon: 'pi pi-fw pi-book', routerLink: ['/gestion/gestion-ticket/tickets-vendidos'] },
            ]
        });

        if (this.accessRol && this.accessRol.includes('Administrador')) {

            this.model.push({
                label: 'Gestión Rifas',
                items: [
                    { label: 'Rifas', icon: 'pi pi-clone', routerLink: ['/gestion/gestion-rifa/rifas'] },
                    { label: 'Límites', icon: 'pi pi-ban', routerLink: ['/gestion/gestion-rifa/limites'] }
                ]
            });

            this.model.push({
                label: 'Gestión Usuarios',
                items: [
                    { label: 'Usuarios', icon: 'pi pi-fw pi-users', routerLink: ['/gestion/usuarios'] },
                ]
            });
        }       

    }
}
