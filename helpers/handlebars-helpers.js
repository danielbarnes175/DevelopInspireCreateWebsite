module.exports = {
    splitLogs: function (logString) {
        var logs = logString.split(", ");

        let logList = '';
        for (const logId of logs) {
            logList += `<a href="https://logs.tf/${logId}">${logId}</a>, `
        }
        return logList;
    }
}