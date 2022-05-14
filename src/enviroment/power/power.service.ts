import { Injectable, Logger } from '@nestjs/common';
import firebase from 'firebase-admin';
import { ConfigService } from '@nestjs/config';
import { CronManager } from '../crons/CronManager';
import { CronExpression } from '@nestjs/schedule';

@Injectable()
export class PowerService {
  private measurements = {
    temperature: '0%',
    humidity: '0%',
  };
  private readonly logger = new Logger(PowerService.name);

  constructor(
    private configService: ConfigService,
    private cronManager: CronManager,
  ) {}
}
