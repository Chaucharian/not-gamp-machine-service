import { applyDecorators, UseGuards } from '@nestjs/common';
import { ClientGuard } from 'src/auth/guards/client.guard';

export const UseAuth = () => {
  const decorators = [UseGuards(ClientGuard)];

  return applyDecorators(...decorators);
};
