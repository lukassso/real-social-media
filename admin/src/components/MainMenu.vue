<template>
  <div class="MainMenu">
    <MenuItem
        v-for="item in menu"
        :key="item.title"
        :level="0"
        :item="item"
        :path="[item.title]"
        :openPath="openPath"
        @open="open"
        @close="close">
    </MenuItem>
  </div>
</template>

<script>
  import apiExplorerMenu from "@/modules/api-explorer/menu.js"
  import crudMenu from "@/modules/crud/menu.js"
  import MenuItem from "./MenuItem.vue"

  export default {
    name: "MainMenu",
    components: { MenuItem },
    reactive: {
      serviceDefinitions: ['metadata', 'serviceDefinitions']
    },
    data() {
      return {
        openPath: []
      }
    },
    computed: {
      menu() {
        return [
          ...(this.serviceDefinitions ? apiExplorerMenu(this.serviceDefinitions) : []),
          ...(this.serviceDefinitions ? crudMenu(this.serviceDefinitions) : [])
        ]
      }
    },
    methods: {
      open(path) {
        console.log("OPEN", path)
        this.openPath = path.slice()
      },
      close(path) {
        console.log("CLOSE", path)
        this.openPath = path.slice(0, -1)
      }
    }
  }
</script>

<style scoped>
  .MainMenu {
    text-align: left;
    padding: 1em;
  }

</style>