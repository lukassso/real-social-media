<template>

  <b-row>
    <label :for="id" class="col-sm-2 col-form-label">{{definition.title || name}}</label>
    <b-col sm="10">
      <b-form-input :id="id"
                    :value="value"
                    @input="v => $emit('input', v)"
                    type="text"
                    :placeholder="placeholder || definition.placeholder || ''"></b-form-input>
    </b-col>
  </b-row>

</template>

<script>
  export default {
    name: "TextEditor",
    props: ["placeholder", "name", "definition", "value"],
    computed: {
      id () {
        return ''+this._uid
      }
    }
  }
</script>

<style scoped>

</style>