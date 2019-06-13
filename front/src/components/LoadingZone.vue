<template>
  <div class="loading-zone">
    <div class="content" :class="{ loading: loading.length }">
      <slot></slot>
    </div>
    <div class="overlay" v-if="loading.length || errors.length">
      <slot name="loading" v-if="loading.length">
        <b-spinner label="Large Spinner"></b-spinner>
      </slot>
      <slot name="error" v-if="errors.length">
        <div v-for="error in errors" class="error">
          Loading of <b>{{ error.task.name }}</b> failed because of error <b>{{ error.reason }}</b>
        </div>
      </slot>
    </div>
  </div>
</template>

<script>
  export default {
    name: "LoadingZone",
    data() {
      return {
        loading: [],
        errors: []
      }
    },
    computed: {

    },
    methods: {
      loadingStarted(task) {
        this.loading.push(task)
        return task
      },
      loadingFinished(task) {
        let id = this.loading.indexOf(task)
        if(id == -1) throw new Error("Task not found")
        this.loading.splice(id, 1)
      },
      loadingFailed(task, reason) {
        let id = this.loading.indexOf(task)
        if(id == -1) throw new Error("Task not found")
        this.loading.splice(id, 1)
        this.errors.push({ task, reason })
      },
      addLoadingPromise(name, promise) {
        let task = this.loadingStarted({ name, promise })
        promise
          .catch((reason) => {
            console.error("LOADING OF", name, "FAILED", reason)
            this.loadingFailed(task, reason)
          })
        promise
          .then((result) => this.loadingFinished(task))
      }
    },
    provide() {
      return {
        loadingZone: {
          started: (task) => this.loadingStarted(task),
          finished: (task) => this.loadingFinished(task),
          failed: (task, reason) => this.loadingFailed(task, reason),
          addPromise: (name, promise) => this.addLoadingPromise(name, promise)
        }
      }
    }
  }
</script>

<style scoped>
  .loading-zone {
    position: relative;
  }
  .content {
    transition: filter 100ms linear;
    filter: none;
  }
  .content.loading {
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