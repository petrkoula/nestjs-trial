import { Team } from './team.entity'
import { TeamDto } from './team.controller'

export const mapTeamToDto = (e: Team): TeamDto => ({
  id: e.id,
  name: e.name,
  voteCount: e.vote_count,
  createdAt: e.created_at,
})
