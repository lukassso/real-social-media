<template>
  <div class="register-form col-12 align-content-center">
    <div class="" v-if="state=='resent' || state=='done'">
      <div class="">
        <h2 class="">{{ i18n()[state].title }}</h2>
      </div>
      <div class="">
        <p>{{ i18n()[state].text({email}) }}</p>
      </div>
    </div>

    <div class="form-wrapper col-12 col-sm-8 col-md-6 card" v-if="state != 'resent' && state != 'done'">
      <div class="text-center card-title">
        <h2 class="">{{ i18n().title }}</h2>
      </div>
      <div class="">
        <div class="alert alert-danger" v-if="error">
          <span v-if="error">{{ i18n().errors[error] || error }}</span>
          <a href="#" @click="resend" v-if="error == 'registrationNotConfirmed'">{{ i18n().resendButton }}</a>
        </div>

        <b-form v-on:submit="register" v-bind:class="{ blurred: state == 'working' }">
          <b-form-group class="" :label="i18n().firstName ">
            <b-form-input class="" type="text" id="firstName" v-model="firstName" required ref="firstName" />
          </b-form-group>

          <b-form-group class="" :label="i18n().lastName">
            <b-form-input class="" type="text" id="lastName" v-model="lastName" required ref="lasttName"/>
         </b-form-group>

<!--
          <PhoneInput class="phoneNumber"
                      :value.sync="phoneNumber" :required="required" :invalid="phoneNumberInvalid"
                      :label="i18n().phoneNumber">
          </PhoneInput>
-->

          <b-form-group class="" :label="i18n().email ">
            <b-form-input class="" type="text" id="email" v-model="email" required ref="email"/>
          </b-form-group>

          <div class="alert alert-danger col-12 justify-content-center" v-if="passwordTooSimple">
            <span>{{ i18n().passwordTooSimple }}</span>
          </div>
          <b-form-group class="" :label="i18n().password ">

            <b-form-input class="" type="password" id="password" v-model="password" required ref="password" />
          </b-form-group>

          <b-form-group class="" :label="i18n().retypePassword ">
            <b-form-input class="" type="password" id="password2" v-model="password2" required ref="password2" />
          </b-form-group>
          <span v-if="notMatch" class="">{{ i18n().notMatch }}</span>

          <vue-recaptcha class="float-left" :sitekey="recaptchaSiteKey" @verify="verified" ref="recaptcha"></vue-recaptcha>

          <button class="btn" id="signupButton" type="submit">
            {{ i18n().submit }}
          </button>

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
  import PhoneInput from "@/components/inputs/PhoneInput.vue"

  function checkPassword(pass) {
    let digits = /\d/.test(pass)
    let lower = /[a-z]/.test(pass)
    let upper = /[A-Z]/.test(pass)
    return pass.length>=8 && digits && lower && upper
  }

  export default {
    name: 'RegisterEmail',
    metaInfo: {
      title: i18n().emailPassword.registerForm.title
    },
    components: {
      PhoneInput
    },
    data () {
      return {
        state: "ready",
        error: null,
        email: "",
        password: "",
        password2: "",
        firstName: "",
        lastName: "",
      /*  phoneNumber: "",
        phoneNumberInvalid: false,*/
        requiredFields: ['firstName', 'lastName', /*'phoneNumber',*/ 'email', 'password', 'password2'].reverse(),
        required: false,
        notMatch: false,
        captchaResponse: false,
        recaptchaSiteKey: GRECAPTCHA_SITE_KEY,
        recaptchaKey: null,
        passwordTooSimple: false
      }
    },
    computed: {
    },
    methods: {
      i18n() { return i18n().emailPassword.registerForm },
      verified(response) {
        console.log("VERIFIED", response)
        this.recaptchaKey = response
      },
      register(e) {
        e.preventDefault()

        let anyEmpty = false
        for(let fieldName of this.requiredFields) if(this[fieldName].trim() == '') {
          anyEmpty = true
          if(fieldName == "phoneNumber") {
            this.phoneNumberInvalid = true
            continue
          }
          let el = this.$refs[fieldName]
          el.parentElement.setAttribute('class', el.parentElement.getAttribute('class')+' is-invalid')
          el.focus()
        }
        if(anyEmpty) {
          this.required = true
          return;
        }

    /*    let sep = this.phoneNumber.indexOf(' ')
        console.log("PN",this.phoneNumber, sep)
        if( sep == -1
            || this.phoneNumber.slice(0, sep).trim().length == 0
            || this.phoneNumber.slice(sep+1).trim().length < 3
            || !this.phoneNumber.match(/^[0-9 #+-]+$/)) {
          console.log("PN INVALID",
            this.phoneNumber.slice(0, sep).trim().length == 0,
            this.phoneNumber.slice(sep+1).trim().length < 3,
            !this.phoneNumber.match(/^[0-9 #+-]+$/)
          )
          this.phoneNumberInvalid = false
          this.phoneNumberInvalid = true
          this.required = true
          return;
        }*/

        if(!this.recaptchaKey) {
          this.error = 'noRecaptcha'
          return;
        }

        this.passwordTooSimple = !checkPassword(this.password)
        console.log("CHECK PASSWORD", this.passwordTooSimple, this.password)
        if(this.passwordTooSimple) return

        if(this.password != this.password2) {
          this.notMatch = true
          this.$refs.password2.parentElement.setAttribute('class',
            this.$refs.password2.parentElement.getAttribute('class')+' is-invalid')
          this.$refs.password2.focus()
          return;
        }

        this.state = "working"

        let userData = {
          firstName : this.firstName,
          lastName : this.lastName,
          //phoneNumber : this.phoneNumber
        }

        api.request(["emailPassword", "startRegister"], {
          email: this.email,
          passwordHash: this.password,
          userData,
          recaptcha: this.recaptchaKey
        }).then(result => {
          this.state = "done"
        }).catch(error => {
          this.error = error
          this.state = "ready"
          this.recaptchaKey = null
          this.$refs.recaptcha.reset()

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
    updated () {
    },
    mounted () {
      window.lfvm = this
    }
  }
</script>

<style scoped>

  .register-form {
    display: flex;
    align-items: center;
    /*background: url(../../../static/images/voleadstools2.png);*/
    background-position: center;
    background-size: 280%;
    margin: 25px auto;
  }


  button {
    background: #1d0585;
    color: white;
    font-weight: 300;
    float: right;
  }

  button:hover {
    background: #2906bf;
    color: white;
    font-weight: 300;
  }


  form.blurred {
    filter: blur(2px);
  }

  form > div {
    margin-right: 1em;
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


/*  .phoneNumber {
    !*width: 300px;*!
    !*margin-right: 1em;*!
    box-sizing: border-box;
  }*/
  .form-wrapper {
    margin: 0 auto;
  }
  #signupButton {
    margin: 15px
  }
  .alert {
    margin: 0.5rem 0;
  }
  .wrapper {
    margin-top: 3rem;
  }
  .card-title {
    margin-top: 10px;
  }
  .register-form {
    min-width: 367px;
  }
  .form-wrapper {
    padding: 10px;
  }
</style>
