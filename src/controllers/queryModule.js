const dbConnection = require("../config/database");

const queryResult = (sqlQuery, callback) => {
    dbConnection.query(sqlQuery, (error, results, fields) => {
        if (error) {
            console.error('Помилка виконання запиту:', error);
            return callback(error, null);
        }
        return callback(null, results);
    });
};

module.exports = {
    queryResult,
};