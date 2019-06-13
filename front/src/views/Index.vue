<template>
  <div class="main" ref="scroller">

    <p>To jest ten landing na którym ma być logowanie itp.</p>

    <b-button :to="{ name: 'selectInterests' }">Zarejestruj się</b-button>

  </div>
</template>

<script>

  export default {
    name: 'Main',
    metaInfo: {
    },
    components: { },
    data() {
      return {
        scrollTop: 0,
        scrollLeft: 0,
        currentTab: 0
      }
    },
    computed: {
    },
    methods: {
    },
    updated () {
    },
    mounted () {
    }
  }

</script>

<style scoped>

</style>
