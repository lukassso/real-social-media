<template>
  <div class="form-group container col-11 col-sm-8 col-md-6  align-self-center card loginContainer">
    <div class="" v-if="state=='reset' || state=='resent'">
      <div class="">
        <h2 class="">{{ i18n()[state].title }}</h2>
      </div>
      <div class="">
        <p>{{ i18n()[state].text({email}) }}</p>
      </div>
    </div>

    <div class="" v-if="state != 'reset' && state != 'resent' && state != 'done'">
      <div class="col-12">
        <h2 class="card-title text-center">{{ i18n().title }}</h2>
      </div>
      <div>

        <div class="alert alert-danger" v-if="error">
          <span v-if="error">{{ i18n().errors[error] || error }}</span>
          <a href="#" @click="resetPassword" v-if="error == 'wrongPassword'">{{ i18n().resetButton }}</a>
          <a href="#" @click="resend" v-if="error == 'registrationNotConfirmed'">{{ i18n().resendButton }}</a>
        </div>

        <b-form class="" v-on:submit="login" v-bind:class="{ blurred: state == 'working' }">
            <b-form-group class="" :label="i18n().email" label-for="email">
              <b-form-input type="email" id="email" v-model="email" required ref="email"/>
            </b-form-group>

          <b-form-group :label="i18n().password" label-for="password">
            <b-form-input type="password" id="password" v-model="password" required ref="password"/>
          </b-form-group>
          <div id="buttonContainer">
            <button class="btn" id="submitButton"  type="submit"> {{i18n().submit}} </button>
          </div>
            <p class="">{{ i18n().registerText }} <router-link :to="{name: 'emailPassword:register'}">{{ i18n().registerLink }}</router-link></p>
        </b-form>

        <div class="working" v-if="state == 'working'">
          <div class=""></div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
  import i18n from "i18n"
  import api from "api"

  export default {
    name: 'LoginEmail',
    metaInfo: {
      title: i18n().emailPassword.loginForm.title
    },
    data () {
      return {
        state: "ready",
        error: null,
        email: "",
        password: "",
        required: false,
      }
    },
    methods: {
      i18n() { return i18n().emailPassword.loginForm },
      login(e) {
        e.preventDefault()

        if(this.email.trim()=='' || this.password.trim()=='') {
          this.required = true
          if(this.email.trim()=='') {
            this.$refs.email.parentElement.setAttribute('class',
              this.$refs.email.parentElement.getAttribute('class')+' is-invalid')
            this.$refs.email.focus()
          }
          if(this.password.trim()=='') {
            this.$refs.password.parentElement.setAttribute('class',
              this.$refs.password.parentElement.getAttribute('class')+' is-invalid')
            this.$refs.password.focus()
          }
          return
        }

        this.state = "working"
        api.request(["emailPassword", "login"], {email: this.email, passwordHash: this.password}).then(result => {
          this.state = "done"
        }).catch(error => {
          this.error = error
          this.state = "ready"
          if(error == 'notFound') {
            this.$refs.email.parentElement.setAttribute('class',
              this.$refs.email.parentElement.getAttribute('class')+' is-invalid')
            this.$refs.email.focus()
          }
          if(error == 'wrongPassword') {
            this.$refs.password.parentElement.setAttribute('class',
              this.$refs.password.parentElement.getAttribute('class')+' is-invalid')
            this.$refs.password.focus()
          }
        })
      },
      resetPassword(e) {
        e.preventDefault()

        this.state = "working"
        api.request(["emailPassword", "startPasswordReset"], {email: this.email}).then(result => {
          this.state = "reset"
        }).catch(error => {
          this.error = error
          this.state = "ready"
          if (error == 'notFound') {
            this.$refs.email.parentElement.setAttribute('class',
              this.$refs.email.parentElement.getAttribute('class') + ' is-invalid')
            this.$refs.email.focus()
          }
        })
      },
      resend(e) {
        e.preventDefault()

        this.state = "working"
        api.request(["emailPassword", "resendRegisterKey", {email: this.email}], this.email).then(result => {
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
    updated () {
    },
    mounted () {
      window.lfvm = this
    }
  }
</script>

<style scoped>

.form-group {
  margin: auto;
}
form {
  margin-bottom: 15px;
}
#submitButton {
  margin: 20px 0 10px 0;
}
#buttonContainer {
  display: flex;
  width: 100%;
  flex-direction: row;
  justify-content: flex-end;
}
.card-title, .b-form-group {
  margin-top: 10px;
}
.card {
  padding: 10px;
}
.loginContainer {
  max-width: 1200px;
}

</style>
