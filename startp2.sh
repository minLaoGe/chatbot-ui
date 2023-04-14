const pm2 = require('pm2');
const path = require('path');

// 指定项目目录和入口文件
const appDirectory = path.join(__dirname, './myapp');
const appEntry = path.join(appDirectory, 'app.js');

const start = () => {
  pm2.connect((err) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }

    pm2.start({
      name: 'myapp',
      script: appEntry,
      cwd: appDirectory,
      env: {
        NODE_ENV: 'production',
      },
    }, (err) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }

      console.log('App started!');
      pm2.disconnect();
    });
  });
};

const stop = () => {
  pm2.connect((err) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }

    pm2.stop('myapp', (err) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }

      console.log('App stopped!');
      pm2.disconnect();
    });
  });
};

const restart = () => {
  pm2.connect((err) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }

    pm2.restart('myapp', (err) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }

      console.log('App restarted!');
      pm2.disconnect();
    });
  });
};

// 根据命令行参数执行对应的操作
switch (process.argv[2]) {
  case 'start':
    start();
    break;
  case 'stop':
    stop();
    break;
  case 'restart':
    restart();
    break;
  default:
    console.log(`Usage: node ${process.argv[1]} {start|stop|restart}`);
    break;
}
