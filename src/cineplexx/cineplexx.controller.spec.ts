import { Test, TestingModule } from '@nestjs/testing';
import { CineplexxController } from './cineplexx.controller';

describe('CineplexxController', () => {
  let controller: CineplexxController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CineplexxController],
    }).compile();

    controller = module.get<CineplexxController>(CineplexxController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
