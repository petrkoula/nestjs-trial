import { Controller, Get, Param, Put, Query, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { AuthGuard } from '@nestjs/passport'
import { TeamService } from './team.service'

export class TeamDto {
  id: number
  name: string
  voteCount: number
  createdAt: Date
}

@ApiTags('teams')
@ApiBearerAuth()
@Controller('teams')
export class TeamController {
  constructor(private readonly teamService: TeamService) {
  }


  @Get('/:name')
  async getTest(
    @Param('name') name: string,
  ): Promise<TeamDto | undefined> {
    return this.teamService.findOneByName(name)
  }

  @Put('/:name/vote')
  @UseGuards(AuthGuard())
  async vote(
    @Param('name') name: string,
  ): Promise<{}> {
    await this.teamService.createOrIncrementByName(name)
    return {}
  }
}
