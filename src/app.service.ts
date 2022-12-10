import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getAppStatus(): string {
    return `Server is running! 🚀\n\nPlease check ${
      process.env.NODE_ENV === 'production'
        ? process.env.PRODUCTION_URL
        : 'http://localhost:3333/api'
    } for Swagger documentation.`;
  }
}
