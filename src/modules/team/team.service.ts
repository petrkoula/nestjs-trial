import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Team } from './team.entity'
import { UserContextService } from '../auth/user-context/user-context.service'
import { TeamDto } from './team.controller'
import { mapTeamToDto } from './mappers'

@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
    private readonly userContextService: UserContextService,
  ) {
  }

  async createOrIncrementByName(teamName: string): Promise<void> {
    const userId = this.userContextService.getContext().user.id

    const team = await this.teamRepository.findOneBy({ name: teamName })
    if (team) {
      await this.teamRepository.increment({ name: teamName }, 'vote_count', 1)
    } else {
      await this.teamRepository.save({ name: teamName, vote_count: 1, user_id: userId })
    }
  }

  async findOneByName(teamName: string): Promise<TeamDto | undefined> {
    let team = await this.teamRepository.findOneBy({ name: teamName })
    return !team ? undefined : mapTeamToDto(team)
  }
}
