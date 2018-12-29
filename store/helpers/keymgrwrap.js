class KeyMgrWrap {
  setInner(km) {
    this.inner = km
  }
  generateUserKey(username, password) {
    return this.inner.generateUserKey(username, password)
  }
  generateVaultKeys(adminKeys) {
    return this.inner.generateVaultKeys(adminKeys)
  }
  hashPassword(username, password) {
    return this.inner.hashPassword(username, password)
  }
  setKeysFromServer(password, storeToken, srvKeys) {
    return this.inner.setKeysFromServer(password, storeToken, srvKeys)
  }
  setKeysFromStore(storeToken, storedKeys) {
    return this.inner.setKeysFromStore(storeToken, storedKeys)
  }
  cipherVaultKeysForUser(vaultKeys, pubKey) {
    return this.inner.cipherVaultKeysForUser(vaultKeys, pubKey)
  }
  serializeAndClose(vaultKeys, obj) {
    return this.inner.serializeAndClose(vaultKeys, obj)
  }
  openAndDeserialize(vaultKeys, data) {
    return this.inner.openAndDeserialize(vaultKeys, data)
  }
  openAndDeserializeBulk(vsa) {
    return this.inner.openAndDeserializeBulk(vsa)
  }
  closeKeysWithPassword(username, password) {
    return this.inner.closeKeysWithPassword(username, password)
  }
}

export default new KeyMgrWrap()
