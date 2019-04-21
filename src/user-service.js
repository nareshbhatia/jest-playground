import axios from 'axios';

const getUsers = () => {
    return axios
        .get('https://jsonplaceholder.typicode.com/users')
        .then(resp => resp.data);
};

module.exports = {
    getUsers: getUsers
};
