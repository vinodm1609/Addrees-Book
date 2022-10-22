import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { IUser } from '../../user/interface/register.interface';

export class UpdateContactDTO {
  @ApiProperty({
    description: ' name of the contact person',
    example: 'anuj mishra',
  })
  @IsNotEmpty()
  @IsString()
  contactPerson: string;

  @ApiProperty({
    description: ' name of the contact person',
    example: 9987094262,
  })
  @IsNotEmpty()
  @IsNumber()
  contactNumber: number;

  user?: IUser;
}
