<template>
  <div class="checkbox" v-on:click="toggle">
    <span>
      <i v-if="checked" class="material-icons">check_box</i>
      <i v-if="!checked" class="material-icons">check_box_outline_blank</i>
    </span>
    <span>{{ label }}</span>
  </div>
</template>

<script>
export default {
  name: 'checkbox',
  props: {
    checked: {
      type: Boolean
    },
    label: {
      type: String
    }
  },
  data () {
    return { }
  },
  methods: {
    toggle() {
      this.$emit('update:checked', !this.checked)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  .checkbox {
    cursor: default;
  }

  .checkbox i {
    position: relative;
    top: 6px;
  }
</style>
