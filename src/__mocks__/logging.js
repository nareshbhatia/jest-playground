// Instead of logging to the console, just call a mock function
class Logging {
    static getLogger = () => {
        return {
            log: jest.fn()
        };
    };
}

export default Logging;
