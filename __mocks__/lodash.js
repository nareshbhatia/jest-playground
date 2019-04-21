'use strict';

const lodash = jest.genMockFromModule('lodash');

function head(arrary) {
    return 100;
}

lodash.head = head;

module.exports = lodash;
