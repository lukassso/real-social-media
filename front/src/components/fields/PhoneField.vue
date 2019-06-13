<template>
  <form-field-bind :name="name" v-slot="{ value, setValue, error }">
    <FieldTemplate :errorText="errorText" :error="error" :label="label" :name="name">
      <PhoneInput class="phoneNumber"
                  :value="value" @input="setValue" :required="required" :invalid="!!error">
      </PhoneInput>
    </FieldTemplate>
  </form-field-bind>
</template>

<script>
  import FieldTemplate from "./FieldTemplate.vue"
  import PhoneInput from "@/components/inputs/PhoneInput.vue"

  export default {
    name: "PhoneField",
    components: { FieldTemplate, PhoneInput },
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