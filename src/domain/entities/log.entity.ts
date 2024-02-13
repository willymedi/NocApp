
export enum LogSeverityLevel {
  low    = 'low',
  medium = 'medium',
  high   = 'high',
}

export interface LogEntityOptions {
  level: LogSeverityLevel;
  message: string;
  createdAt: Date;
  origin: string;

}


export class LogEntity {

  public level: LogSeverityLevel; // Enum
  public message: string;
  public createdAt: Date;
  public origin: string;

  constructor( options: LogEntityOptions) {
    const { level, message, origin, createdAt=new Date()} = options;
    this.message = message;
    this.level = level;
    this.createdAt = createdAt;
    this.origin = origin;
  }

  //"{ "level": "high", "message":"Hola Mundo", "createdAt":"128937TZ12378123" }"
  static fromJson = ( json: string ): LogEntity => {
    json = (json === '') ?  '{}' : json
    const { message, level, createdAt, origin } = JSON.parse(json);
    
    const log = new LogEntity({
      level,
      message,
      createdAt,
      origin,

    });    
    return log;
  }

  static fromObject = (object: {[key: string]: any}): LogEntity => { 
    const {message, level, createdAt, origin} = object;
    return  new LogEntity({
      level,
      message,
      createdAt,
      origin
    })
  }

}
