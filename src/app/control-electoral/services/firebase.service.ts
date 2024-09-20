import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(private auth: Auth) {}

  async registroCorreo(email: string, password: string) {
    
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      await this.enviarCorreoVerificacion(userCredential.user);
      return userCredential;
    } catch (error) {
      console.error('Error during registration:', error);
      throw error;
    }
  }

  async enviarCorreoVerificacion(user) {
    try {
      if (user) {
        await sendEmailVerification(user);
      }
    } catch (error) {
      console.error('Error sending email verification:', error);
      throw error;
    }
  }

  async iniciarSesion(correo: string, contrasena: string) {
    try {
      const usuarioCredencial = await signInWithEmailAndPassword(this.auth, correo, contrasena);
      return usuarioCredencial;
    } catch (error) {
      console.error('Error during sign in:', error);
      throw error;
    }
  }

  async estadoDelEmail(): Promise<boolean> {
    try {
      const usuario = this.auth.currentUser;
      if (usuario) {
        await usuario.reload();  // Refresh the user's data
        return usuario.emailVerified;
      }
      return false;
    } catch (error) {
      console.error('Error checking email verification:', error);
      throw error;
    }
  }

  async logout() {
    try {
      await signOut(this.auth);
    } catch (error) {
      console.error('Error during sign out:', error);
      throw error;
    }
  }
}
