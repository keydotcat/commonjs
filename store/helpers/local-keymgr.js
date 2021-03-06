import KeyMgr from '@/commonjs/crypto/key_mgr'

function promisify(ftor) {
  return new Promise(function (resolve, reject) {
    var res = ftor()
    if ('data' in res) {
      resolve(res.data)
    } else {
      reject(res)
    }
  })
}

class LocalKeyMgr {
  constructor() {
    this.keyMgr = new KeyMgr()
  }
  generateUserKey(username, password) {
    return this.keyMgr.generateUserKeys(username, password).then((res) => {
      return res.data
    })
  }
  generateVaultKeys(adminKeys) {
    return promisify(() => {
      return this.keyMgr.generateVaultKeys(adminKeys)
    })
  }
  hashPassword(username, password) {
    return this.keyMgr.hashLoginPassword(username, password).then((res) => {
      return res.data
    })
  }
  setKeysFromServer(password, storeToken, srvKeys) {
    return this.keyMgr.setKeysFromServer(password, storeToken, srvKeys).then((res) => {
      return res.data
    })
  }
  setKeysFromStore(storeToken, storedKeys) {
    return this.keyMgr.setKeysFromStore(storedKeys, storeToken).then((res) => {
      return res.data
    })
  }
  cipherVaultKeysForUser(vaultKeys, pubKey) {
    return promisify(() => {
      return this.keyMgr.cipherKeysForUser(vaultKeys, pubKey)
    })
  }
  serializeAndClose(vaultKeys, obj) {
    return promisify(() => {
      return this.keyMgr.serializeAndClose(vaultKeys, obj)
    })
  }
  openAndDeserialize(vaultKeys, data) {
    return promisify(() => {
      return this.keyMgr.openAndDeserialize(vaultKeys, data)
    })
  }
  openAndDeserializeBulk(vsa) {
    return promisify(() => {
      return this.keyMgr.openAndDeserializeBulk(vsa)
    })
  }
  closeKeysWithPassword(username, password) {
    return this.keyMgr.closeKeysWithPassword(username, password).then((res) => {
      return res.data
    })
  }
}

export default new LocalKeyMgr()
