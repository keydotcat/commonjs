<template>
  <span class="switch switch-sm nav-link">
    <input type="checkbox" @change="saveAutoLogout" v-model="enableAutoLogout" class="switch" id="switch-id">
    <label class="m-0"for="switch-id">Auto-logout</label>
  </span>
</template>

<script>
const LS_KEYCAT_AUTO_LOGOUT = 'kcAutoLogout'

export default {
  name: 'auto-logout',
  data() {
    return {
      idleMinutes: 1,
      enableAutoLogout: true
    }
  },
  beforeMount() {
    switch (localStorage.getItem(LS_KEYCAT_AUTO_LOGOUT)) {
      case '1':
        this.enableAutoLogout = true
        break
      case '0':
        this.enableAutoLogout = false
        break
    }
  },
  methods: {
    saveAutoLogout() {
      localStorage.setItem(LS_KEYCAT_AUTO_LOGOUT, this.enableAutoLogout ? '1' : '0')
    }
  },
  mounted() {
    var timer = null
    var self = this

    function autoLogout() {
      if (self.enableAutoLogout) {
        self.$store.dispatch('session/logout')
      }
    }

    function resetTimer() {
      clearTimeout(timer)
      timer = setTimeout(autoLogout, Math.ceil(self.idleMinutes * 60000))
    }

    document.onmousemove = resetTimer
    document.onkeypress = resetTimer
    resetTimer()
  }
}
</script>
