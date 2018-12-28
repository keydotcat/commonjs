import SecretData from './secret_data'
import LocationData from './location_data'
import NoteData from './note_data'
import { DateTime } from 'luxon'

export default class Secret {
  constructor({ secretId = '', vaultId = '', teamId = '', createdAt, updatedAt, vaultVersion, data } = {}) {
    this.secretId = secretId
    this.vaultId = vaultId
    this.teamId = teamId
    this.vaultVersion = vaultVersion
    this._createdAt = createdAt
    this._updatedAt = updatedAt
    this.domains = []
    if(data) {
      if(data instanceof LocationData || data instanceof NoteData) {
        this.data = data
      } else {
        if( '_data' in data ) {
          data = data._data
        }
        this.data = new SecretData( data )
      }
      this.domains = this.data.getDomains()
    } else {
      throw new Error('Empty data')
    }
  }
  matchDomain(dom) {
    for(var i = 0; i < this.domains.length; i++ ) {
      if( dom === this.domains[i] ) {
        return true
      }
    }
    return false
  }
  get fullId() {
    return `${this.teamId}.${this.vaultId}.${this.secretId}`
  }
  get createdAt() {
    return DateTime.fromISO(this._createdAt)
  }
  get updatedAt() {
    return DateTime.fromISO(this._updatedAt)
  }
  cloneAsObject() {
    return {
      secretId: this.secretId,
      vaultId: this.vautId,
      teamId: this.teamId,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
      vaultVersion: this.vaultVersion,
      data: this.data.cloneAsObject()
    }
  }

  static fromObject(obj) {
    if( obj instanceof Secret ) {
      return obj
    }
    return new Secret({
      secretId: obj.secretId,
      vaultId: obj.vaultId,
      teamId: obj.teamId,
      createdAt: obj.createdAt,
      updatedAt: obj.updatedAt,
      vaultVersion: obj.vaultVersion,
      data: obj.data
    })
  }

  static createLocation(){
    return new Secret({ data: new LocationData() })
  }

  static createNote(){
    return new Secret({ data: new NoteData() })
  }
}
