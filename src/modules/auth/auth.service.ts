import { Injectable } from '@nestjs/common'
import { HashService } from '../common/security/hash.service'
import { UserService } from '../user/user.service'

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly hashService: HashService,
  ) {}

  async isAuthenticated(email: string, password: string): Promise<boolean> {
    const user = await this.userService.findOneByEmail(email)
    if (!user) {
      return false
    }

    return this.hashService.compare(password, user.password_hash)
  }
}
