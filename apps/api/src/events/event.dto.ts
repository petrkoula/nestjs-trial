import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class EventDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  id: Date

  @ApiProperty({ required: true })
  @IsNotEmpty()
  from: Date

  @ApiProperty({ required: true })
  @IsNotEmpty()
  till: Date

  @ApiProperty({ required: true })
  @IsNotEmpty()
  title: string

  @ApiProperty({ required: true })
  description: string
}
