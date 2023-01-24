import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common'
import { UserService } from '../user/user.service'
import { RegisterPayload } from './register.payload'
import { LoginPayload } from './login.payload'
import { AuthService } from './auth.service'
import { Response } from 'express'
import { User } from '../user/user.entity'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'
import { JwtToken } from './types'

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {
  }

  @ApiOperation({ summary: 'Register new user' })
  @ApiResponse({ status: 201, description: 'Successful Registration' })
  @ApiResponse({ status: 409, description: 'User email already registered' })
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
  @ApiResponse({ status: 201, description: 'Successful Registration' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Post('login')
  async login(
    @Body() payload: LoginPayload,
    @Res({ passthrough: true }) res,
  ): Promise<JwtToken | {}> {
    const token = await this.authService.authenticate(
      payload.email,
      payload.password,
    )

    if (!token) {
      res.status(HttpStatus.UNAUTHORIZED)
      return {}
    }

    return token
  }
}
