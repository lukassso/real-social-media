<template>
  <div class="MenuItem" :class="'menu-item-level-'+level">
    <span @click="toggleOpen">
      <v-icon
          v-if="item.submenu"
          :name="isOpen ? 'minus-square' : 'plus-square'"
          :scale="4/(4+level)">
      </v-icon>
    </span>
    <router-link :to="item.route" v-if="item.route">
      <v-icon v-if="item.icon" :name="item.icon" :scale="4/(4+level)"></v-icon>
      &nbsp;<span class="link-text">{{ item.title }}</span>
    </router-link>
    <span v-if="!item.route">
      <v-icon v-if="item.icon" :name="item.icon" :scale="4/(4+level)"></v-icon>
      &nbsp;<span class="link-text">{{ item.title }}</span>
    </span>
    <div v-if="isOpen" class="submenu">
      <MenuItem
          v-for="subitem in item.submenu"
          :key="subitem.title"
          :level="level + 1"
          :item="subitem"
          :path="[...path, subitem.title]"
          :openPath="openPath"
          @open="(path) => $emit('open', path)"
          @close="(path) => $emit('close', path)">
      </MenuItem>
    </div>
  </div>
</template>

<script>
  export default {
    name: "MenuItem",
    props: {
      item: {},
      level: {},
      path: {},
      openPath: {}
    },
    computed: {
      isOpen() {
        if(this.path.length > this.openPath.length) return false
        return JSON.stringify(this.openPath.slice(0, this.path.length)) == JSON.stringify(this.path)
      }
    },
    methods: {
      toggleOpen() {
        console.log("TOGGLE")
        if(this.isOpen) this.$emit("close", this.path)
          else this.$emit("open", this.path)
      }
    }
  }
</script>

<style scoped>
  .MenuItem {
    color: white;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  a {
    color: white;
    text-decoration: none;
  }
  a:visited {
    color: white;
  }
  a:hover {
    color: white;
  }

  .submenu {
    padding-left: 0.5em;
  }

  .menu-item-level-0 {
    font-size: 1.0em;
  }
  .menu-item-level-1 {
    font-size: 0.9em;
  }
  .menu-item-level-2 {
    font-size: 0.8em;
  }

  svg {
    vertical-align: middle;
  }
  .link-text {
    display: inline-block;
    vertical-align: middle;
  }

</style>