import { Injectable } from '@nestjs/common';

@Injectable()
export class ImagesService {
  private streaming = { status: 'off', image: '' };

  getStreamingStatus(): any {
    return this.streaming;
  }

  setStreamingStatus(status: string): void {
    this.streaming.status = status;
  }

  setImage(image) {
    this.streaming.image = image;
  }
  getImage() {
    return this.streaming.image;
  }
}
