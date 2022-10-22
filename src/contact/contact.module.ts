import { JwtService } from '@nestjs/jwt';
import { UserService } from './../user/user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';
import { Contact, ContactSchema } from './schema/contact.schema';
import { AuthGuard } from './auth/auth.guard';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Contact.name, schema: ContactSchema }]),
    UserModule,
  ],
  controllers: [ContactController],
  providers: [ContactService, JwtService, AuthGuard],
})
export class ContactModule {}
