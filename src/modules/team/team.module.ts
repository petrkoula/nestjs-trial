import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TeamService } from './team.service'
import { Team } from './team.entity'
import { Repository } from 'typeorm'
import { CommonModule } from '../common/common.module'
import { AuthModule } from '../auth/auth.module'

@Module({
  imports: [
    CommonModule,
    TypeOrmModule.forFeature([Team]),
    AuthModule,
  ],
  exports: [TeamService, Repository<Team>],
  providers: [TeamService, Repository<Team>],
})
export class TeamModule {
}
