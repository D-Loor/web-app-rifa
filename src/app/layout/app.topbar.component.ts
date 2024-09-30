import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { LayoutService } from "./service/app.layout.service";
import { TokenService } from '../control-electoral/services/utils/token.service';
import { Router } from '@angular/router';
import { EncryptedService } from '../control-electoral/services/utils/encrypted.service';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html',
    providers: [ConfirmationService]
})
export class AppTopBarComponent implements AfterViewInit {
    usuario: string = "";
    identificacion: string = "";
    items!: MenuItem[];

    @ViewChild('menubutton') menuButton!: ElementRef;
    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;
    @ViewChild('topbarmenu') menu!: ElementRef;

    constructor(public layoutService: LayoutService, private tokenService: TokenService,
        private confirmationService: ConfirmationService, private route: Router, private encryptedService: EncryptedService) {
        const encryptedUserData = localStorage.getItem('userData');
        if (encryptedUserData) {
            const userData = this.encryptedService.decryptData(encryptedUserData);
            this.usuario = userData.usuario;
            this.identificacion = userData.rol; 
        }
    }

    ngAfterViewInit() {
        this.menuButton;
        this.topbarMenuButton;
        this.menu;
    }
    confirm(event: Event) {
        this.confirmationService.confirm({
            key: 'confirm',
            target: event.target || new EventTarget,
            message: '¿Desea cerrar la sesión?',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Si',
            accept: () => {
                this.cerrarCesion();
            }
        });
    }

    cerrarCesion() {
        this.tokenService.revokeToken();
        this.route.navigate(['/']);
    }
}
