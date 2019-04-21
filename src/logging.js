class Logging {
    static getLogger = () => {
        return {
            log: message => {
                console.log(message);
            }
        };
    };
}

export default Logging;
