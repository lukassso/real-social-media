<template>

  <div class="confirm-email" :class="{ guest: !loggedIn }">

    <header v-if="loggedIn" class="">
      <div class="">
        <span>Confirm Email</span>
        <div class=""></div>
      </div>
    </header>

    <div class="textWrapper card" v-if="state=='loading'">
      <div class="">
        <h2 class="">{{ i18n().loading.title }}</h2>
      </div>
      <div class="loading">
        <div class="is-active"></div>
        <p>{{ i18n().loading.text }}</p>
      </div>
    </div>

    <div class="textWrapper card" v-if="state=='used' || state=='expired' || state=='done' || state=='notFound'">
      <div class="">
        <h2 class="">{{ i18n()[state].title }}</h2>
      </div>
      <div class="loading">
        <p>{{ i18n()[state].text }}</p>
      </div>
      <div v-if="state=='done'" class="" :class="{blurred: state=='working'}">
        <button v-on:click="exit" class="btn float-right">
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
    name: 'confirm-email',
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
          } else if(v.expire < Date.now()) {
            this.state = 'expired'
          } else {
            this.state = "loading"
            api.request(["emailPassword", "finishEmailChange"], { key: this.key }).then(result => {
              this.state = "done"
            }).catch(error => {
              this.error = error
              this.state = "ready"
            })
          }
        }
      }
    },
    methods: {
      i18n() { return i18n().emailPassword.finishEmailChange },

      readKey() {
        if(this.observable) this.observable.unbindProperty(this, "keyState")
        this.state = 'loading'
        this.observable = api.observable(['emailPassword', 'emailKey', { key: this.key }])
        //this.observable.value = undefined
        this.observable.bindProperty(this, "keyState")
      },
      exit() {
        this.$router.replace({ name: 'index' })
      }
    },
    created() {
      this.readKey()
    },
    updated () {
    },
    mounted () {
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

  .guest.confirm-email {
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


  .textWrapper {
    margin: auto;
  }
  .card {
    padding: 10px;
  }
</style>
