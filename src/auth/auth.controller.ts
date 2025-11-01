import { All, Controller, Req, Res } from '@nestjs/common';
import { toNodeHandler } from 'better-auth/node';
import { type Request, type Response } from 'express';

import { Public } from './decorators/public.decorator';
import { AuthService } from './auth.service';

@Public()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @All('{*path}')
  async handleAll(@Req() req: Request, @Res() res: Response) {
    await toNodeHandler(this.authService.betterAuth)(req, res);
  }
}
