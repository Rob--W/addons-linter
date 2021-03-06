import { walkPromise } from 'io/utils';

describe('io.utils.walkPromise()', function() {

  it('should return the correct file data', () => {
    return walkPromise('tests/fixtures/io/')
      .then((files) => {
        var fileNames = Object.keys(files);
        assert.include(fileNames, 'dir1/file1.txt');
        assert.include(fileNames, 'dir2/file2.txt');
        assert.include(fileNames, 'dir2/dir3/file3.txt');
      });
  });

  it('should return the correct size data', () => {
    return walkPromise('tests/fixtures/io/')
      .then((files) => {
        assert.equal(files['dir1/file1.txt'].size, 2);
        assert.equal(files['dir2/file2.txt'].size, 3);
        assert.equal(files['dir2/dir3/file3.txt'].size, 4);
      });
  });

});
