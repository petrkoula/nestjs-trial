import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm'
import { AuthController } from './modules/auth/auth.controller'
import { AuthModule } from './modules/auth/auth.module'
import { UserModule } from './modules/user/user.module'
import { EventModule } from './events/event.module'
import { EventController } from './events/event.controller'
import { AppController } from './app.controller'
import { AppService } from './app.service'

export const databaseFactory = (configService: ConfigService) => {
  return {
    type: 'postgres',
    host: configService.get('DB_HOST'),
    port: configService.get('DB_PORT'),
    username: configService.get('DB_USERNAME'),
    password: configService.get('DB_PASSWORD'),
    database: configService.get('DB_DATABASE'),
    entities: [__dirname + './../**/**.entity{.ts,.js}'],
    synchronize: 'false',
  } as TypeOrmModuleAsyncOptions
}

@Module({
  imports: [
    ConfigModule.forRoot(),
    AppModule,
    AuthModule,
    UserModule,
    EventModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: databaseFactory,
    }),
  ],
  controllers: [AppController, AuthController, EventController],
  providers: [AppService],
})
export class AppModule {
}
