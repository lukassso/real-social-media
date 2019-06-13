<template>
  <div>

    <b-button :to="{ name:'emailPassword:login' }">Sign in with email</b-button>
    <br><br>
    <b-button :to="{ name:'emailPassword:register' }">Sign up with email</b-button>

  </div>
</template>

<script>
  import api from "@/api"

  export default {
    name: "LogIn",
    inject: ['loadingZone', 'workingZone'],
    methods: {

    },
    created() {
    }
  }
</script>

<style scoped>

</style>