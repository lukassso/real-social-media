<template>
  <div>
    <working-zone>
      <command-form v-if="state == 'login'" service="phonePassword" action="login" @error="handleLoginError"
        v-slot="{ values, errors, error }" key="login">

        <div v-if="errors.passwordHash">
          <command-form
              service="phonePassword"
              action="startPasswordReset"
              :parameters="{ phone }"
              @done="handlePasswordResetStarted"
              key="resetButton">
            <b-button type="submit">{{ i18n().resetButton }}</b-button>
          </command-form>
        </div>

        <phone-field name="phone" :label="i18n().phone"></phone-field>
        <password-field name="passwordHash" :label="i18n().password"></password-field>

        <b-button type="submit">{{ i18n().submit }}</b-button>
      </command-form>

      <command-form v-if="state == 'reset'" service="phonePassword" action="finishPasswordReset"
                    :parameters="{ phone}" v-slot="{ values, errors }" key="reset">
        <p>{{ i18n().reset.text({ phone }) }}</p>
        <text-field name="code"></text-field>
        <double-password-field name="newPasswordHash" :label="reset_i18n().newPassword" :retypeLabel="reset_i18n().retypePassword">
        </double-password-field>
        <b-button type="submit">{{ reset_i18n().submit }}</b-button>
      </command-form>

      <div v-if="state == 'done'">
        Logged in!
      </div>

    </working-zone>
  </div>
</template>

<script>

  import i18n from "i18n"

  export default {
    name: "LoginPhone",
    data() {
      return {
        state: 'login',
        phone: ''
      }
    },
    watch: {
    },
    methods: {
      i18n() { return i18n().phonePassword.loginForm },
      reset_i18n() { return i18n().phonePassword.resetPassword },
      handleLoginError({error, parameters}) {
        this.phone = parameters.phone
      },
      handlePasswordResetStarted({ parameters }) {
        this.state = 'reset'
      }
    }
  }

</script>

<style scoped>

</style>