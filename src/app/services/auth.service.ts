import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';

// Declare Google Identity Services global
declare const google: any;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenClient: any;
  private accessTokenSubject = new BehaviorSubject<string | null>(null);
  
  accessToken$ = this.accessTokenSubject.asObservable();

  constructor(private ngZone: NgZone) {
    this.initTokenClient();
  }

  get isAuthenticated(): boolean {
    return !!this.accessTokenSubject.value;
  }

  get accessToken(): string | null {
    return this.accessTokenSubject.value;
  }

  private initTokenClient() {
    if (typeof google === 'undefined') {
        // Wait for script to load if not ready yet
        // In a real app, we might want a script loader service, but for now we assume it loads quickly from index.html
        const checkGoogle = setInterval(() => {
            if (typeof google !== 'undefined' && environment.googleClientId && environment.googleClientId !== 'YOUR_GOOGLE_CLIENT_ID') {
                clearInterval(checkGoogle);
                this.createClient();
            }
        }, 100);
        return;
    }
    
    if (environment.googleClientId && environment.googleClientId !== 'YOUR_GOOGLE_CLIENT_ID') {
        this.createClient();
    }
  }

  private createClient() {
    this.tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: environment.googleClientId,
        scope: 'https://www.googleapis.com/auth/cloud-platform',
        callback: (response: any) => {
            this.handleTokenResponse(response);
        },
    });
  }

  login() {
    if (this.tokenClient) {
        // Use requestAccessToken to trigger the popup
        this.tokenClient.requestAccessToken();
    } else {
        console.warn('Google Token Client not initialized. Check Client ID.');
        // Retry init if it failed earlier?
        this.initTokenClient();
    }
  }

  logout() {
    const token = this.accessTokenSubject.value;
    if (token) {
        google.accounts.oauth2.revoke(token, () => {
            this.ngZone.run(() => {
                this.accessTokenSubject.next(null);
            });
        });
    } else {
         this.accessTokenSubject.next(null);
    }
  }

  private handleTokenResponse(response: any) {
    if (response.access_token) {
        this.ngZone.run(() => {
            this.accessTokenSubject.next(response.access_token);
        });
    }
  }
}
