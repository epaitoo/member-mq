import { Request, Response, Router } from 'express';

export class HomeRoute {
  router = Router();

  constructor() {
    this.setRoute();
  }

  private setRoute() {
    this.router.get('/', (_: Request, res: Response) => {
      res.json({
        message: 'Heyy there! Welcome 👋',
      });
    });
  }
}
