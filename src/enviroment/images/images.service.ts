import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const ImageKit = require('imagekit');
@Injectable()
export class ImagesService {
  private streaming = { status: 'off', image: '' };
  private imagekit;
  constructor(private configService: ConfigService) {
    this.imagekit = new ImageKit({
      publicKey: this.configService.get('imagekit').publicKey,
      privateKey: this.configService.get('imagekit').privateKey,
      urlEndpoint: this.configService.get('imagekit').urlEndpoint,
    });
  }
  getStreamingStatus(): any {
    return this.streaming;
  }

  setStreamingStatus(status: string): void {
    this.streaming.status = status;
  }

  async setImage(image) {
    const cameraId = '1';
    await this.imagekit.upload({
      file: image, //required
      fileName: cameraId, //required
    });
    this.streaming.image = image;
  }

  getImage() {
    return this.streaming.image;
  }

  getTimeLapse(from, to) {
    return this.imagekit
      .listFiles({
        skip: 10,
        limit: 10,
        searchQuery: `createdAt < "${to}"`,
      })
      .then((response) => {
        console.log(response);
        return response;
      })
      .catch((error) => {
        console.log(error);
      });
  }
}
