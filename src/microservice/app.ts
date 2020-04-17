import mongoose from 'mongoose';
import { configureService } from '@justpsst/servicemessaging';
import { IDbSeeder } from '../BLL';

export class App {

  constructor(serviceName: string, dbConnectionString: string, messageHandler: Function, dbSeeder?: IDbSeeder) {
    this.config(serviceName, dbConnectionString, messageHandler, dbSeeder);
  }

  private config(serviceName: string, dbConnectionString: string, messageHandler: Function, dbSeeder?: IDbSeeder): void {
    this.initBroker(serviceName, messageHandler);
    this.setDatabase(serviceName, dbConnectionString, dbSeeder);
  }

  private async initBroker(serviceName: string, messageHandler: Function): Promise<void> {
    await configureService(serviceName, messageHandler);
  }

  private async setDatabase(serviceName: string, dbConnectionString: string, dbSeeder?: IDbSeeder): Promise<void> {
    try {
      mongoose.set('useCreateIndex', true);
      await mongoose.createConnection(`${dbConnectionString}-${serviceName}`,
        { useNewUrlParser: true, useUnifiedTopology: true }
      );
      console.log('MongoDB has started...');
      if (dbSeeder) {
        dbSeeder.dbSeed();
      }
    } catch (err) {
      console.log(err);
    }
  }
}
