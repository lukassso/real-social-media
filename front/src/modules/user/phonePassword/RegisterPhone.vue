<template>
  <div>
    <working-zone>
      <command-form v-if="state == 'form'" service="phonePassword" action="startRegister" @done="handleRegisterStarted"
        v-slot="{ values }" key="form">

        <phone-field name="phone" :label="i18n().phone"></phone-field>
        <text-field name="userData.firstName" :label="i18n().firstName"></text-field>
        <text-field name="userData.lastName" :label="i18n().lastName"></text-field>
        <double-password-field name="passwordHash" :label="i18n().password" :retypeLabel="i18n().retypePassword">
        </double-password-field>

        <b-button type="submit">Register</b-button>
      </command-form>
      <command-form v-if="state == 'sms'" service="phonePassword" action="finishRegister" @done="() => state = 'done'"
        :parameters="{ phone }" key="sms">
        <p>{{ i18n().done.text({ phone }) }}</p>
        <text-field name="code"></text-field>

        <b-button type="submit">Confirm</b-button>
      </command-form>
      <div v-if="state == 'done'">
        Registered!
      </div>
    </working-zone>
  </div>
</template>

<script>

  import i18n from "i18n"

  export default {
    name: "RegisterPhone",
    data() {
      return {
        state: 'form',
        phone: ''
      }
    },
    watch: {
    },
    methods: {
      i18n() { return i18n().phonePassword.registerForm },
      handleRegisterStarted({ parameters }) {
        this.state = 'sms'
        this.phone = parameters.phone
      }
    }
  }

</script>

<style scoped>

</style>