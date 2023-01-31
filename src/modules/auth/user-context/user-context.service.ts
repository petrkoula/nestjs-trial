import { Injectable } from '@nestjs/common'
import { UserContext } from './user-context'
import { RequestContext } from '@medibloc/nestjs-request-context'

@Injectable()
export class UserContextService {
  getContext = (): UserContext => RequestContext.get()
}
