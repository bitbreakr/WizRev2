import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import * as stream from 'stream';
import { promisify } from 'util';
import * as fs from 'fs';
import { createReadStream } from 'fs';
import { JsonStreamParser } from './json-stream.parser';

const pipeline = promisify(stream.pipeline);

@Injectable()
export class IngestionService {
  private readonly logger = new Logger(IngestionService.name);

  public async downloadFile(url: string, outputPath: string): Promise<void> {
    const writer = fs.createWriteStream(outputPath);

    try {
      const response = await axios({
        method: 'GET',
        url: url,
        responseType: 'stream',
      });

      await pipeline(response.data, writer);
      this.logger.log(`Downloaded file from ${url} to ${outputPath}`);
    } catch (error) {
      this.logger.error(`Error downloading file: ${error.message}`);
      throw error;
    }
  }

  public async processJsonFiles<F>(
    fileUrls: string[],
    callback: (data: F[]) => void,
  ): Promise<void> {
    const tempFiles = [];

    try {
      // Download all files first
      for (let i = 0; i < fileUrls.length; i++) {
        try {
          const tempPath = `/tmp/json-file-${i}.json`;
          await this.downloadFile(fileUrls[i], tempPath);
          tempFiles.push(tempPath);
        } catch (error) {
          console.error(`Error downloading file: ${error.message}`);
        }
      }

      for (const filePath of tempFiles) {
        await this.processJsonFile(filePath, callback);
      }

      this.logger.log('Successfully processed all JSON files');
    } catch (error) {
      this.logger.error(`Error in processJsonFiles: ${error.message}`);
      throw error;
    } finally {
      for (const file of tempFiles) {
        try {
          fs.unlinkSync(file);
        } catch (e) {
          this.logger.warn(`Could not delete temp file ${file}: ${e.message}`);
        }
      }
    }
  }

  private async processJsonFile<F extends Record<string, any>>(
    filePath: string,
    callback: (data: F[]) => void,
  ): Promise<void> {
    const readStream = createReadStream(filePath, { encoding: 'utf8' });
    const jsonParser = new JsonStreamParser();

    return new Promise((resolve, reject) => {
      readStream
        .pipe(jsonParser)
        .on('data', async (item: F[]) => {
          try {
            callback(item);
          } catch (error) {
            this.logger.error(`Error processing item: ${error.message}`);
            readStream.destroy(error);
          }
        })
        .on('error', (error) => {
          this.logger.error(`Stream error: ${error.message}`);
          reject(error);
        })
        .on('end', async () => {
          this.logger.log(`Finished processing file: ${filePath}`);
          resolve();
        });
    });
  }
}
