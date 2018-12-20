import * as tldjs from 'tldjs';

export default class UrlParse {

  static isValidIp(unk) {
    // tslint:disable-next-line
    const ipRegex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return ipRegex.test(unk);
  }

  static sanitize(unk) {
    if(!unk) {
      return null
    }
    unk = unk.trim()
    var p = unk.indexOf('://') > -1;
    if (!p && unk.indexOf('.') > -1) {
      unk = 'http://' + unk;
    } else if (!p) {
      return null;
    }
    return unk
  }

  static getDomain(unk) {
    return tldjs.getDomain(this.sanitize(unk))
  }

  static getHostname(unk) {
    unk = this.sanitize(unk)
    if(!unk){
      return ''
    }
    var d = tldjs.parse(unk)
    return d.hostname
  }

  static getUrlObj(unk) {
    unk = this.sanitize(unk)
    const anchor = window.document.createElement('a');
    anchor.href = unk.trim();
    return anchor
  }

}
