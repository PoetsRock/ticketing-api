import { PartialType } from '@nestjs/mapped-types';

export class CreateCustomerDto {
  firstName?: string;
  lastName?: string;
}

export class UpdateCustomerDto extends PartialType(CreateCustomerDto) {}
