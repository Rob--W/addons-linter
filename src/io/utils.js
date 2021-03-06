import { lstat, readdir } from 'fs';
import * as path from 'path';

import promisify from 'es6-promisify';

export var lstatPromise = promisify(lstat);
export var readdirPromise = promisify(readdir);

export function walkPromise(curPath) {
  var result = {};
  // Set a basePath var with the initial path
  // so all file paths (the result keys) can
  // be relative to the starting point.
  var basePath = curPath;

  return (function walk(curPath) {
    return lstatPromise(curPath)
      .then((stat) => {
        if (stat.isFile()) {
          var { size } = stat;
          result[path.relative(basePath, curPath)] = { size };
        } else if (stat.isDirectory()) {
          return readdirPromise(curPath)
            .then((files) => {
              // Map the list of files and make a list of readdir
              // promises to pass to Promise.all so we can recursively
              // get the data on all the files in the directory.
              return Promise.all(files.map((fileName) => {
                return walk(path.join(curPath, fileName));
              }));
            })
            .then(() => {
              return result;
            });
        }
      });
  })(curPath);
}
