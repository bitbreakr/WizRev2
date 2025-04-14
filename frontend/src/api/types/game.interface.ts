export interface Game {
  id: string;
  publisherId: number;
  name: string;
  platform: "ios" | "android";
  storeId: number;
  bundleId: string;
  appVersion: string;
  isPublished: boolean;
}
