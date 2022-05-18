import { HttpException, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { catchError, map } from 'rxjs/operators';
import { OAuth2Client } from 'google-auth-library';
import * as jwt from 'jsonwebtoken';
import * as jwksClient from 'jwks-rsa';

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

  getDevice(clientId: string) {
    // return firebase
    // .database()
    // .ref('sensordata/data')
    // .once('value')
    // .then(function (snapshot) {
    //   const responseArray = Object.keys(snapshot.val());
    //   const filteredData = [];
    //   for (const index of responseArray) {
    //     filteredData.push(snapshot.val()[String(index)]);
    //   }
    //   chartData = filteredData.filter(
    //     (entry) => from <= entry.timestamp && entry.timestamp <= to,
    //   );
  }
}
