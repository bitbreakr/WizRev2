import { Injectable, NotFoundException } from '@nestjs/common';
import { GameEntity } from './game.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Game, Pagination } from './types';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(GameEntity)
    private readonly gameRepository: Repository<GameEntity>,
  ) {}

  public async create(date: Omit<Game, 'id'>): Promise<Game> {
    return await this.gameRepository.save(date);
  }

  public async update(
    id: string,
    dataToSet: Partial<Omit<Game, 'id'>>,
  ): Promise<Game> {
    const foundGame = await this.gameRepository.findOne({ where: { id } });
    if (!foundGame) {
      throw new NotFoundException(`game with id ${id} not found`);
    }

    const upToDateRecord = this.gameRepository.merge(foundGame, dataToSet);
    await this.gameRepository.save(upToDateRecord);

    return upToDateRecord;
  }

  public async listAll(pagination?: Pagination): Promise<[Game[], number]> {
    const page = pagination?.page || 1;
    const pageSize = pagination?.pageSize || 10;
    const skip = (page - 1) * pageSize;

    return await this.gameRepository.findAndCount({
      skip,
      take: pageSize,
    });
  }

  public async delete(id: string): Promise<void> {
    await this.gameRepository.remove(
      await this.gameRepository.findOne({ where: { id } }),
    );
  }

  public async batchInsert(games: Array<Omit<Game, 'id'>>): Promise<void> {
    await this.gameRepository.insert(games);
  }
}
