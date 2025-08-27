export interface AchievementGateway {
  getUnlockedAchievementIds(): Promise<string[]>;
  saveUnlockedAchievementIds(ids: string[]): Promise<void>;
}
