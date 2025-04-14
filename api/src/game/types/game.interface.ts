import { Platform } from './platform.enum';

export interface Game {
  id: string;
  publisherId: string;
  name: string;
  platform: Platform;
  storeId: string;
  bundleId: string;
  appVersion: string;
  isPublished: boolean;
}
