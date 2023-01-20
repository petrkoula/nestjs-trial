import { IsEmail, IsNotEmpty, MinLength } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class RegisterPayload {
  @ApiProperty({ required: true })
  @IsEmail()
  email: string

  @ApiProperty({ required: true })
  @IsNotEmpty()
  name: string

  @ApiProperty({ required: true })
  @MinLength(5)
  password: string
}
