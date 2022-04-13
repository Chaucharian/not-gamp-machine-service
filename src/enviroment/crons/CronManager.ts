import { Injectable, Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';

@Injectable()
export class CronManager {
  private readonly logger = new Logger(CronManager.name);
  constructor(private schedulerRegistry: SchedulerRegistry) {}

  addCronJob(name: string, time: string, callback) {
    const job = new CronJob(time, callback);

    this.schedulerRegistry.addCronJob(name, job);
    job.start();

    this.logger.warn(`job ${name} added every ${time} seconds!`);
  }

  stopCronJob(name: string) {
    const job = this.schedulerRegistry.getCronJob(name);
    job.stop();

    this.logger.warn(`job ${name} was stopped`);
  }

  deleteCronJob(name: string) {
    this.schedulerRegistry.deleteCronJob(name);

    this.logger.warn(`job ${name} was deleted`);
  }
}
