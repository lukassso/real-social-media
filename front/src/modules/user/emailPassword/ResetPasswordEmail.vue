"<template>
  <div class="reset-password col-12 ">
    <div class="resetPasswordWrapper card" v-if="state=='loading'">
      <div class=" text-center">
        <h2 class="">{{ i18n().loading.title }}</h2>
      </div>
      <div class="loading">
        <div class="is-active"></div>
        <p>{{ i18n().loading.text }}</p>
      </div>
    </div>

    <div class="" v-if="state=='used' || state=='expired' || state=='done' || state=='notFound'">
      <div class="col-10 text-center">
        <h2 class="">{{ i18n()[state].title }}</h2>
      </div>
      <div class="loading">
        <p>{{ i18n()[state].text }}</p>
      </div>
      <div v-if="state =='done'" class="" :class="{blurred: state=='loging'}">
        <button @click="login" class="">
          {{ i18n()[state].loginButton }}
        </button>
      </div>
    </div>

    <div class="col-6 resetPasswordWrapper card" v-if="state=='ready' || state=='working'">
      <div class="col-10 text-center card-title">
        <h2 class="">{{ i18n().title }}</h2>
      </div>
      <div class="">

        <div class="alert alert-danger col-12 text-center" v-if="error">
          <span v-if="error">{{ i18n().errors[error] || error }}</span>
        </div>

        <b-form v-on:submit="change" v-bind:class="{ blurred: state == 'working' }">

          <b-form-group class="field col-10" :label="i18n().newPassword">
            <b-form-input class="" type="password" id="newPassword1" v-model="newPassword1" required ref="newPassword1" />
          </b-form-group>

          <b-form-group class="field col-10" :label="i18n().newPassword">
            <b-form-input class="" type="password" id="newPassword2" v-model="newPassword2" required ref="newPassword2" />
            <span v-if="notMatch" class="">{{ i18n().notMatch }}</span>
          </b-form-group>

          <button type="submit" class="btn float-right">
            {{ i18n().submit }}
          </button>

        </b-form>

        <div class="working" v-if="state == 'working'">
          <div class="mdl-spinner mdl-js-spinner is-active"></div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
  import api from "api"
  import i18n from "i18n"

  export default {
    name: 'reset-password',
    data () {
      return {
        notMatch: false,
        error: null,
        state: 'loading',
        required: false,
        newPassword1: '',
        newPassword2: '',
        observable: null,
        keyState: false
      }
    },
    computed: {
      key() {
        return this.$route.params.key
      }
    },
    watch: {
      key() {
        this.readKey()
      },
      keyState(v) {
        if(this.state!='done' && v && v.expired) {
          this.state='expired'
          return
        }
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
            this.state = 'ready'
          }
        }
      }
    },
    methods: {
      i18n() { return i18n().emailPassword.resetPassword },

      readKey() {
        if(this.observable) this.observable.unbindProperty(this, "keyState")
        this.state = 'loading'
        this.observable = api.observable(['emailPassword', 'emailKey', {key: this.key}])
        //this.observable.value = undefined
        this.observable.bindProperty(this, "keyState")
      },

      change(e) {
        e.preventDefault()

        if(this.newPassword1.trim() == '' || this.newPassword2.trim() == '') {
          this.required = true
          if(this.newPassword2.trim()=='') {
            this.$refs.newPassword2.parentElement.setAttribute('class',
              this.$refs.newPassword2.parentElement.getAttribute('class')+' is-invalid')
            this.$refs.newPassword2.focus()
          }
          if(this.newPassword1.trim()=='') {
            this.$refs.newPassword1.parentElement.setAttribute('class',
              this.$refs.newPassword1.parentElement.getAttribute('class')+' is-invalid')
            this.$refs.newPassword1.focus()
          }
          return
        }

        this.notMatch = (this.newPassword1 != this.newPassword2)
        if(this.notMatch) {
          this.$refs.newPassword2.parentElement.setAttribute('class',
            this.$refs.newPassword2.parentElement.getAttribute('class')+' is-invalid')
          this.$refs.newPassword2.focus()
          return;
        }

        this.state = "working"
        api.request(["emailPassword", "finishPasswordReset"], { key: this.key, newPasswordHash: this.newPassword1 }).then(result => {
          this.state = "done"
        }).catch(error => {
          this.error = error
          this.state = "ready"
        })
      },

      login() {
        this.state = "loging"
        api.request(["emailPassword", "login"], { email: this.keyState.email, passwordHash: this.newPassword1 }).then(result => {
          this.state = "done"
        }).catch(error => {
          this.error = error
          this.state = "done"
          this.$router.replace({name: 'index'})
        })
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

  .reset-password {
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

  button {
    font-weight: 300;
    float: right;
  }

  button:hover {
    background: #2906bf;
    color: white;
    font-weight: 300;
  }

  .mdl-card__supporting-text {
    position: relative;
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
  .resetPasswordWrapper {
    margin: auto;
  }
  .card-title {
    margin-top: 10px;
  }
  .card {
    padding: 10px;
  }
</style>
