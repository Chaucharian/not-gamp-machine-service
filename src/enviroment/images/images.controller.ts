import { Body, Controller, Get, Res, Post } from '@nestjs/common';
import { Response } from 'express';
import { ImagesService } from './images.service';

@Controller()
export class ImagesController {
  constructor(private imageService: ImagesService) {}

  @Get('/')
  getAllStatus(@Res() res: Response) {
    return res.send({ ok: 'images' });
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
}
