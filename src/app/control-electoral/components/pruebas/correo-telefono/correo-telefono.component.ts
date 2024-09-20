import { Component, inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { FirebaseService } from 'src/app/control-electoral/services/firebase.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { initializeApp } from 'firebase/app';

@Component({
  selector: 'app-correo-telefono',
  templateUrl: './correo-telefono.component.html',
  styleUrls: ['./correo-telefono.component.scss']
})
export class CorreoTelefonoComponent {

  telefono;
  codVerificacion;
  recaptchaVerifier: any;
  
  captcha() {
    const auth = getAuth();
    this.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      'size': 'invisible',
      'callback': (response) => {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
        // this.enviar();
        // ...
        
      },
      'expired-callback': () => {
        // Response expired. Ask user to solve reCAPTCHA again.
        // ...

      },
    });
  }

  recaptchaWidgetId:any;
  grecaptcha:any

  enviar() {
    this.captcha();
    const auth = getAuth();
    setTimeout(() => {
      signInWithPhoneNumber(auth, this.telefono, this.recaptchaVerifier)
      .then((confirmationResult) => {
        // SMS sent. Prompt user to type the code from the message, then sign the
        // user in with confirmationResult.confirm(code).
        this.confirmationResultR = confirmationResult;
        
        // ...
      }).catch((error) => {
        // Error; SMS not sent
        console.log(error)
       
        // this.recaptchaVerifier.render().then(function(widgetId) {
        //   this.grecaptcha.reset(widgetId);
        // })
        // ...
      });
    }, 10000);
    
  }

  confirmationResultR: any
  validarCodigo() {
    this.confirmationResultR.confirm(this.codVerificacion).then((result) => {
      // User signed in successfully.
      
      const user = result.user;
      
      // ...
    }).catch((error) => {
      // User couldn't sign in (bad verification code?)
      // ...
      
    });
  }


  //Authentication con Email Firebase

  correo: string = '';
  password: string = 'aquiseagregaunacontrasenarandom'; 

  constructor(private firebaseService: FirebaseService) { }

  async registro() {
    try {
      await this.firebaseService.registroCorreo(this.correo, this.password);
      alert('Registration successful. Please check your email for verification.');
    } catch (error) {
      alert('Registration failed: ' + error.message);
    }
  }

  async validarCorreo() {
    try {
      const isVerified = await this.firebaseService.estadoDelEmail();
      if (isVerified) {
        alert('Email is verified.');
      } else {
        alert('Email is not verified. Please check your email.');
      }
    } catch (error) {
      alert('Failed to check email verification: ' + error.message);
    }
  }

  async IniciarSesion() {
    try {
      await this.firebaseService.iniciarSesion(this.correo, this.password);
      alert('Sign in successful.');
    } catch (error) {
      alert('Sign in failed: ' + error.message);
    }
  }

  async cerrarSesion() {
    try {
      await this.firebaseService.logout();
      alert('Logged out successfully.');
    } catch (error) {
      alert('Logout failed: ' + error.message);
    }
  }
}
