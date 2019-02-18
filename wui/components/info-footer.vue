<template>
  <footer class="footer mt-auto py-2 bg-light">
    <div class="d-flex mx-1">
      <span class="text-muted ml-auto mr-3">{{ `s:${$store.state.public.serverVersion}|w:${$store.state.public.webVersion}` }}@<a href="https://key.cat" class="text-info">KeyCat</a></span>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'info-footer',
}

</script>
