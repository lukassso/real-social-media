<template>
  <form-field-bind :name="name" v-slot="{ value, setValue, error }">
    <FieldTemplate :errorText="errorText" :error="error" :label="label || name" :name="name">
      <CountryInput class="country"
                  :value="value" @input="setValue" :required="required" :invalid="!!error">
      </CountryInput>
    </FieldTemplate>
  </form-field-bind>
</template>

<script>
  import FieldTemplate from "./FieldTemplate.vue"
  import CountryInput from "@/components/inputs/CountryInput.vue"

  export default {
    name: "CountryField",
    components: { FieldTemplate, CountryInput },
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
      },
      required: {
        type: Boolean,
        default: false
      }
    }

  }

</script>

<style scoped>

</style>