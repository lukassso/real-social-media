<template>

  <b-row>
    <label :for="id" class="col-sm-2 col-form-label">{{definition.title || name}}</label>
    <b-col sm="2" class="col-form-label">
      {{ value ? "true" : "false" }}
    </b-col>
    <b-col sm="8">
      <b-button
          :id="id"
          :variant="value ? 'success' : 'outline-success'"
          @click="()=>$emit('input', !value)">Toggle</b-button>
    </b-col>
  </b-row>

</template>

<script>
  export default {
    name: "BooleanEditor",
    props: ["name", "definition", "value"],
    computed: {
      id () {
        return ''+this._uid
      }
    }
  }
</script>

<style scoped>

</style>