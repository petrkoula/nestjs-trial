import { Global, Module } from '@nestjs/common'
import { HashService } from './security/hash.service'
import { ConfigService } from './config/config.service'

const configService = {
  provide: ConfigService,
  useValue: new ConfigService('.env'),
}

@Global()
@Module({
  exports: [ConfigService, HashService],
  providers: [
    HashService,
    configService,
  ],
})
export class CommonModule {
}
