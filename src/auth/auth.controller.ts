import { All, Body, Controller, Post, Req, Res } from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { toNodeHandler } from 'better-auth/node';
import { type Request, type Response } from 'express';

import { Public } from '../decorators/public.decorator';
import { AuthService } from './auth.service';
import { PhoneSignInDto } from './dto/phone-sign-in.dto';

@Public()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiExcludeEndpoint()
  @All('{*path}')
  async handleAll(@Req() req: Request, @Res() res: Response) {
    await toNodeHandler(this.authService.betterAuth)(req, res);
  }

  // This endpoint is for Swagger authentication only
  // In practice, all /auth endpoints (including this one) are handled by the catch-all route above
  @Post('/sign-in/phone-number')
  async signInPhoneNumber(
    @Req() req: Request,
    @Res() res: Response,
    @Body() _: PhoneSignInDto,
  ) {
    await toNodeHandler(this.authService.betterAuth)(req, res);
  }
}
