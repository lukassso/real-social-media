<template>
  <form-field-bind :name="name" v-slot="{ value, setValue, error }">
    <FieldTemplate :errorText="errorText" :error="error" :label="label || name" :name="name">
      <b-form-input type="text" :id="''+_uid" :value="value" @input="setValue" ref="field" />
    </FieldTemplate>
  </form-field-bind>
</template>

<script>
  import FieldTemplate from "./FieldTemplate.vue"

  export default {
    name: "TextField",
    components: {FieldTemplate},
    props: {
      name: {
        type: String,
        required: true
      },
      label: {
        type: String
      },
      errorText: {
        type: Object
      }
    }
  }

</script>

<style scoped>

</style>