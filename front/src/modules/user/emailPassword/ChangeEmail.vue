<template>
  <div class="change-email col-sm-6 col-12 float-right">
    <div class="" v-if="state == 'done'">
      <div class="">
        <h2 class="">{{ i18n().done.title }}</h2>
      </div>
      <div class="">
        {{ i18n().done.text({email: newEmail}) }}
      </div>
    </div>
    <div class="card">
      <form class="card-block" v-on:submit="change" v-if="state != 'done'">
        <div class="card-title text-center">
          <h2 class="">{{ i18n().title }}</h2>
        </div>
        <div class="">

          <div :class="{blurred: state=='working'}">
            <div class="serverError" v-if="error">{{ i18n().errors[error] || error }}</div>

            <b-form-group class="field col-12" :label="i18n().newEmail">
              <b-form-input class="" type="email" id="newEmail" v-model="newEmail" required ref="newEmail" />
            </b-form-group>

            <b-form-group class="field col-12" :label="i18n().currentPassword">
              <b-form-input class="" type="password" id="currentPassword" v-model="currentPassword" required ref="currentPassword" />
            </b-form-group>
          </div>

          <div class="working" v-if="state == 'working'">
            <div class="mdl-spinner mdl-js-spinner is-active"></div>
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
    name: 'change-email',
    data () {
      return {
        newEmail: '',
        currentPassword: '',
        state: 'ready',
        required: false,
        error: null
      }
    },
    methods: {
      i18n() { return i18n().emailPassword.startEmailChange },
      change(e) {
        e.preventDefault()

        if(this.newEmail.trim() == '') {
          this.required = true
          if(this.newEmail.trim()=='') {
            this.$refs.newEmail1.parentElement.setAttribute('class',
              this.$refs.newEmail1.parentElement.getAttribute('class') + ' is-invalid')
            this.$refs.newEmail1.focus()
          }
          return
        }

        this.state = "working"
        api.request(["emailPassword", "startEmailChange"],
            { newEmail:  this.newEmail, passwordHash: this.currentPassword }).then(result => {
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

  .change-email {
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
