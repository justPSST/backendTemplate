export interface IDbSeeder {
  dbSeed(): Promise<void>;
}
