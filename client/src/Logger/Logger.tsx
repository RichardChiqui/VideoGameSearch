export const Logger = async (msg:string, loggingLevel:LogLevel) => {
    const  logLevel = process.env.APP_LOG_LEVEL == null? 0 : parseInt(process.env.APP_LOG_LEVEL)
 
    if(logLevel >= 3){
          console.log(msg);
    } else if(loggingLevel < 3){
        if(logLevel == 2){
            throw msg;
        }
        console.log(msg)

    }
};
export enum LogLevel {
    Info,   // 0
    Warn,   // 1
    Error,   // 2
    Debug, //3
    Trace //4
}