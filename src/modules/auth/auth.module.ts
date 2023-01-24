import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { UserModule } from '../user/user.module'
import { CommonModule } from '../common/common.module'
import { AuthService } from './auth.service'
import { ConfigService } from '../common/config/config.service'
import { JwtModule } from '@nestjs/jwt'
import { JwtModuleAsyncOptions } from '@nestjs/jwt/dist/interfaces/jwt-module-options.interface'

const jwtModuleOptions: JwtModuleAsyncOptions = {
  imports: [CommonModule],
  useFactory: async (configService: ConfigService) => {
    const expirationSeconds = Number(configService.get('JWT_EXPIRATION_SECONDS'))
    const secret = configService.get('JWT_SECRET_KEY')
    return {
      secret: secret,
      signOptions: {
        expiresIn: Number(expirationSeconds),
      },
    }
  },
  inject: [ConfigService],
}

@Module({
  imports: [
    CommonModule,
    UserModule,
    JwtModule.registerAsync(jwtModuleOptions),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {
}
