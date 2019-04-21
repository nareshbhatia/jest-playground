import axios from 'axios';
import { head } from 'lodash';
import { Chart } from './chart';
import { forEach } from './foreach';
import Logging from './logging';
import UserService from './user-service';

// -----------------------------------------------------------------------------
// jest.fn() returns a new, unused mock function
// -----------------------------------------------------------------------------
describe('jest.fn() returns a new, unused mock function', () => {
    test('call without an implementation', () => {
        const mockFn = jest.fn();
        mockFn();
        expect(mockFn).toHaveBeenCalled();
    });

    test('call with an implementation', () => {
        const mockFn = jest.fn(() => true);
        mockFn();
        expect(mockFn).toHaveReturnedWith(true);
        expect(mockFn()).toBe(true);
    });

    test('forEach() invokes a callback for each array item', () => {
        // Create a mock callback function with any implementation
        const mockCallback = jest.fn(x => 42 + x);
        forEach([0, 1], mockCallback);

        // The mock function is called twice
        expect(mockCallback.mock.calls.length).toBe(2);

        // The first argument of the first call to the function was 0
        expect(mockCallback.mock.calls[0][0]).toBe(0);

        // The first argument of the second call to the function was 1
        expect(mockCallback.mock.calls[1][0]).toBe(1);

        // The return value of the first call to the function was 42
        expect(mockCallback.mock.results[0].value).toBe(42);
    });

    test('return value from mock', () => {
        const mockFn = jest.fn();

        mockFn
            .mockReturnValueOnce(10)
            .mockReturnValueOnce('x')
            .mockReturnValue(true);

        expect(mockFn()).toBe(10);
        expect(mockFn()).toBe('x');
        expect(mockFn()).toBe(true);
        expect(mockFn()).toBe(true);
    });
});

// -----------------------------------------------------------------------------
// Auto mock a module
// Technique: Use jest.mock(moduleName)
// -----------------------------------------------------------------------------

// In this example, UserService.getUsers() uses axios.get() to fetch users.
// We want to test getUsers() without hitting the API. So we will mock
// axios.get() to return whatever we want.

// Call jest.mock() to automatically mock axios.
// Note that the import at top of the file is required
jest.mock('axios');

// ----- Test UserService.getUsers() -----
test('UserService fetches users', () => {
    // Mock the resolved value from axios.get()
    const users = [{ name: 'Naresh' }];
    const res = { data: users };
    axios.get.mockResolvedValue(res);

    return UserService.getUsers().then(data => expect(data).toEqual(users));
});

// -----------------------------------------------------------------------------
// Manually mock a user module
// Technique: Create a mock module in a __mocks__ subdirectory adjacent to
// the module
// -----------------------------------------------------------------------------

// In this example the Logging module logs to the console. We want to override
// this implementation so that it does not log to the console. This is achieved
// by creating a mock Logging module at __mocks__/logging.js.

// Explicitly calling jest.mock() is required
jest.mock('./logging');

test('Override logging module so that it does not log to console', () => {
    Logging.getLogger().log('Hello World');
});

// -----------------------------------------------------------------------------
// Manually mock a node module
// Technique: Create a mock module in a __mocks__ directory adjacent to
// node_modules
// -----------------------------------------------------------------------------

// ----- Manual Mock lodash -----
// We have __mocks__/lodash.js as peer to node_modules.
// There is no need to call jest.mock('lodash') explicitly.
// Lodash will be mocked automatically.
// See https://jestjs.io/docs/en/manual-mocks.html#mocking-node-modules
// Note that Node's core modules (such as fs and path) are not mocked
// automatically, so we must call jest.mock() explicitly to mock these modules.

test('head should return the first element', () => {
    // Mock always returns 100
    expect(head([1, 2, 3])).toBe(100);
});

// -----------------------------------------------------------------------------
// Manually mock one of Node's core modules
// Technique: Create a mock module in a __mocks__ directory adjacent to
// node_modules and explicitly call jest.mock()
// -----------------------------------------------------------------------------

// In this example, FileSummarizer.listFilesInDirectorySync() provides a summary
// of all the files in a given directory. It calls fs.readdirSync() to get file
// information. We want to mock fs.readdirSync() so that the test does not hit
// the disk.

// ----- Manual Mock fs -----
// We have __mocks__/fs.js as peer to node_modules.
// fs is one of Node's core modules, jest.mock() needs to be explicitly called.
// See https://jestjs.io/docs/en/manual-mocks.html#mocking-node-modules
jest.mock('fs');

describe('listFilesInDirectorySync', () => {
    const MOCK_FILE_INFO = {
        '/path/to/file1.js': 'console.log("file1 contents");',
        '/path/to/file2.txt': 'file2 contents'
    };

    beforeEach(() => {
        // Set up some mocked out file info before each test
        require('fs').__setMockFiles(MOCK_FILE_INFO);
    });

    test('includes all files in the directory in the summary', () => {
        const FileSummarizer = require('./file-summarizer');
        const fileSummary = FileSummarizer.summarizeFilesInDirectorySync(
            '/path/to'
        );

        expect(fileSummary.length).toBe(2);
    });
});

// -----------------------------------------------------------------------------
// Mock an ES6 class
// ES6 classes are constructor functions with some syntactic sugar. Therefore,
// any mock for an ES6 class must be a function or an actual ES6 class (which
// is, again, another function). So you can mock them using mock functions.
// See https://jestjs.io/docs/en/es6-class-mocks
// -----------------------------------------------------------------------------

// Auto mock of the Chart class
// Must be at top level. Do not embed in test
jest.mock('./chart'); // Chart is now a mock constructor

describe('Testing ES6 classes', () => {
    test('Auto mock of the Chart class', () => {
        const chart = new Chart([1, 2], [10, 20]);

        // Constructor should have been called
        expect(Chart).toHaveBeenCalledTimes(1);

        chart.render();

        // mock.instances is available with automatic mocks
        const mockChartInstance = Chart.mock.instances[0];
        const mockRender = mockChartInstance.render;
        expect(mockRender).toHaveBeenCalledTimes(1);
    });
});
