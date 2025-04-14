import { Injectable, Inject } from '@nestjs/common';
import { MeiliSearch, Settings } from 'meilisearch';

@Injectable()
export class SearchService {
  constructor(@Inject('CLIENT') private client: MeiliSearch) {}

  async createIndex(
    name: string,
    primaryKey: string,
    settings?: Settings,
  ): Promise<void> {
    try {
      const indexes = (await this.client.getIndexes()).results.map(
        (record) => record.uid,
      );

      if (indexes.includes(name)) {
        return void 0;
      }

      await this.client.createIndex(name, { primaryKey });

      if (settings) {
        await this.client.index(name).updateSettings(settings);
      }

      return void 0;
    } catch (error) {
      console.log(error);
      throw new Error('An error occured listing indexes');
    }
  }

  async indexDocument(index: string, data: any): Promise<void> {
    try {
      await this.client.index(index).addDocuments([data]);

      return void 0;
    } catch {
      console.log('An error occured indexing a document');
    }
  }

  async indexDocuments(index: string, data: any[]): Promise<void> {
    try {
      await this.client.index(index).addDocuments(data);

      return void 0;
    } catch {
      console.log('An error occured indexing some documents');
    }
  }

  async updateADocument(index: string, data: any): Promise<void> {
    try {
      await this.client.index(index).updateDocuments([...data]);

      return void 0;
    } catch (error) {
      console.log('An error occured updating the document', error);
    }
  }

  async deleteDocument(index: string, documentId: string): Promise<void> {
    try {
      await this.client.index(index).deleteDocument(documentId);

      return void 0;
    } catch {
      console.log('An error occured deleting a document');
    }
  }
}
