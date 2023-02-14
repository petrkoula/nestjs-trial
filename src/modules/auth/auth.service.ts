import { Injectable } from '@nestjs/common'
import { HashService } from '../common/security/hash.service'
import { UserService } from '../user/user.service'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'

interface JwtToken {
  expiresIn: number
  accessToken: string
}

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly hashService: HashService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async authenticate(
    email: string,
    password: string,
  ): Promise<JwtToken | null> {
    const user = await this.userService.findOneByEmail(email)
    if (!user) {
      return null
    }

    if (!this.hashService.compare(password, user.password_hash)) {
      return null
    }

    return this.createToken(email)
  }

  private createToken(email: string): JwtToken {
    const expiresIn = Number(this.configService.get('JWT_EXPIRATION_SECONDS'))
    const accessToken = this.jwtService.sign({ email })

    return { expiresIn, accessToken }
  }
}
