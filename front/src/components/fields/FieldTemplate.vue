<template>
  <b-form-group :label="label">
    <b-col sm="7">
      <slot></slot>
    </b-col>
    <b-col sm="3">
      <small class="text-danger">
        {{ (errorText && errorText[error]) || error }}
      </small>
    </b-col>
  </b-form-group>
</template>

<script>
  export default {
    name: "FieldWithError",
    props: {
      error: {
        type: String
      },
      label: {
        type: String
      },
      name: {
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