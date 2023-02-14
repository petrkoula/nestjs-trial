import supertest from 'supertest'
import * as request from 'supertest'
import { INestApplication } from '@nestjs/common'

type Req = supertest.SuperTest<supertest.Test>

export const register =
  (app: INestApplication) => (email: string, password: string) =>
    request(app.getHttpServer()).post('/auth/register').send({
      email,
      name: 'Test User',
      password,
    })

export const login =
  (app: INestApplication) => (email: string, password: string) =>
    request(app.getHttpServer()).post('/auth/login').send({ email, password })

export const requestAs =
  (app: INestApplication) =>
  async (
    email: string,
    password: string,
    action: (req: Req) => supertest.Test,
  ) => {
    const loginResponse = await login(app)(email, password)

    const req: Req = request(app.getHttpServer())
    return action(req).set({
      Authorization: `Bearer ${loginResponse.body.accessToken}`,
    })
  }
