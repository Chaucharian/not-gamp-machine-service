import { Injectable } from '@nestjs/common';

@Injectable()
export class ImagesService {
  getHello(): string {
    return 'Hello World!';
  }
}
