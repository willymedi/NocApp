import { LogEntity, LogSeverityLevel } from '../../entities/log.entity';
import { LogRepository } from '../../repository/log.repository';

interface CheckServiceMultipleUseCase {
  execute( url: string ):Promise<boolean>;
}


type SuccessCallback = (() => void) | undefined;
type ErrorCallback = (( error: string ) => void) | undefined;




export class CheckServiceMultiple implements CheckServiceMultipleUseCase {

  constructor(
    private readonly logRepository: LogRepository[],
    private readonly successCallback: SuccessCallback,
    private readonly errorCallback: ErrorCallback
  ) {}

  private callLogsRepository(log: LogEntity) {
    this.logRepository.forEach(logRep => logRep.saveLog(log));

  }

  public async execute( url: string ): Promise<boolean> {

    try {
      const req = await fetch( url );
      if ( !req.ok ) {
        throw new Error( `Error on check service ${ url }` );
      }
      const log = new LogEntity({message: `Service ${ url } working`, origin:"log.file", createdAt:new Date(), level:LogSeverityLevel.low});
      
      this.callLogsRepository( log );
      this.successCallback && this.successCallback();

      return true;
    } catch (error) {
      const errorMessage = `${url} is not ok. ${ error }`;
      const log = new LogEntity({ message:errorMessage , origin:"log.file", createdAt:new Date(), level:LogSeverityLevel.high });
      this.callLogsRepository(log);
      
      this.errorCallback && this.errorCallback( errorMessage );

      return false;
    }

  }

}

