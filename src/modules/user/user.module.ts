import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './user.entity'
import { UserService } from './user.service'
import { CommonModule } from '../common/common.module'

@Module({
  imports: [CommonModule, TypeOrmModule.forFeature([User])],
  exports: [UserService],
  providers: [UserService],
})
export class UserModule {}
