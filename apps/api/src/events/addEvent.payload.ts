import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class AddEventPayload {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  from: Date

  @ApiProperty({ required: true })
  @IsNotEmpty()
  till: Date

  @ApiProperty({ required: true })
  @IsNotEmpty()
  title: string
  description?: string
}
