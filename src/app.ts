require('dotenv').config();
import express from 'express';
import * as dotenv from 'dotenv';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import { HomeRoute } from './routes/home.route';

class App {
  app: express.Application;

  constructor() {
    this.app = express();
    this.setConfig;
    this.setRoutes();
  }

  private setConfig(): void {
    dotenv.config();
    if (process.env.NODE_ENV === 'development') {
      this.app.use(morgan('dev'));
    }

    // Allows us to receive requests with data in json format
    this.app.use(express.json({ limit: '50mb' }));
    // Allows us to receive requests with data in x-www-form-urlencoded format
    this.app.use(express.urlencoded({ limit: '50mb', extended: true }));
    // Enables Helmet
    this.app.use(helmet());
    // Enables cors
    this.app.use(cors());
  }

  private setRoutes(): void {
    const home = new HomeRoute().router;

    //Home Route
    this.app.use('/', home);
  }
}

export default new App().app;
