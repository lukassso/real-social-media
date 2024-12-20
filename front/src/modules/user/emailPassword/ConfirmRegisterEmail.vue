<template>

  <div class="confirm-register" :class="{ guest: true }">

    <header v-if="false" class="">
      <div class="">
        <span>Confirm Email</span>
        <div class=""></div>
      </div>
    </header>

    <div class="textWrapper card" v-if="state=='loading'">
      <div class="">
        <h2 class="">{{ i18n().loading.title }}</h2>
      </div>
      <div class="">
        <div class=""></div>
        <p>{{ i18n().loading.text }}</p>
      </div>
    </div>

    <div class="textWrapper card"
         v-if="state=='used' || state=='expired' || state=='done' || state=='notFound' || state=='resent'">
      <div class="">
        <h2 class="">{{ i18n()[state].title }}</h2>
      </div>
      <div class="loading">
        <p>{{ i18n()[state].text }}</p>
        <p v-if="state=='expired'"><router-link :to="{name: 'register'}">{{ i18n().registerLink }}</router-link></p>
      </div>
      <div v-if="state=='done'" class="" :class="{blurred: state=='working'}">
        <button v-on:click="exit" class="btn">
          {{ i18n()[state].exitButton }}
        </button>
      </div>
    </div>
  </div>

</template>

<script>
  import api from "api"
  import i18n from "i18n"

  export default {
    name: 'confirm-register',
    data () {
      return {
        notMatch: false,
        error: null,
        state: 'loading',
        required: false,
        observable: null,
        keyState: false
      }
    },
    computed: {
      loggedIn() {
        return api.session.loggedIn
      },
      key() {
        return this.$route.params.key
      }
    },
    watch: {
      key() {
        this.readKey()
      },
      keyState(v) {
        if(this.state == 'loading') {
          if(!v) {
            this.state = 'notFound'
            return;
          }
          if(v.used) {
            this.state = 'used'
          } else if(v.expired) {
            this.state = 'expired'
          } else {
            this.state = "loading"
            api.request(["emailPassword", "finishRegister"], { key: this.key }).then(result => {
              this.state = "done"
            }).catch(error => {
              this.error = error
              this.state = "ready"
            })
          }
        }
      },
      loggedIn(v) {
      },
      resend(e) {
        e.preventDefault()

        this.state = "working"
        api.request(["emailPassword", "resendRegisterKey"], { email: this.email }).then(result => {
          this.state = "resent"
        }).catch(error => {
          this.error = error
          this.state = "ready"
          if (error == 'notFound') {
            this.$refs.email.parentElement.setAttribute('class',
              this.$refs.email.parentElement.getAttribute('class') + ' is-invalid')
            this.$refs.email.focus()
          }
        })
      }
    },
    methods: {
      i18n() { return i18n().emailPassword.finishRegister },

      readKey() {
        if(this.observable) this.observable.unbindProperty(this, "keyState")
        this.state = 'loading'
        this.observable = api.observable(['emailPassword', 'emailKey', {key: this.key}])
        //this.observable.value = undefined
        this.observable.bindProperty(this, "keyState")
      },
      exit() {
        this.$router.replace({ name: 'userIndex' })
      }
    },
    created() {
      this.readKey()
    },
    updated () {
      componentHandler.upgradeAllRegistered()
    },
    mounted () {
      componentHandler.upgradeAllRegistered()
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  @media screen and (max-width: 1024px) {
    .mdl-layout__header {
      display: block;
      margin-bottom: 3em;
    }
  }

  .guest.confirm-register {
    display: flex;
    align-items: center;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-position: center;
    background-size: 280%;
  }

  .mdl-card {
    width: 320px;
    margin: auto;
  }
  .guest .mdl-card__title {
    height: 110px;
    color: #fff;
    background-color:  #241d7f !important;
    background-size: 100px;
  }

  .guest button {
    color: white;
    font-weight: 300;
    float: right;
  }

  .guest button:hover {
    background: #2906bf;
    color: white;
    font-weight: 300;
  }



  form.blurred {
    filter: blur(2px);
  }

  .working {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    display: flex;
    text-align: center;
    align-items: center;
    background: rgba(255, 255, 255, 0.3);
  }
  .working div {
    margin: auto;
    height: 5em;
    width: 5em;
  }

  .error {
    height: 3em;
    font-size: 1.23em;
    color: #d00000;
  }

  .loading {
    display: flex;
    flex-direction: column;
    text-align: center;
    align-items: center;
  }

  .card {
    padding: 10px;
  }
  .textWrapper {
    margin: auto;
  }

</style>
