import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { User } from './user.entity'
import { HashService } from '../common/security/hash.service'

type CreateUserFields = { email: string; name: string; password: string }

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly hashService: HashService,
  ) {}

  async findOneByEmail(email: string): Promise<User> {
    return await this.userRepository.findOneBy({ email })
  }

  async create(user: CreateUserFields): Promise<User | null> {
    const existingUser = await this.userRepository.findOneBy({
      email: user.email,
    })
    if (existingUser) {
      return null
    }

    const newUser = {
      email: user.email,
      name: user.name,
      password_hash: this.hashService.hash(user.password),
    }

    return await this.userRepository.save(newUser)
  }
}
