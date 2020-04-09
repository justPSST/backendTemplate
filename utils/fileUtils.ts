import * as path from 'path';

export class FileUtils {
  public static getRootFolder(): string {
    return path.resolve(__dirname, '../../..');
  }

  public static getWWWFolder(): string {
    return path.resolve(this.getRootFolder(), 'wwwroot');
  }

  public static getConfigFolder(): string {
    return path.resolve(this.getRootFolder(), 'configuration')
  }
}
