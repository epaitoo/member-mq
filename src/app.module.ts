import { Module } from '@nestjs/common';
import { appConfig } from './config/app';

@Module(appConfig)
export class AppModule {}
