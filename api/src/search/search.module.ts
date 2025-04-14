import { DynamicModule } from '@nestjs/common';
import { MeiliSearch } from 'meilisearch';
import { SearchService } from './search.service';

interface SearchModuleOptions {
  host: string;
  apiKey?: string;
}

// todo: implement API key
export class SearchModule {
  static register(options: SearchModuleOptions): DynamicModule {
    return {
      module: SearchModule,
      imports: [],
      providers: [
        SearchService,
        {
          provide: 'CLIENT',
          useValue: new MeiliSearch({
            host: options.host,
            apiKey: options.apiKey,
          }),
        },
      ],
      exports: [SearchService],
    };
  }
}
