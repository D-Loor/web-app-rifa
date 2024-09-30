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
  let accessRol = ''
  const encryptedUserData = localStorage.getItem('userData');
  if (encryptedUserData) {
    const userData = encryptedService.decryptData(encryptedUserData);
    accessRol = userData.rol;
  }
  if (accessRol && accessRol.includes('Administrador')) {
    return true;
  }
  inject(Router).navigateByUrl('/');
  return false;
};

export const accessRifas: CanActivateFn = (route, state) => {
  const encryptedService = inject(EncryptedService);
  let accessRol = ''
  const encryptedUserData = localStorage.getItem('userData');
  if (encryptedUserData) {
    const userData = encryptedService.decryptData(encryptedUserData);
    accessRol = userData.rol;
  }
  if (accessRol && accessRol.includes('Administrador')) {
    return true;
  }
  inject(Router).navigateByUrl('/');
  return false;
};

export const accessTickets: CanActivateFn = (route, state) => {

  const encryptedService = inject(EncryptedService);
  let accessRol = ''
  const encryptedUserData = localStorage.getItem('userData');
  if (encryptedUserData) {
    const userData = encryptedService.decryptData(encryptedUserData);
    accessRol = userData.rol;
  }
  if (accessRol && accessRol.includes('Administrador') || accessRol.includes('Vendedor')) {
    return true;
  }
  inject(Router).navigateByUrl('/');
  return false;
};

export const accessContabilidad: CanActivateFn = (route, state) => {

  const encryptedService = inject(EncryptedService);
  let accessRol = ''
  const encryptedUserData = localStorage.getItem('userData');
  if (encryptedUserData) {
    const userData = encryptedService.decryptData(encryptedUserData);
    accessRol = userData.rol;
  }
  if (accessRol && accessRol.includes('Administrador')) {
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
