import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../services/utils/token.service';
import { EncryptedService } from '../services/utils/encrypted.service';
export const AuthGuard: CanActivateFn = (route, state) => {
  return true;
};

export const isUserAuthenticatedGuard: CanActivateFn = (route, state) => {
  const isAuthenticated = inject(TokenService).isAuthenticated();
  if (isAuthenticated)
    return true;
  inject(Router).navigateByUrl('/login');
  return false;
};

export const accessGestionUsuarioGuard: CanActivateFn = (route, state) => {
  const encryptedService = inject(EncryptedService);
  const encryptedData = localStorage.getItem('userData');
  let accessRol = ''
  if (encryptedData) {
    const decryptedData = encryptedService.decryptData(encryptedData);
    accessRol = decryptedData.access_module;
  }
  if (accessRol && accessRol.includes('Gestión Usuarios')) {
    return true;
  }
  inject(Router).navigateByUrl('/login');
  return false;
};

export const accessGestionPadronGuard: CanActivateFn = (route, state) => {

  const encryptedService = inject(EncryptedService);
  const encryptedData = localStorage.getItem('userData');
  let accessRol = ''
  if (encryptedData) {
    const decryptedData = encryptedService.decryptData(encryptedData);
    accessRol = decryptedData.access_module;
  }
  if (accessRol && accessRol.includes('Gestión Padrón')) {
    return true;
  }
  inject(Router).navigateByUrl('/login');
  return false;
};

export const accessGestionVoluntarioGuard: CanActivateFn = (route, state) => {
  const encryptedService = inject(EncryptedService);
  const encryptedData = localStorage.getItem('userData');
  let accessRol = ''
  if (encryptedData) {
    const decryptedData = encryptedService.decryptData(encryptedData);
    accessRol = decryptedData.access_module;
  }
  if (accessRol && accessRol.includes('Gestión Voluntarios')) {
    return true;
  }
  inject(Router).navigateByUrl('/login');
  return false;
};


export const isGuestGuard: CanActivateFn = (route, state) => {
  const isAuthenticated = inject(TokenService).isAuthenticated();
  if (!isAuthenticated)
    return true;
  inject(Router).navigateByUrl('/gestion/inicio');
  return false;
};
