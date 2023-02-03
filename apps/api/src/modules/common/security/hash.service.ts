import * as bcrypt from 'bcrypt'
import { Injectable } from '@nestjs/common'

@Injectable()
export class HashService {
  hash(password: string) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync())
  }

  compare(password: string, hash: string) {
    return bcrypt.compareSync(password, hash)
  }
}
