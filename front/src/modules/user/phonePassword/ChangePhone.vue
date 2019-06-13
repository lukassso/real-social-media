<template>
  <div>
    <working-zone>

      <command-form v-if="state == 'change'" service="phonePassword" action="startPhoneChange"
                    @done="handleChangeStarted" v-slot="{ values, errors, error }" key="login">

        <phone-field name="newPhone" :label="i18n().newPhone"></phone-field>
        <password-field name="passwordHash" :label="i18n().currentPassword"></password-field>

        <b-button type="submit">{{ i18n().submit }}</b-button>
      </command-form>

      <command-form v-if="state == 'sms'" service="phonePassword" action="finishPhoneChange"
                    @done="() => state = 'done'" :parameters="{ newPhone }" key="sms">
        <p>{{ i18n().done.text({ phone: newPhone }) }}</p>
        <text-field name="code"></text-field>

        <b-button type="submit">Confirm</b-button>
      </command-form>

      <div v-if="state == 'done'">
        Phone number changed!
      </div>

    </working-zone>
  </div>
</template>

<script>

  import i18n from "i18n"

  export default {
    name: "ChangePhone",
    data() {
      return {
        state: 'change',
        newPhone: ''
      }
    },
    watch: {
    },
    methods: {
      i18n() { return i18n().phonePassword.startPhoneChange },
      handleChangeStarted({ result, parameters }) {
        this.state = 'sms'
        this.newPhone = parameters.newPhone
      }
    }
  }

</script>

<style scoped>

</style>