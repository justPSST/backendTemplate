import mongoose from 'mongoose';
import { configureService } from '@justpsst/servicemessaging';
import { IDbSeeder } from '../BLL';

export interface IServiceConfig {
  serviceName: string;
  dbConnectionString: string;
  messageHandler: Function;
  dbSeeder?: IDbSeeder;
  messageConfig?: {
    prefetch?: number;
    connectionString?: string;
  }
}

export class App {

  constructor(configuration: IServiceConfig) {
    this.config(configuration);
  }

  private config(configuration: IServiceConfig): void {
    this.initBroker(configuration.serviceName, configuration.messageHandler, configuration.messageConfig?.connectionString, configuration.messageConfig?.prefetch);
    this.setDatabase(configuration.dbConnectionString, configuration.dbSeeder);
  }

  private async initBroker(serviceName: string, messageHandler: Function, connectionString?: string, prefetch?: number): Promise<void> {
    await configureService(serviceName, messageHandler, connectionString, prefetch);
  }

  private async setDatabase(dbConnectionString: string, dbSeeder?: IDbSeeder): Promise<void> {
    try {
      mongoose.set('useCreateIndex', true);
      await mongoose.connect(`${dbConnectionString}`,
        { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }
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
