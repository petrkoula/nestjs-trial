import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TeamService } from './team.service'
import { Team } from './team.entity'
import { Repository } from 'typeorm'
import { CommonModule } from '../common/common.module'
import { AuthModule } from '../auth/auth.module'
import { TeamController } from './team.controller'

@Module({
  imports: [
    CommonModule,
    TypeOrmModule.forFeature([Team]),
    AuthModule,
  ],
  controllers: [TeamController],
  providers: [TeamService, Repository<Team>],
  exports: [TeamService, Repository<Team>],
})
export class TeamModule {
}
