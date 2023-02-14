import { Global, Module } from '@nestjs/common'
import { HashService } from './security/hash.service'
import { ConfigService } from '@nestjs/config'

const configService = {
  provide: ConfigService,
  useValue: new ConfigService(),
}

@Global()
@Module({
  exports: [ConfigService, HashService],
  providers: [HashService, configService],
})
export class CommonModule {}
