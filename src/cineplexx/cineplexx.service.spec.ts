import { Test, TestingModule } from '@nestjs/testing';
import { CineplexxService } from './cineplexx.service';

describe('CineplexxService', () => {
  let service: CineplexxService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CineplexxService],
    }).compile();

    service = module.get<CineplexxService>(CineplexxService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
