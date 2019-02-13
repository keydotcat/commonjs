<template>
  <div class="card">
    <div class="card-body">
      <form>
        <div class="form-group row" hidden>
          <label for="ctype" class="col-md col-form-label">Type</label>
          <div class="col-md-9">
            <select id="ctype" class="form-control" v-model="changes.type">
              <option value="login">Login</option>
              <option value="key">Key</option>
            </select>
          </div>
        </div>
        <div class="form-group row">
          <label for="name" class="col-md col-form-label">Name</label>
          <div class="col-md-9">
            <input id="user" class="form-control" :class="{ 'is-invalid': !isOkName }" type="text" v-model="changes.name" placeholder="Name" aria-label="name" />
            <div v-if="!isOkName" class="invalid-feedback">
              Please choose credential name.
            </div>
          </div>
        </div>
        <div class="form-group row">
          <label for="username" class="col-md col-form-label">Username</label>
          <div class="col-md-9">
            <input
              id="username"
              class="form-control"
              :class="{ 'is-invalid': !isOkUsername }"
              type="text"
              v-model="changes.username"
              placeholder="Username"
              aria-label="username"
            />
            <div v-if="!isOkUsername" class="invalid-feedback">
              Please choose a username.
            </div>
          </div>
        </div>
        <div class="form-group row">
          <label for="password" class="col-md col-form-label">Password</label>
          <div class="input-group col-md-9">
            <input :type="revealPass ? 'text' : 'password'" v-model="changes.password" class="form-control" :class="{ 'is-invalid': !isOkPassword }" aria-label="password" />
            <div class="input-group-append">
              <button class="btn btn-outline-secondary d-flex" type="button" @click="revealPass = !revealPass">
                <i class="material-icons" v-if="!revealPass">visibility_off</i>
                <i class="material-icons" v-if="revealPass">visibility</i>
              </button>
            </div>
            <div v-if="!isOkPassword" class="invalid-feedback">
              Password empty or passwords do not match
            </div>
          </div>
        </div>
        <div class="form-group row">
          <label for="password" class="col-md col-form-label">Repeat</label>
          <div class="input-group col-md-9">
            <input :type="revealPass ? 'text' : 'password'" v-model="password_repeat" class="form-control" aria-label="password" />
            <div class="input-group-append">
              <button class="btn btn-primary" :class="{ 'btn-info': showGenerate }" type="button" @click="toggleGeneratePanel">
                Generate
              </button>
            </div>
          </div>
        </div>
        <div class="border" v-if="showGenerate">
          <h6 class="m-2 text-muted">Generate password</h6>
          <div class="container-fluid p-2">
            <div class="row d-flex align-items-center">
              <div class="col-2">
                Length
              </div>
              <div class="col">
                <form>
                  <div class="form-group">
                    <input type="range" v-model="genOpts.len" min="5" max="40" class="form-control-range" id="formControlRange" />
                  </div>
                </form>
              </div>
              <div class="col-2">
                <input type="number" v-model="genOpts.len" class="form-control mx-auto" style="width:70px" />
              </div>
            </div>
            <div class="row d-flex align-items-center">
              <div class="col-2">
                Characters
              </div>
              <div class="col d-flex align-content-justify">
                <div class="btn-group mx-auto" role="group" aria-label="Basic example">
                  <button type="button" class="btn" :disabled="genOpts.unicode" :class="{ 'btn-info': genOpts.lower }" @click="genOpts.lower = !genOpts.lower">a-z</button>
                  <button type="button" class="btn" :disabled="genOpts.unicode" :class="{ 'btn-info': genOpts.upper }" @click="genOpts.upper = !genOpts.upper">A-Z</button>
                  <button type="button" class="btn" :disabled="genOpts.unicode" :class="{ 'btn-info': genOpts.num }" @click="genOpts.num = !genOpts.num">0-9</button>
                  <button type="button" class="btn" :disabled="genOpts.unicode" :class="{ 'btn-info': genOpts.sym }" @click="genOpts.sym = !genOpts.sym">symbols</button>
                </div>
              </div>
              <div class="col d-flex align-content-justify">
                <button type="button" class="btn mx-auto" :class="{ 'btn-info': genOpts.unicode }" @click="genOpts.unicode = !genOpts.unicode">full unicode</button>
              </div>
            </div>
            <div class="row d-flex align-items-center p-3">
              <div class="col-2">
                <button type="button" class="btn btn-primary" @click="generatePassword">Generate</button>
              </div>
              <div class="col">
                <div class="input-group">
                  <input :type="revealGenerated ? 'text' : 'password'" v-model="generated" class="form-control" aria-label="password" />
                  <div class="input-group-append">
                    <button class="btn btn-outline-secondary d-flex" type="button" @click="revealGenerated = !revealGenerated">
                      <i class="material-icons" v-if="!revealGenerated">visibility_off</i>
                      <i class="material-icons" v-if="revealGenerated">visibility</i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div class="row d-flex align-items-center p-3">
              <div class="col d-flex justify-content-end">
                <button type="button" :disabled="generated.length === 0" class="btn btn-primary" @click="saveGeneratedPassword">Save generated password</button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
    <div class="card-footer d-flex justify-content-end">
      <button type="button" class="btn btn-warning mr-auto d-flex" @click="deleteCredential">
        <i class="material-icons" aria-hidden="true">delete</i>
        Delete
      </button>
      <button type="button" :disabled="!isOkName || !isOkUsername || !isOkPassword" class="btn btn-success d-flex" @click="saveChanges">
        <i class="material-icons mr-1" aria-hidden="true">save_alt</i>
        Save
      </button>
      <button type="button" class="btn btn-danger ml-2 d-flex" @click="cancelChanges">
        <i class="material-icons" aria-hidden="true">clear</i>
        Cancel
      </button>
    </div>
  </div>
