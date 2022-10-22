import { User } from 'src/user/schema/user.schema';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ContactDto {
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

  user?: User;
}
