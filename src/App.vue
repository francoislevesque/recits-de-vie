<template>
  <div id="app" ref="app">
    
  </div>
</template>

<script>

export default {
  name: 'app',
  data () {
    return {
      scroll: {
        x: 0,
        y: 0
      },
      height: 800
    }
  },
  created () {
  },
  mounted () {

  },
  methods: {
    init () {
      // Calculate height
      this.height = this.$refs.app.innerHeight;
    }
  }
}
</script>

<style lang="scss">
#app {
  height: 100vh;
  width: 100vw;
  overflow-x: hidden;
  overflow-y: auto;
}
</style>
