import { Transform } from 'stream';
import * as StreamArray from 'stream-json/streamers/StreamArray';
import * as Parser from 'stream-json/Parser';

export class JsonStreamParser extends Transform {
  private parser!: Parser;
  private streamArray!: StreamArray;

  constructor() {
    super({ objectMode: true });

    this.parser = new Parser();
    this.streamArray = new StreamArray();
    this.parser.pipe(this.streamArray);

    this.streamArray.on('data', ({ value }) => {
      this.push(value);
    });

    this.streamArray.on('error', (err) => {
      this.emit('error', err);
    });

    this.streamArray.on('end', () => {
      this.end();
    });
  }

  _transform(chunk, encoding, callback) {
    this.parser.write(chunk);
    callback();
  }

  _flush(callback) {
    this.parser.end();
    callback();
  }
}
