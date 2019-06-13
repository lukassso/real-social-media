<template>
  <form-field-bind :name="name" v-slot="{ value, setValue, error }">
    <FieldTemplate :errorText="errorText" :error="error" :label="label || name" :name="name">
      <b-form-input type="date" :value="value" @input="setValue"></b-form-input>
    </FieldTemplate>
  </form-field-bind>
</template>

<script>
  import FieldTemplate from "./FieldTemplate.vue"

  export default {
    name: "DateField",
    components: { FieldTemplate },
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
    },
    methods: {
    }

  }

</script>

<style scoped>

</style>