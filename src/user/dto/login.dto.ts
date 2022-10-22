import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'email of the user',
    example: 'vinod@gmail.com',
  })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'password of the user',
    example: '12345678',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(8)
  password: string;
  static email: any;
}
