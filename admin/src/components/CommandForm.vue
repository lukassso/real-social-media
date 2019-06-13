<template>
  <div>
    <form v-if="state == 'ready' || state =='working'" v-on:submit="handleSubmitEvent">
      <slot></slot>
    </form>
    <div v-if="state == 'error'">
      <slot name="error">
        <b-alert show variant="danger">error</b-alert>
      </slot>
    </div>
    <div v-if="state == 'done'">
      <slot name="done">
        <b-alert show variant="success">success</b-alert>
      </slot>
    </div>
  </div>
</template>

<script>
  import api from "@/api"
  import validators from "@/../../validation"

  function setByPath(obj, path, value) {
    if(path.length > 1) {
      if(typeof obj[path[0]] != 'object' || obj[path[0]] == null) obj[path[0]] = {}
      setByPath(obj[path[0]], path.slice(1), value)
    } else {
      obj[path[0]] = value
    }
  }

  class FormValue {
    constructor(definition) {
      this.definition = definition

      this.value = null
      this.error = null

      this.errorObservers = []
      this.valueObservers = []
      this.validators = []
      if(definition.validation) {
        let validations = Array.isArray(definition.validation) ? definition.validation : [definition.validation]
        const context = { service: this.serviceDefinition, action: this.actionDefinition, property: definition }
        this.validators = this.validators.concat(
            validations.map(validation => typeof validation == 'string'
                ? validators[validation]({}, context)
                : validators[validation.name](validation, context)
            )
        )
      }
    }

    setValue(value) {
      this.value = value
      for(let observer of this.valueObservers) observer(value)
    }
    setError(error) {
      this.error = error
      for(let observer of this.errorObservers) observer(error)
    }
    getValue() {
      return this.value
    }

    reset(initialValue) {
      if(this.definition.type) {
        let defaultValue = this.definition.defaulValue || null
        if(!defaultValue) {
          switch(this.definition.type) {
            case "String" : defaultValue = ""; break;
            case "Object" : defaultValue = {}; break;
            case "Number" : defaultValue = 0; break;
            case "Array"  : defaultValue = []; break;
          }
        }
        this.setValue(initialValue || defaultValue)
      }
      this.setError(null)
    }

    observe(observer) {
      this.valueObservers.push(observer)
      observer(this.value)
    }

    unobserve(observer) {
      const id = this.valueObservers.indexOf(observer)
      if(id == -1) throw new Error("Observer not found")
      this.valueObservers.splice(id, 1)
    }

    observeError(observer) {
      this.errorObservers.push(observer)
      observer(this.error)
    }

    unobserveError(observer) {
      const id = this.errorObservers.indexOf(observer)
      if(id == -1) throw new Error("Observer not found")
      this.errorObservers.splice(id, 1)
    }

    validate(formValues, propName, actionDefinition) {
      let promises = []
      for(let validator of this.validators) {
        promises.push(validator(this.value, formValues, propName, actionDefinition))
      }
      return Promise.all(promises).then(results => {
        for(let error of results) {
          if(this.error == error) return error
          if(error) {
            this.setError(error)
            return error
          }
        }
      })
    }

    clearValidation() {
      this.setError(null)
    }
  }

  class FormObject extends FormValue {
    constructor(definition) {
      super(definition)

      this.properties = {}

      for(let propName in definition.properties) {
        let propDefn = definition.properties[propName]

        if(propDefn.type == "Object") {
          this.properties[propName] = new FormObject(definition.properties[propName])
        } else if(propDefn.type == 'Array') {
          this.properties[propName] = new FormArray(definition.properties[propName])
        } else {
          this.properties[propName] = new FormValue(definition.properties[propName])
        }
      }
    }

    reset(initialValue) {
      for(let propName in this.properties) {
        this.properties[propName].reset(initialValue && initialValue[propName])
      }
    }

    validate(formValues, name, actionDefinition) {
      let anyError = false
      let promises = [super.validate(formValues, name, actionDefinition)]
      for(let propName in this.properties) {
        promises.push(this.properties[propName].validate(formValues, name+'.'+propName, actionDefinition))
      }
      return Promise.all(promises).then(results => {
        for(let result of results) {
          anyError = !!result || anyError
        }
        return anyError
      })
    }

    clearValidation() {
      super.clearValidation()
      for(let propName in this.properties) {
        this.properties[propName].clearValidation()
      }
    }

    getValue() {
      let obj = JSON.parse(JSON.stringify(super.getValue())) || {}
      for(let propName in this.properties) {
        obj[propName] = this.properties[propName].getValue()
      }
      return obj
    }
  }

  class FormArray extends FormValue {
    constructor(definition) {
      super(definition)
      this.elementDefinition = definition.of
      this.elements = []
    }
    newElement() {
      if(this.elementDefinition.type == "Object") {
        return new FormObject(this.elementDefinition)
      } else if(this.elementDefinition.type == 'Array') {
        return new FormArray(this.elementDefinition)
      } else {
        return new FormValue(this.elementDefinition)
      }
    }
    reset(initialValue) {
      initialValue = initialValue || this.definition.defaultValue || []
      for(let el of initialValue) {
        let n = this.newElement()
        n.reset(el)
        this.elements.push(n)
      }
      super.setValue(initialValue)
    }
    validate(formValues, name, actionDefinition) {
      let anyError = false
      let promises = [super.validate(formValues, name, actionDefinition)]
      for(let propName in this.elements) {
        promises.push(this.elements[propName].validate(formValues, name+'.'+propName, actionDefinition))
      }
      return Promise.all(promises).then(results => {
        for(let result of results) {
          anyError = !!result || anyError
        }
        return anyError
      })
    }
    clearValidation() {
      super.clearValidation()
      for(let propName in this.properties) {
        this.properties[propName].clearValidation()
      }
    }

    getValue() {
      let arr = JSON.parse(JSON.stringify(super.getValue())) || []
      arr.length = this.elements.length
      for(let i = 0; i < this.elements.length; i++) {
        arr[i] = this.elements[i].getValue()
      }
      return arr
    }

    addElement(initialValue) {
      let el = this.newElement()
      el.reset(initialValue)
      this.elements.push(el)
      this.setValue(this.getValue())
    }

    removeElement(i) {
      this.elements.splice(i, 1)
      this.setValue(this.getValue())
    }
  }

  export default {
    name: "CommandForm",
    props: {
      service: {
        type: String,
        required: true
      },
      action: {
        type: String,
        required: true
      },
      parameters: {
        type: Object,
        default() { return {} }
      },
      initialValues: {
        type: Object,
        default: null
      }
    },
    provide() {
      return {
        form: {
          service: this.service,
          action: this.action,
          getFieldDefinition: (name) => this.getFieldDefinition(name),
          getFieldValue: (name) => this.getFieldValue(name),
          setFieldValue: (name, value) => this.setFieldValue(name, value),
          getFieldError: (name) => this.getFieldError(name),
          setFieldError: (name, value) => this.setFieldError(name, value),
          getAction: () => this.actionDefinition,
          submit: () => this.submit(),
          reset: () => this.reset(),
          observe: (propName, observer) => this.observe(propName, observer),
          unobserve: (propName, observer) => this.observe(propName, observer),
          observeError: (propName, observer) => this.observeError(propName, observer),
          unobserveError: (propName, observer) => this.observeError(propName, observer),
          addValidator: (propName, validator) => this.addValidator(propName, validator),
          removeValidator: (propName, validator) => this.addValidator(propName, validator),
          validateField: (propName) => this.validateField(propName),
          validate: () => this.validate(),
          clearFieldValidation: (propName) => this.clearFieldValidation(propName),
          clearValidation: () => this.clearValidation(),

          addElementToArray: (propName, initialValue) => this.addElementToArray(propName, initialValue),
          removeElementFromArray: (propName, index) => this.removeElementFromArray(propName, index)
        }
      }
    },
    inject: ['loadingZone', 'workingZone'],
    data() {
      return {
        state: 'loading',
        error: null,
        loadingTask: null,
        formRoot: {}
      }
    },
    computed: {
      serviceDefinitionsError() {
        return api.metadata.serviceDefinitionsError
      },
      serviceDefinition() {
        return api.metadata.serviceDefinitions
          && api.metadata.serviceDefinitions.find(service => service.name == this.service)
      },
      actionDefinition() {
        return this.serviceDefinition
          && this.serviceDefinition.actions[this.action]
      },
      definitionNotFound() {
        return api.metadata.serviceDefinitions && !this.actionDefinition
      },
      loadingError() {
        return this.definitionNotFound ? "notFound" : this.serviceDefinitionsError
      }
    },
    methods: {
      getNode(name) {
        let np = name.split('.')
        let node = this.formRoot
        for(let p of np) {
          if(node.properties) node = node.properties[p]
          else if(node.elements) node = node.elements[p]
          if(!node) return null
        }
        return node
      },
      getFieldDefinition(name) {
        return this.getNode(name).definition
      },
      getFieldValue(name) {
        return this.getNode(name).getValue()
      },
      setFieldValue(name, value) {
        this.getNode(name).setValue(value)
      },
      getFieldError(name) {
        return this.getNode(name).error
      },
      setFieldError(name, error) {
        return this.getNode(name).setError(error)
      },
      getAction() {
        return this.actionDefinition
      },
      initForm() {
        this.formRoot = new FormObject(this.actionDefinition)
        this.reset()
      },
      reset() {
        this.formRoot.reset(this.initialValues)
      },
      observe(name, observer) {
        this.getNode(name).observe(observer)
      },
      unobserve(name, observer) {
        this.getNode(name).unobserve(observer)
      },
      observeError(name, observer) {
        this.getNode(name).observeError(observer)
      },
      unobserveError(name, observer) {
        this.getNode(name).unobserveError(observer)
      },
      addValidator(name, validator) {
        this.getNode(name).validators.push(validator)
      },
      removeValidator(name, validator) {
        let validators = this.getNode(name).validators
        let id = validators.indexOf(validator)
        if(id == -1) throw new Error("validator not found")
        validators.splice(id)
      },
      validateField(name) {
        return this.getNode(name).validate(this.formRoot.properties, name, this.actionDefinition)
      },
      validate() {
        return this.formRoot.validate(this.formRoot.properties, name, this.actionDefinition)
      },
      clearFieldValidation(name) {
        this.getNode(name).clearValidation()
      },
      clearValidation() {
        this.formRoot.clearValidation()
      },
      addElementToArray(propName, initialValue) {
        this.getNode(propName).addElement(initialValue)
      },
      removeElementFromArray(propName, index) {
        this.getNode(propName).removeElement(index)
      },
      async submit(additionalParameters) {
        this.state = 'working'
        this.workingTask = this.workingZone.started({ name: `service ${this.service} action ${this.action}` })

        this.clearValidation()

        return this.validate().then(anyError => {
          console.log("ANY ERROR?", anyError)
          if(anyError) {
            this.workingZone.finished(this.workingTask)
            this.state = 'ready'
            return;
          }

          let parameters = this.formRoot.getValue()
          parameters = { ...parameters, ...this.parameters, ...(additionalParameters || {}) }
          console.log("SUBMIT DATA:\n"+JSON.stringify(parameters, null, "  "))

          return api.request([this.service, this.action], parameters).then((result) => {
            this.state = 'done'
            this.$emit('done', { result , parameters })
            this.workingZone.finished(this.workingTask)
          }).catch((error) => {
            if(error.properties) {
              for(let propName in error.properties) {
                let node = this.getNode(propName)
                if(!node) {
                  this.state = 'error'
                  this.error = `protocol mismatch, field ${propName} not found`
                  return;
                }
                node.setError(error.properties[propName])
              }
              this.workingZone.finished(this.workingTask)
            } else {
              this.state = 'error'
              this.error = error
              this.workingZone.failed(this.workingTask, error)
            }
            this.$emit('error', { error, parameters })
          })
        })
      },
      handleSubmitEvent(ev) {
        ev.preventDefault()
        this.submit()
      }
    },
    created() {
      if(this.actionDefinition) {
        this.initForm()
        this.state = 'ready'
      } else {
        this.loadingTask = this.loadingZone.started({ name: `action ${this.service}/${this.action} definition` })
        if(this.loadingError) {
          this.state = 'loadingError'
          if(this.loadingTask) {
            this.loadingZone.failed(this.loadingTask, this.loadingError)
            this.loadingTask = null
          }
        }
      }
    },
    watch: {
      actionDefinition(def) {
        if(def && this.state == 'loading') {
          this.initForm()
          this.state = 'ready'
          if(this.loadingTask) {
            this.loadingZone.finished(this.loadingTask)
            this.loadingTask = null
          }
        }
      },
      loadingError(error) {
        if(error && this.state == 'loading') {
          this.state = 'loadingError'
          if(this.loadingTask) {
            this.loadingZone.failed(this.loadingTask, error)
            this.loadingTask = null
          }
        }
      }
    }
  }
</script>

<style scoped>

</style>