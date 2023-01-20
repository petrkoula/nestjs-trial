import { IsEmail, IsNotEmpty, MinLength } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class LoginPayload {
  @ApiProperty({ required: true })
  @IsEmail()
  email: string

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @MinLength(5)
  password: string
}
