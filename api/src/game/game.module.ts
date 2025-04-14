import { Module, OnModuleInit } from '@nestjs/common';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameEntity } from './game.entity';
import { SearchModule } from '../search/search.module';
import { SearchService } from '../search/search.service';
import { GameIndexer } from './game.indexer';
import { IngestionModule } from '../ingestion/ingestion.module';
import { Top100Processor } from './top-100.processor';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    TypeOrmModule.forFeature([GameEntity]),
    SearchModule.register({
      host: 'localhost:7700',
      apiKey: 'wizGj762Kja98UxzPqLm53sBn45DfR',
    }),
    BullModule.registerQueue({
      name: 'top-100',
    }),
    IngestionModule,
  ],
  controllers: [GameController],
  providers: [GameService, GameIndexer, Top100Processor],
  exports: [GameService],
})
export class GameModule implements OnModuleInit {
  constructor(private readonly searchService: SearchService) {}

  public async onModuleInit() {
    await this.searchService.createIndex('games', 'id', {
      displayedAttributes: [
        'id',
        'publisherId',
        'name',
        'bundleId',
        'platform',
        'storeId',
        'appVersion',
        'isPublished',
      ],
      searchableAttributes: ['name', 'bundleId', 'platform'],
      filterableAttributes: ['isPublished', 'platform', 'publisherId'],
      sortableAttributes: ['name'],
      rankingRules: [
        'words',
        'typo',
        'proximity',
        'attribute',
        'sort',
        'exactness',
      ],
      stopWords: [],
      nonSeparatorTokens: [],
      separatorTokens: [],
      dictionary: [],
      synonyms: {},
      distinctAttribute: null,
      proximityPrecision: 'byWord',
      typoTolerance: {
        enabled: true,
        minWordSizeForTypos: {
          oneTypo: 5,
          twoTypos: 9,
        },
        disableOnWords: [],
        disableOnAttributes: [],
      },
      faceting: {
        maxValuesPerFacet: 100,
        sortFacetValuesBy: {
          '*': 'alpha',
        },
      },
      pagination: {
        maxTotalHits: 1000,
      },
      embedders: {},
      searchCutoffMs: null,
      localizedAttributes: null,
      facetSearch: true,
      prefixSearch: 'indexingTime',
    });
  }
}
