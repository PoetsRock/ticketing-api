import { Test, TestingModule } from '@nestjs/testing';
import { RedisExpirationSubscriber } from './redis-expiration.subscriber';

describe('RedisService', () => {
  let service: RedisExpirationSubscriber;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RedisExpirationSubscriber],
    }).compile();

    service = module.get<RedisExpirationSubscriber>(RedisExpirationSubscriber);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
