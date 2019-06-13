<template>
  <div class="working-zone">
    <div class="content" :class="{ working: working.length }">
      <slot></slot>
    </div>
    <div class="overlay" v-if="working.length || errors.length">
      <slot name="working" v-if="working.length">
        <b-spinner label="Large Spinner"></b-spinner>
      </slot>
      <slot name="error" v-if="errors.length">
        <div v-for="error in errors" class="error">
          Processing of <b>{{ error.task.name }}</b> failed because of error <b>{{ error.reason }}</b>
        </div>
      </slot>
    </div>
  </div>
</template>

<script>
  import api from "@/api"

  export default {
    name: "WorkingZone",
    data() {
      return {
        working: [],
        errors: []
      }
    },
    computed: {

    },
    methods: {
      workingStarted(task) {
        this.working.push(task)
        return task
      },
      workingFinished(task) {
        let id = this.working.indexOf(task)
        if(id == -1) throw new Error("Task not found")
        this.working.splice(id, 1)
      },
      workingFailed(task, reason) {
        let id = this.working.indexOf(task)
        if(id == -1) throw new Error("Task not found")
        this.working.splice(id, 1)
        this.errors.push({ task, reason })
      },
      addLoadingPromise(name, promise) {
        let task = this.workingStarted({ name, promise })
        promise
          .then((result) => this.workingFinished(task))
        promise
          .catch((reason) => {
            this.workingFailed(task, reason)
          })
      }
    },
    provide() {
      return {
        workingZone: {
          started: (task) => this.workingStarted(task),
          finished: (task) => this.workingFinished(task),
          failed: (task, reason) => this.workingFailed(task, reason),
          addPromise: (name, promise) => this.addLoadingPromise(name, promise)
        }
      }
    }
  }
</script>

<style scoped>
  .working-zone {
    position: relative;
  }
  .content {
    transition: filter 100ms linear;
    filter: none;
  }
  .content.working {
    filter: blur(3px);
  }

  .overlay {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
  }

  .b-spinner {
    width: 3rem;
    height: 3rem;
  }
</style>