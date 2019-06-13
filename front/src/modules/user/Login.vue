<template>
  <div>

    <b-button @click="facebook">Sigh in with facebook</b-button>
    <b-button @click="google">Sign in with google</b-button>
    <b-button :to="{ name:'emailPassword:login' }">Sign in with email</b-button>
    <b-button :to="{ name:'phonePassword:login' }">Sign in with mobile phone</b-button>
    <br><br>
    <b-button :to="{ name:'emailPassword:register' }">Sign up with email</b-button>
    <b-button :to="{ name:'phonePassword:register' }">Sign up with mobile phone</b-button>

  </div>
</template>

<script>
  import { loadFB } from "@/thirdParty/facebookApi.js"
  import { loadGoogleAuth2 } from "@/thirdParty/googleApi.js"
  import api from "@/api"

  export default {
    name: "LogIn",
    inject: ['loadingZone', 'workingZone'],
    methods: {
      facebook() {
        const fb = this.fb
        this.workingZone.addPromise('Facebook login', (async ()=>{
          let response = await new Promise((resolve, reject) =>
              fb.login((st)=>st.error ? reject(st.error) : resolve(st)), { scope: 'email' })
          if (response.authResponse) {
            console.log(response.authResponse)
            await api.request(['facebookLogin','registerOrLogin'], { accessToken: response.authResponse.accessToken })
          } else {
            console.log("User cancelled login.")
          }
          return 'ok'
        })())
      },
      google() {
        const auth2 = this.goog
        console.log("GOOG", auth2)
        this.workingZone.addPromise('Google login', (async ()=>{
          let response = await auth2.signIn({ scope: 'profile email' })
          await api.request(['googleLogin','registerOrLogin'], { accessToken: response.getAuthResponse().id_token })
          return 'ok'
        })())
      }
    },
    created() {
      this.fbPromise = loadFB()
      this.fbPromise.then(fb => this.fb = fb)
      this.loadingZone.addPromise("facebook sdk", this.fbPromise)
      this.googPromise = loadGoogleAuth2()
      this.googPromise.then(goog => this.goog = goog)
      this.loadingZone.addPromise("google auth api", this.googPromise)
    }
  }
</script>

<style scoped>

</style>