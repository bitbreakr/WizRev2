import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UnprocessableEntityException,
} from '@nestjs/common';
import { GameService } from './game.service';
import { CreateGameRequest } from './create-game.request';
import { GameResponse } from './game.response';
import { PaginationQuery } from './pagination.query';
import { PaginatedGameResponse } from './paginated-game.response';
import { UpdateGameRequest } from './update-game.request';
import { QueryFailedError } from 'typeorm';
import { IngestionService } from '../ingestion/ingestion.service';
import { Top100Apps } from './types';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';

@Controller('games')
export class GameController {
  constructor(
    @InjectQueue('top-100')
    private readonly top100Queue: Queue<Array<[Top100Apps]>>,
    private readonly gameService: GameService,
    private readonly ingestionService: IngestionService,
  ) {}

  @Post()
  public async newGame(@Body() data: CreateGameRequest): Promise<GameResponse> {
    try {
      const game = await this.gameService.create(data);

      return new GameResponse(game);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        switch ((error as any).code) {
          case '23505':
            throw new ConflictException((error as any).detail);
        }
      }

      throw new InternalServerErrorException(error.message);
    }
  }

  @Get()
  public async getAllGames(
    @Query() query?: PaginationQuery,
  ): Promise<PaginatedGameResponse> {
    const page = await this.gameService.listAll(query);

    return new PaginatedGameResponse({
      count: page[1],
      data: page[0],
    });
  }

  @Patch(':id')
  public async updateGame(
    @Param('id') id: string,
    @Body() data: UpdateGameRequest,
  ): Promise<GameResponse> {
    try {
      const record = await this.gameService.update(id, data);

      return new GameResponse(record);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new UnprocessableEntityException(error.message);
      }

      throw error;
    }
  }

  @Delete(':id')
  public async deleteGame(@Param('id') id: string): Promise<void> {
    await this.gameService.delete(id);
  }

  @Put('populate')
  async processJsonFiles(): Promise<{ success: boolean; message: string }> {
    try {
      // Start processing in the background
      void this.ingestionService.processJsonFiles<[Top100Apps]>(
        [
          'https://interview-marketing-eng-dev.s3.eu-west-1.amazonaws.com/android.top100.json',
          'https://interview-marketing-eng-dev.s3.eu-west-1.amazonaws.com/ios.top100.json',
        ],
        (data) => this.top100Queue.add('', data),
      );

      return {
        success: true,
        message: 'JSON processing started successfully',
      };
    } catch (error) {
      console.error(`Error initiating JSON processing: ${error.message}`);
    }
  }
}
