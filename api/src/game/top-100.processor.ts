import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { GameService } from './game.service';
import { Game, Top100Apps } from './types';

@Processor('top-100')
export class Top100Processor extends WorkerHost {
  constructor(private readonly gameService: GameService) {
    super();
  }

  public async process(
    job: Job<Array<[Top100Apps]>>,
    _: string | undefined,
  ): Promise<void> {
    await this.gameService.batchInsert(
      job.data.flat().map<Omit<Game, 'id'>>((cursor) => ({
        name: cursor.name,
        platform: cursor.os,
        storeId: String(cursor.app_id),
        publisherId: String(cursor.publisher_id),
        bundleId: cursor.bundle_id,
        appVersion: cursor.version,
        isPublished: true,
      })),
    );
  }
}
