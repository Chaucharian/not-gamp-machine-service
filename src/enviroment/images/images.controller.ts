import { Body, Controller, Get, Res, Post } from '@nestjs/common';
import { Response } from 'express';
import { ImagesService } from './images.service';

const getHourInMilisecond = (hours) => 1000 * 60 * 60 * hours;

@Controller()
export class ImagesController {
  constructor(private imageService: ImagesService) {}

  @Get('/status')
  getAllStatus(@Res() res: Response) {
    return res.send({ photoInterval: 3000 });
  }

  @Get('/streaming')
  getStreamingStatus(@Res() res: Response, @Body() payload: any) {
    return res.send({ image: this.imageService.getImage() });
  }

  @Post('/streaming')
  uploadImage(@Res() res: Response, @Body() payload: any) {
    this.imageService.setImage(payload.image);
    return res.send({ ok: 'image upload' });
  }

  @Get('/timelapse')
  async getTimeLapse(
    @Res() res: Response,
    @Body() payload: any = { from: '', to: '' },
  ) {
    const { from, to } = payload;
    const response = await this.imageService.getTimeLapse(
      '2022-04-11T22:36:05',
      '2022-04-11T22:36:06',
    );
    return res.send({ video: response });
  }
}
