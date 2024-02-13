import { CheckService } from '../domain/use-cases/checks/check-service';
import { CheckServiceMultiple } from '../domain/use-cases/checks/check-service multiple';
import { SendEmailLogs } from '../domain/use-cases/email/send-logs';
import { FileSystemDatasource } from '../infrastructure/datasources/file-system.datasource';
import { MongoLogDataSource } from '../infrastructure/datasources/mongo-log.datasource';
import { PostgresLogDatasource } from '../infrastructure/datasources/postgres-log.datasource';
import { LogRepositoryImpl } from '../infrastructure/repositories/log.repository.impl';
import { CronService } from './cron/cron-service';
import { EmailService } from './email/email.service';


const postgresRepository = new LogRepositoryImpl(
  new PostgresLogDatasource(),
);

const fsRepository = new LogRepositoryImpl(
  new FileSystemDatasource(),
);

const mongoRepository = new LogRepositoryImpl(
  new MongoLogDataSource(),
);


const emailService = new EmailService()

export class Server {

  public static start() {

    console.log( 'Server started...' );

    // new SendEmailLogs(
    //   emailService,
    //   fileSystemLogRepository

    // ).execute("williammedina97@hotmail.com");
    // const emailService = new EmailService();
    // emailService.sendEmailWithFileSystemLogs("williammedina97@hotmail.com");
    
    CronService.createJob(
      '*/5 * * * * *',
      () => {
        const url = 'https://google.com';
        new CheckServiceMultiple(
          [postgresRepository, mongoRepository, fsRepository],
          () => console.log( `${ url } is ok` ),
          ( error ) => console.log( error ),
        ).execute( url );
        // new CheckService().execute( 'http://localhost:3000' );
        
      }
    );


  }


}


