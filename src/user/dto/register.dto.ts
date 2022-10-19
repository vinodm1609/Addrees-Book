import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateRegisterDto {
  @ApiProperty({
    description: 'name of the User',
    example: 'vinod',
  })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({
    description: 'lastName of the user',
    example: 'Mishra',
  })
  @IsNotEmpty()
  @IsString()
  lastName: string;

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
    example: '123456',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(8)
  password: string;

  @ApiProperty({
    description: 'Match the password of the user',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(8)
  confirmPassword: string;
}
