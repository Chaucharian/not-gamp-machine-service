import { HttpException, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { catchError, map } from 'rxjs/operators';
import { OAuth2Client } from 'google-auth-library';
import * as jwt from 'jsonwebtoken';
import * as jwksClient from 'jwks-rsa';
import firebase from 'firebase-admin';

interface CachedToken {
  token: string;
  exp: number;
  options: {
    scope: string;
    aud: string;
  };
}
@Injectable()
export class AuthService {
  private googleClient;
  protected authDomain: string;
  private cachedTokens: CachedToken[] = [];

  constructor(private configService: ConfigService) {
    this.authDomain = this.configService.get('authService.domain');
  }

  async getClient(clientId: string) {
    let client = null;

    await firebase
      .database()
      .ref('clients')
      .once('value')
      .then((snapshot) => {
        const clients = snapshot.val();
        Object.keys(clients).forEach((clientName) => {
          if (clientId === clients[clientName]) {
            client = { clientName, clientId };
          }
        });
      });
    return client;
  }
}
