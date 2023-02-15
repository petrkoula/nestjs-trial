import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiProperty, ApiTags } from '@nestjs/swagger'
import { AuthGuard } from '@nestjs/passport'
import { TeamService } from './team.service'
import { IsNotEmpty } from 'class-validator'

export class TeamDto {
  id: number
  name: string
  voteCount: number
  createdAt: Date
}

class TeamVotePayload {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  name: string
}

@ApiTags('teams')
@ApiBearerAuth()
@Controller('teams')
export class TeamController {
  constructor(private readonly teamService: TeamService) {
  }

  @Get('/:name')
  async getTest(@Param('name') name: string): Promise<TeamDto | undefined> {
    return this.teamService.findOneByName(name)
  }


  @Post('/vote')
  @UseGuards(AuthGuard())
  async vote(@Body() payload: TeamVotePayload): Promise<{}> {
    await this.teamService.createOrIncrementByName(payload.name)
    return {}
  }
}
