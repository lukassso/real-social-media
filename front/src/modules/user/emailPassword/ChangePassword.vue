<template>
  <div class="change-password col-sm-6 col-12">
    <div class="" v-if="state == 'done'">
      <div class="">
        <h2 class="">{{ i18n().done.title }}</h2>
      </div>
      <div class="">
        {{ i18n().done.text }}
      </div>
    </div>
    <div class="card">
      <form class="card-block" v-on:submit="change" v-if="state != 'done'">
        <div class="text-center card-title">
          <h2 class="">{{ i18n().title }}</h2>
        </div>
        <div class="">

          <div :class="{blurred: state=='working'}">
            <div class="serverError" v-if="error">{{ i18n().errors[error] || error }}</div>

            <b-form-group class="field col-12" :label="i18n().oldPassword">
              <b-form-input class="" type="password" id="oldPassword" v-model="oldPassword" required ref="oldPassword" />
            </b-form-group>

            <b-form-group class="field col-12" :label="i18n().newPassword">
              <b-form-input class="" type="password" id="newPassword1" v-model="newPassword1" required ref="newPassword1" />
            </b-form-group>

            <b-form-group class="field col-12" :label="i18n().newPassword">
              <b-form-input class="" type="password" id="newPassword2" v-model="newPassword2" required ref="newPassword2" />
              <span v-if="notMatch" class="">{{ i18n().notMatch }}</span>
            </b-form-group>
          </div>

          <div class="working" v-if="state == 'working'">
            <div class=""></div>
          </div>

        </div>

        <div class="" :class="{blurred: state=='working'}">
          <button type="submit" class="btn float-right">
            {{ i18n().submit }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
  import api from "api"
  import i18n from "i18n"

  export default {
    name: 'change-password',
    data () {
      return {
        oldPassword: '',
        newPassword1: '',
        newPassword2: '',
        state: 'ready',
        required: false,
        notMatch: false,
        error: null
      }
    },
    methods: {
      i18n() { return i18n().emailPassword.changePassword },
      change(e) {
        e.preventDefault()

        if(this.oldPassword.trim() == '' || this.newPassword1.trim() == '' || this.newPassword2.trim() == '') {
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
          if(this.oldPassword.trim()=='') {
            this.$refs.oldPassword.parentElement.setAttribute('class',
              this.$refs.oldPassword.parentElement.getAttribute('class')+' is-invalid')
            this.$refs.oldPassword.focus()
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
        api.request(["emailPassword", "updatePasswords"], {
          oldPasswordHash: this.oldPassword, newPasswordHash: this.newPassword1
        }).then(result => {
          this.state = "done"
        }).catch(error => {
          this.error = error
          this.state = "ready"
        })
      }
    },
    updated () {
    },
    mounted () {
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  .change-password {
    display: flex;
    align-items: center;
    flex-direction: column;
  }


  .blurred {
    filter: blur(2px) grayscale(50%);
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

  .serverError {
    color: darkred;
  }
  .card {
    padding: 10px;
    margin-bottom: 15px;
  }
</style>
