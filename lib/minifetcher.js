const utils = require('./utils');
const clone = require('lodash.clone');

class Minifetcher {

  constructor() {
    for (let method of utils.httpMethods) {
      this[method] = (url, options) => this.requestDispatcher(url, options);
    }
  }

  async requestDispatcher(url, options) {
    const protocol = utils.resolveProtocol(url);

    return new Promise((resolve) => {
      protocol.request(url, options, async (res) => {
        return resolve(this.responseStreamer(res));
      }).end();
    });
  }

  async responseStreamer(res) {
    const responseBody = [];
    const responseStream = clone(res);

    return new Promise((resolve) => {
      res.on('data', (chunk) => {
        responseBody.push(chunk);
      });

      res.on('end', () => {
        responseStream.data = responseBody.toString();
        return resolve(responseStream);
      });
    });
  }

}

module.exports = Minifetcher;
