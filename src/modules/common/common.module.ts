import { Global, Module } from '@nestjs/common'
import { ConfigService } from './config/config.service'

const configService = {
  provide: ConfigService,
  useValue: new ConfigService('.env'),
}

@Global()
@Module({
  exports: [ConfigService],
  providers: [configService],
})
export class CommonModule {}
