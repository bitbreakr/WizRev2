import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  RemoveEvent,
  UpdateEvent,
} from 'typeorm';
import { GameEntity } from './game.entity';
import { SearchService } from '../search/search.service';

@EventSubscriber()
export class GameIndexer implements EntitySubscriberInterface<GameEntity> {
  constructor(
    dataSource: DataSource,
    private readonly searchService: SearchService,
  ) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return GameEntity;
  }

  async afterInsert(event: InsertEvent<GameEntity>): Promise<void> {
    await this.searchService.indexDocument('games', event.entity);
  }

  async afterUpdate(event: UpdateEvent<GameEntity>): Promise<void> {
    await this.searchService.updateADocument('games', [event.entity]);
  }

  async afterRemove(event: RemoveEvent<GameEntity>): Promise<void> {
    await this.searchService.deleteDocument('games', event.entityId);
  }
}
