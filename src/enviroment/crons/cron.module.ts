import { Module } from '@nestjs/common';
import { CronManager } from './CronManager';

@Module({
  providers: [CronManager],
  exports: [CronManager],
})
export class CronModule {}
