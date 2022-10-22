import { AuthGuard } from './auth/auth.guard';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Header,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { SwaggerConstant } from '../constant/swagger.constant';
import { ContactService } from './contact.service';
import { ContactDto } from './dto/addContacts.dto';
import { Contact } from './schema/contact.schema';
import { UpdateContactDTO } from './dto/updateContact.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@UseGuards(AuthGuard)
@ApiBearerAuth()
@Controller('contact')
export class ContactController {
  constructor(private contactServices: ContactService) {}

  @ApiBody({ type: ContactDto, required: true })
  @Header(SwaggerConstant.ContentType, SwaggerConstant.ApplicationJson)
  @ApiResponse({ status: 201, description: ' contact add  Successfully ' })
  @ApiResponse({ status: 400, description: SwaggerConstant.BadRequest })
  @ApiResponse({ status: 401, description: SwaggerConstant.Unauthorized })
  @ApiResponse({ status: 403, description: SwaggerConstant.Forbidden })
  @ApiResponse({ status: 415, description: SwaggerConstant.InvalidContentType })
  @ApiResponse({ status: 500, description: SwaggerConstant.SomethingWentWrong })
  @Post()

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async addContact(
    @Body() addContactDto: ContactDto,
    @Req() request,
  ): Promise<Contact> {
    return this.contactServices.addContact(addContactDto, request.user);
  }

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @Header('Content-Type', 'multipart/form-data')
  @ApiResponse({
    status: 201,
    description: ' contact Created ',
  })
  @ApiResponse({ status: 400, description: SwaggerConstant.BadRequest })
  @ApiResponse({ status: 401, description: SwaggerConstant.Unauthorized })
  @ApiResponse({ status: 403, description: SwaggerConstant.Forbidden })
  @ApiResponse({ status: 415, description: SwaggerConstant.InvalidContentType })
  @ApiResponse({ status: 500, description: SwaggerConstant.SomethingWentWrong })
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: (req, file, callback) => {
        if (!file) {
          callback(new NotFoundException('File Not found'), false);
        }
        if (file.mimetype.includes('csv')) {
          callback(null, true);
        } else {
          callback(
            new BadRequestException('Please upload only csv file'),
            false,
          );
        }
      },
    }),
  )
  @Post('uploadFile')
  async UploadContact(
    @UploadedFile() file: Express.Multer.File,
    @Req() request,
  ): Promise<Contact[]> {
    return this.contactServices.uploadContact(request.user._id, file);
  }

  @Header(SwaggerConstant.ContentType, SwaggerConstant.ApplicationJson)
  @ApiResponse({
    status: 201,
    description: ' contact find by pagination  Successfully ',
  })
  @ApiResponse({ status: 400, description: SwaggerConstant.BadRequest })
  @ApiResponse({ status: 401, description: SwaggerConstant.Unauthorized })
  @ApiResponse({ status: 403, description: SwaggerConstant.Forbidden })
  @ApiResponse({ status: 415, description: SwaggerConstant.InvalidContentType })
  @ApiResponse({ status: 500, description: SwaggerConstant.SomethingWentWrong })
  @ApiQuery({
    name: 'limit',
    type: Number,
    required: false,
    description: 'limit of contact add in one page',
  })
  @ApiQuery({
    name: 'page',
    type: Number,
    required: false,
    description: 'page number of get contact',
  })
  @Get()
  async findCOntactPagination(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Req() request,
  ) {
    return this.contactServices.findCOntactPagination(
      page ? page : 1,
      limit ? limit : 5,
      request.user,
    );
  }

  @ApiQuery({ name: 'key' })
  @Header(SwaggerConstant.ContentType, SwaggerConstant.ApplicationJson)
  @ApiResponse({ status: 201, description: 'contact match Successfully ' })
  @ApiResponse({ status: 400, description: SwaggerConstant.BadRequest })
  @ApiResponse({ status: 401, description: SwaggerConstant.Unauthorized })
  @ApiResponse({ status: 403, description: SwaggerConstant.Forbidden })
  @ApiResponse({ status: 415, description: SwaggerConstant.InvalidContentType })
  @ApiResponse({ status: 500, description: SwaggerConstant.SomethingWentWrong })
  @Get('/find')
  async searchContact(@Query('key') search: string, @Req() request) {
    return this.contactServices.searchContact(search, request.user);
  }

  @ApiParam({ name: 'id' })
  @Header(SwaggerConstant.ContentType, SwaggerConstant.ApplicationJson)
  @ApiResponse({ status: 201, description: 'contact find by Id Successfully ' })
  @ApiResponse({ status: 400, description: SwaggerConstant.BadRequest })
  @ApiResponse({ status: 401, description: SwaggerConstant.Unauthorized })
  @ApiResponse({ status: 403, description: SwaggerConstant.Forbidden })
  @ApiResponse({ status: 415, description: SwaggerConstant.InvalidContentType })
  @ApiResponse({ status: 500, description: SwaggerConstant.SomethingWentWrong })
  @Get('/:id')
  async getById(@Param('id') id: string) {
    return this.contactServices.findById(id);
  }

  @ApiParam({ name: 'id' })
  @Header(SwaggerConstant.ContentType, SwaggerConstant.ApplicationJson)
  @ApiResponse({ status: 201, description: ' contact Update Successfully ' })
  @ApiResponse({ status: 400, description: SwaggerConstant.BadRequest })
  @ApiResponse({ status: 401, description: SwaggerConstant.Unauthorized })
  @ApiResponse({ status: 403, description: SwaggerConstant.Forbidden })
  @ApiResponse({ status: 415, description: SwaggerConstant.InvalidContentType })
  @ApiResponse({ status: 500, description: SwaggerConstant.SomethingWentWrong })
  @Put(':id')
  async updateContact(
    @Param('id') id: string,
    @Body() updateContactDTO: UpdateContactDTO,
    @Req() request,
  ) {
    return this.contactServices.updateContact(
      updateContactDTO,
      id,
      request.user,
    );
  }

  @ApiParam({ name: 'id' })
  @Header(SwaggerConstant.ContentType, SwaggerConstant.ApplicationJson)
  @ApiResponse({ status: 201, description: ' contact Deleted Successfully ' })
  @ApiResponse({ status: 400, description: SwaggerConstant.BadRequest })
  @ApiResponse({ status: 401, description: SwaggerConstant.Unauthorized })
  @ApiResponse({ status: 403, description: SwaggerConstant.Forbidden })
  @ApiResponse({ status: 415, description: SwaggerConstant.InvalidContentType })
  @ApiResponse({ status: 500, description: SwaggerConstant.SomethingWentWrong })
  @Delete('/:id')
  async deleteContact(@Param('id') id: string, @Req() request) {
    return this.contactServices.deleteContact(id, request.user);
  }
}
