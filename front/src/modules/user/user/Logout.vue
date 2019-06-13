<template>
  <div class="logout-page">
    <div class="card">
      <div class="card-title">
        <h2 class="text-center">{{ i18n()[state].title }}</h2>
      </div>
      <div class=" loading">
        <p>{{ i18n()[state].text }}</p>
        <router-link :to="{ name: 'emailPassword:login' }" v-if="state=='done'"
                     class="btn float-right" type="submit">
          {{ i18n().login }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
  import i18n from "i18n"
  import api from "api"

  export default {
    name: 'login-form',
    metaInfo: {
      title: i18n().user.logout.title
    },
    data () {
      return {
        error: null,
        email: "",
        password: "",
        required: false,
      }
    },
    computed: {
      state() {
        return api.session.loggedIn ? 'working' : 'done'
      }
    },
    methods: {
      i18n() { return i18n().user.logout }
    },
    updated () {
    },
    mounted () {
      api.request(["session", "logout"],{}).then(ok => {
        // ??
      })
    }
  }
</script>

<style scoped>

  .logout-page {
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

  .card {
    width: 320px;
    margin: auto;
    padding: 10px;
  }

  button {
    color: white;
    font-weight: 300;
    float: right;
  }


</style>
