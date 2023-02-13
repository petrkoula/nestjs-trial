import { RequestContext } from '@medibloc/nestjs-request-context'

export interface User {
  id: number
  name: string
  email: string
}

export class UserContext extends RequestContext {
  user: User
}

export function setUserContext(user: User) {
  const context: UserContext = RequestContext.get()
  context.user = {
    id: user.id,
    name: user.name,
    email: user.email,
  }
}
