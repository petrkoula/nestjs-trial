import { Controller, Get } from '@nestjs/common'
import { TeamService } from './team.service'
import { ApiTags } from '@nestjs/swagger'

export class TeamDto {
  id: number
  name: string
  voteCount: number
  createdAt: Date
}

@ApiTags('public')
@Controller('public')
export class TeamPublicController {
  constructor(private readonly teamService: TeamService) {}

  @Get('/leaderboard')
  async leaderboard(): Promise<TeamDto[]> {
    return await this.teamService.getLeaders(10)
  }
}
