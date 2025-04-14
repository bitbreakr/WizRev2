import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Game, Platform } from './types';

@Entity({ name: 'Games' })
//@Unique(['platform', 'bundleId'])
export class GameEntity implements Game {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column()
  public isPublished: boolean;

  @Column()
  public name: string;

  @Column()
  public platform: Platform;

  @Column()
  public bundleId: string;

  @Column()
  public publisherId: string;

  @Column()
  public storeId: string;

  @Column()
  public appVersion: string;
}
