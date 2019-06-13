<template>
  <div class="app">
    <div class="top-bar">

    </div>
    <div class="main">
      <div class="menu">
        <MainMenu></MainMenu>
      </div>
      <div class="center">
        <loading-zone>
          <working-zone>
            <router-view/>
          </working-zone>
        </loading-zone>
      </div>
    </div>
    <overlay-component :overlayModel = overlayModel></overlay-component>
  </div>
</template>

<script>
  import 'bootstrap/dist/css/bootstrap.css'
  import 'bootstrap-vue/dist/bootstrap-vue.css'

  import i18n from "i18n"
  import api from "api"

  import { OverlayComponent } from './components/utils/overlayLayer.js'
  import overlayModel from './components/utils/overlayModel.js'

  import MainMenu from "@/components/MainMenu.vue"

  export default {
    name: 'app',
    components: {
      MainMenu, OverlayComponent
    },
    computed: {
      overlayModel() {
        return overlayModel
      },
      session() {
        return api.session.session
      }
    }
  }
</script>

<style>
  body {
    padding: 0;
    margin: 0;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
  }

  .overlayLayer {
    position: fixed;
    top: 0;
    left: 0;
    height: 0;
    width: 0;
    overflow: visible;
    z-index: 10;
  }
  .overlayAnchor {
    position: absolute;
    display: flex;
    width: auto;
    height: auto;
  }

</style>
<style lang="scss" scoped>
  .app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .top-bar {
    flex-grow: 0;
    background: black;
    height: 3em;
    border-bottom: 1px solid #282828;
  }

  .main {
    flex-grow: 1;
    display: flex;
    flex-direction: row;
  }

  .menu {
    background: black;
    flex-grow: 0;
    width: 250px;
  }

  .center {
    flex-grow: 1;
    text-align: left;
    overflow-y: auto;
    padding: 1em;
  }




</style>
