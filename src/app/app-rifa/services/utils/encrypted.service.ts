import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { TokenService } from './token.service';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class EncryptedService {

  private secretKey = 'BAML';
  constructor(private tokenService: TokenService,private route: Router) { }

  encryptData(data: any): string {
    return CryptoJS.AES.encrypt(JSON.stringify(data), this.secretKey).toString();
  }

  decryptData(encryptedData: string): any {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, this.secretKey);
      return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    } catch (error) {
      this.cerrarCesion();
      return {};
    }
  }

  cerrarCesion() {
    this.tokenService.revokeToken();
    this.route.navigate(['/login']);
}
}
