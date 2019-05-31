const SESSION_STORE_NAME = 'KCSession'

export default class SessionStorage {
  constructor() {
    this.ext = null
  }
  setExtension(browserExt) {
    this.ext = browserExt
  }
  save(data) {
    if (this.ext) {
      var container = {}
      container[SESSION_STORE_NAME] = data
      this.ext.storage.local.set(container)
      return
    }
    localStorage.setItem(SESSION_STORE_NAME, JSON.stringify(data))
  }
  async load() {
    if (this.ext) {
      var data = await this.ext.storage.local.get(SESSION_STORE_NAME)
      if (!(SESSION_STORE_NAME in data)) {
        return
      }
      return data[SESSION_STORE_NAME]
    }
    var stub = localStorage.getItem(SESSION_STORE_NAME)
    if (!stub || stub.length === 0) {
      return
    }
    return JSON.parse(stub)
  }
  clean() {
    if (this.ext) {
      this.ext.storage.local.remove(SESSION_STORE_NAME)
      return
    }
    localStorage.removeItem(SESSION_STORE_NAME)
  }
}