</template>

<script>
import jsspg from 'javascript-strong-password-generator'

function getRandomArray(len) {
  const crypto = window.crypto || window.msCrypto
  const randomValues = new Uint32Array(len)
  crypto.getRandomValues(randomValues)
  return randomValues
}

jsspg.init({
  entropyFxn: () => {
    return Array.from(getRandomArray(128))
  }
})

var charSets = {
  num: '0123456789',
  lower: 'abcdefghijklmnopqrstuvwxyz',
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  sym: '!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~'
}

function generateNormalPass(opts) {
  var gp = []
  var cs = ''
  if (opts.num) {
    cs += charSets.num
  }
  if (opts.lower) {
    cs += charSets.lower
  }
  if (opts.upper) {
    cs += charSets.upper
  }
  if (opts.sym) {
    cs += charSets.sym
  }
  var csl = cs.length
  var ra = getRandomArray(opts.len)
  for (var i = 0; i < opts.len; i++) {
    gp.push(cs[Math.floor(((1.0 * ra[i]) / Math.pow(2, 32)) * csl)])
  }
  return gp.join('')
}

export default {
  name: 'location-credential-editor',
  props: {
    idcred: Number,
    cred: Object
  },
  data() {
    return {
      changes: {
        type: this.cred.type || 'password',
        name: this.cred.name || 'login',
        username: this.cred.username || '',
        password: this.cred.password || ''
      },
      revealPass: false,
      revealGenerated: false,
      showGenerate: false,
      password_repeat: this.cred.password || '',
      generated: '',
      genOpts: {
        lower: true,
        upper: true,
        num: true,
        sym: false,
        unicode: false,
        len: 15
      }
    }
  },
  methods: {
    deleteCredential() {
      this.$emit('delete', {
        idcred: this.idcred
      })
    },
    saveChanges() {
      this.$emit('change', {
        idcred: this.idcred,
        cred: this.changes
      })
    },
    cancelChanges() {
      this.$emit('cancel', this.idcred)
    },
    toggleGeneratePanel() {
      this.showGenerate = !this.showGenerate
      this.generatePassword()
    },
    saveGeneratedPassword() {
      this.password_repeat = this.generated
      this.changes.password = this.generated
      this.showGenerate = false
      this.generated = ''
    },
    generatePassword() {
      if (this.genOpts.unicode) {
        this.generated = jsspg.generate(this.genOpts.len)
      } else {
        this.generated = generateNormalPass(this.genOpts)
      }
    }
  },
  computed: {
    isOkName() {
      return (this.changes.name || '').length > 0
    },
    isOkUsername() {
      return (this.changes.username || '').length > 0
    },
    isOkPassword() {
      return (this.changes.password || '').length > 0 && this.changes.password === this.password_repeat
    }
  }
}
</script>
