<template>
  <div class="confirm-holder">
    <b-card>
      <b-card-title>{{ title }}</b-card-title>
      <b-card-body>{{ text }}</b-card-body>
      <b-button class="card-link" @click="yesClick">{{ yes }}</b-button>
      <b-button class="card-link" @click="noClick">{{ no }}</b-button>
    </b-card>
  </div>
</template>

<script>
  export default {
    name: "ConfirmDialog",
    props: {
      title: {
        type: String,
        required: true
      },
      text: {
        type: String,
        required: true
      },
      yes: {
        type: String,
        default: "Yes"
      },
      no: {
        type: String,
        default: "No"
      }
    },
    methods: {
      yesClick() {
        this.$emit("yes")
        this.$emit("close")
      },
      noClick() {
        this.$emit("no")
        this.$emit("close")
      }
    }
  }
</script>

<style scoped>
  .confirm-holder {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0,0,0,0.4);
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>