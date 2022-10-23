import { JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';
import { Contact, ContactSchema } from './schema/contact.schema';
import { AuthGuard } from './auth/auth.guard';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Contact.name,
        useFactory: () => {
          const schema = ContactSchema;
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          schema.plugin(require('mongoose-paginate'));
          return schema;
        },
      },
    ]),
    UserModule,
  ],
  controllers: [ContactController],
  providers: [ContactService, JwtService, AuthGuard],
})
export class ContactModule {}
