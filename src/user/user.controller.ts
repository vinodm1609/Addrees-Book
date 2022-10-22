import { LoginDto } from './dto/login.dto';
import { Body, Controller, Header, Post, ValidationPipe } from '@nestjs/common';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { SwaggerConstant } from '../constant/swagger.constant';
import { CreateRegisterDto } from './dto/register.dto';
import { User } from './schema/user.schema';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('register')
  @ApiBody({ type: CreateRegisterDto, required: true })
  @Header(SwaggerConstant.ContentType, SwaggerConstant.ApplicationJson)
  @ApiResponse({ status: 201, description: ' user  created successfully' })
  @ApiResponse({ status: 400, description: SwaggerConstant.BadRequest })
  @ApiResponse({ status: 401, description: SwaggerConstant.Unauthorized })
  @ApiResponse({ status: 403, description: SwaggerConstant.Forbidden })
  @ApiResponse({ status: 415, description: SwaggerConstant.InvalidContentType })
  @ApiResponse({ status: 500, description: SwaggerConstant.SomethingWentWrong })
  async register(@Body() createRegisterDto: CreateRegisterDto): Promise<User> {
    return this.userService.register(createRegisterDto);
  }

  @Post('login')
  @ApiBody({ type: LoginDto, required: true })
  @Header(SwaggerConstant.ContentType, SwaggerConstant.ApplicationJson)
  @ApiResponse({ status: 201, description: ' user  created successfully' })
  @ApiResponse({ status: 400, description: SwaggerConstant.BadRequest })
  @ApiResponse({ status: 401, description: SwaggerConstant.Unauthorized })
  @ApiResponse({ status: 403, description: SwaggerConstant.Forbidden })
  @ApiResponse({ status: 415, description: SwaggerConstant.InvalidContentType })
  @ApiResponse({ status: 500, description: SwaggerConstant.SomethingWentWrong })
  async login(@Body(ValidationPipe) loginDto: LoginDto): Promise<any> {
    return this.userService.login(loginDto);
  }
}
