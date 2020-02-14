const runAll = require('npm-run-all');
const env = process.env.NODE_ENV || 'development';
const webpack = env === 'production'
    ? 'build'
    : 'start:devserver'


runAll(['start:server', webpack], {
    parallel: true,
    printLabel: true,
    stdout: process.stdout,
    stderr: process.stderr
})
    .then(() => {
        process.exit(0);
    })
    .catch((e) => {
        console.error(e);
        process.exit(1);
    });

