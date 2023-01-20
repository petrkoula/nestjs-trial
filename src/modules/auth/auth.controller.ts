import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common'
import { UserService } from '../user/user.service'
import { RegisterPayload } from './register.payload'
import { LoginPayload } from './login.payload'
import { AuthService } from './auth.service'
import { Response } from 'express'
import { User } from '../user/user.entity'
import { ApiOperation } from '@nestjs/swagger'

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @ApiOperation({ summary: 'Register new user' })
  @Post('register')
  async register(
    @Body() payload: RegisterPayload,
    @Res({ passthrough: true }) res: Response,
  ): Promise<User> {
    const user = await this.userService.create(payload)
    if (!user) {
      res.status(HttpStatus.CONFLICT)
      return
    } else {
      return user
    }
  }

  @ApiOperation({ summary: 'Login user' })
  @Post('login')
  async login(
    @Body() payload: LoginPayload,
    @Res({ passthrough: true }) res,
  ): Promise<void> {
    const isAuthenticated = await this.authService.isAuthenticated(
      payload.email,
      payload.password,
    )
    if (!isAuthenticated) {
      res.status(HttpStatus.UNAUTHORIZED)
    }

    return
  }
}
