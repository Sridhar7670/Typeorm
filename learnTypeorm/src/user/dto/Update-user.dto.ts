import { PartialType } from "@nestjs/mapped-types";
import { CreateUserDto } from "./Create-user.dto";

export class UpdateUSerDto extends PartialType(CreateUserDto){}