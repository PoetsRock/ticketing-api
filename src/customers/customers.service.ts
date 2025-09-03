import { Injectable } from '@nestjs/common';
import { v4 as uuidV4 } from 'uuid';
import {
  CreateCustomerDto,
  UpdateCustomerDto,
} from '../common/types/customers';
import { PrismaService } from '../prisma/prisma.service';
import { CustomerEntity } from './entities/customer.entity';

@Injectable()
export class CustomersService {
  public constructor(private readonly prisma: PrismaService) {}

  public async create(
    createCustomerDto: CreateCustomerDto,
  ): Promise<CustomerEntity> {
    const timestamp = new Date();
    const customer = await this.prisma.customer.create({
      data: <CustomerEntity>{
        ...createCustomerDto,
        id: uuidV4(),
        createdAt: timestamp,
        modifiedAt: timestamp,
      },
    });
    console.log('new customer created:\n', customer);
    return customer;
  }

  findAll() {
    return `This action returns all customers`;
  }

  findOne(id: number) {
    return `This action returns a #${id} customer`;
  }

  update(id: number, updateCustomerDto: UpdateCustomerDto) {
    return `This action updates a #${id} customer`;
  }

  remove(id: number) {
    return `This action removes a #${id} customer`;
  }
}
