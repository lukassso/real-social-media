<template>
  <div class="account-settings">
    <!--<header class="">-->
      <!--<div class="mdl-layout__header-row">-->

        <!--<span>{{ i18n().title }}</span>-->

        <!--<div class=""></div>-->

      <!--</div>-->
    <!--</header>-->
    <div class="cards">
      <!-- <ChangeUserData></ChangeUserData> -->

      <ChangePassword></ChangePassword>

      <ChangeEmail></ChangeEmail>

      <ChangePhone></ChangePhone>
    </div>
  </div>
</template>

<script>
  import ChangePassword from "./emailPassword/ChangePassword.vue"
  import ChangeEmail from "./emailPassword/ChangeEmail.vue"
  import ChangePhone from "./phonePassword/ChangePhone.vue"
  import ChangeUserData from "./user/ChangeUserData.vue"

  import i18n from "i18n"

  export default {
    name: 'account-settings',
    metaInfo: {
      title: i18n().accountSettings.title
    },
    components: {
      ChangePassword, ChangeEmail, ChangePhone, ChangeUserData
    },
    data () {
      return {
      }
    },
    methods: {
      i18n() {return i18n().accountSettings}
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  @media screen and (max-width: 1024px) {
    .mdl-layout__header {
      display: block;
    }
  }


  .cards {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    max-width: 1000px;
    margin:auto;
  }

</style>
