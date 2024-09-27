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
  inject(Router).navigateByUrl('/');
  return false;
};

export const accessUsuarios: CanActivateFn = (route, state) => {
  const encryptedService = inject(EncryptedService);
  const encryptedData = localStorage.getItem('userData');
  let accessRol = ''
  if (encryptedData) {
    accessRol = encryptedService.decryptData(encryptedData);
  }
  if (accessRol && accessRol.includes('Administrador')) {
    return true;
  }
  inject(Router).navigateByUrl('/');
  return false;
};

export const accessRifas: CanActivateFn = (route, state) => {
  const encryptedService = inject(EncryptedService);
  const encryptedData = localStorage.getItem('userData');
  let accessRol = ''
  if (encryptedData) {
    accessRol = encryptedService.decryptData(encryptedData);
  }
  if (accessRol && accessRol.includes('Administrador')) {
    return true;
  }
  inject(Router).navigateByUrl('/');
  return false;
};

export const accessTickets: CanActivateFn = (route, state) => {

  const encryptedService = inject(EncryptedService);
  const encryptedData = localStorage.getItem('userData');
  let accessRol = ''
  if (encryptedData) {
    accessRol = encryptedService.decryptData(encryptedData);
  }
  if (accessRol && accessRol.includes('Administrador') || accessRol.includes('Vendedor')) {
    return true;
  }
  inject(Router).navigateByUrl('/');
  return false;
};

export const isGuestGuard: CanActivateFn = (route, state) => {
  const isAuthenticated = inject(TokenService).isAuthenticated();
  if (!isAuthenticated)
    return true;
  inject(Router).navigateByUrl('/gestion/inicio');
  return false;
};
