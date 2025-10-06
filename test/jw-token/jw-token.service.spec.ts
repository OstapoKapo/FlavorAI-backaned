import { Test, TestingModule } from '@nestjs/testing';
import { JwTokenService } from '../../src/modules/jw-token/jw-token.service';

describe('JwTokenService', () => {
  let service: JwTokenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JwTokenService],
    }).compile();

    service = module.get<JwTokenService>(JwTokenService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
