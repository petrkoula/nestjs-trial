import { ExtractJwt, JwtPayload, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { UserService } from '../../user/user.service'
import { ConfigService } from '../../common/config/config.service'
import { setUserContext } from '../user-context/user-context'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_SECRET_KEY'),
    })
  }

  async validate({ iat, exp, id }: JwtPayload, done) {
    const timeDiff = exp - iat
    if (timeDiff <= 0) {
      throw new UnauthorizedException()
    }

    const user = await this.userService.findOneByEmail(id)
    setUserContext(user)

    if (!user) {
      throw new UnauthorizedException()
    }

    done(null, user)
  }
}
