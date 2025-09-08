import { Body, Controller, Post } from '@nestjs/common';
import { CreateCustomerDto } from '../common/types/customers';
import { CustomersService } from './customers.service';
import { CustomerEntity } from './entities/customer.entity';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  create(
    @Body() createCustomerDto: CreateCustomerDto,
  ): Promise<CustomerEntity> {
    return this.customersService.create(createCustomerDto);
  }
}
