<template>
  <div>
    <form v-if="state == 'ready' || state =='working'" v-on:submit="handleSubmitEvent">
      <slot v-bind="slotProps"></slot>
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
        }
      }
    },
    inject: ['loadingZone', 'workingZone'],
    data() {
      return {
        state: 'loading',
        error: null,
        loadingTask: null,
        formValues: {},
        formErrors: {},
        slotProps: {},
        fieldDefinitions: {}
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
      computeSlotProps() {
        let props = {}
        for(let propName in this.formValues) {
          props[propName] = this.formValues[propName]
          props['set'+propName.slice(0,1).toUpperCase() + propName.slice(1)] =
              ((propName) => (value) => this.setFieldValue(propName,value))(propName)
        }
        for(let propName in this.formErrors) {
          props[propName+'Error'] = this.formErrors[propName]
          props['set'+propName.slice(0,1).toUpperCase() + propName.slice(1)+'Error'] =
              ((propName) => (error) => this.setFieldError(propName,error))(propName)
        }
        props['values'] = this.formValues
        props['errors'] = this.formErrors
        this.slotProps = props
      },
      getFieldDefinition(name) {
        return this.fieldDefinitions[name]
      },
      getFieldValue(name) {
        return this.formValues[name]
      },
      setFieldValue(name, value) {
        this.formValues[name] = value
        for(let observer of this.valueObservers[name]) observer(value)
        this.computeSlotProps()
      },
      getFieldError(propName) {
        return this.formErrors[propName]
      },
      setFieldError(propName, error) {
        this.formErrors[propName] = error
        for(let observer of this.errorObservers[propName]) observer(error)
        this.computeSlotProps()
      },
      getAction() {
        return this.actionDefinition
      },
      spreadDefinition(props, at) {
        for(let propName in props) {
          let defn = JSON.parse(JSON.stringify(props[propName]))
          if(at.length > 0) defn.spreadPath = [...at, propName]
          this.fieldDefinitions[[...at, propName].join('.')] = defn
          if(defn.type=="Object" && defn.properties) {
            this.spreadDefinition(defn.properties, [...at, propName])
          }
        }
      },
      initForm() {
        this.spreadDefinition(this.actionDefinition.properties, [])
        this.errorObservers = {}
        this.valueObservers = {}
        this.validators = {}
        for(let propName in this.fieldDefinitions) {
          let propDefn = this.fieldDefinitions[propName]
          this.errorObservers[propName] = []
          this.valueObservers[propName] = []

          let fieldValidators = []
          console.log("PROP DEFN", propName, propDefn)
          if(propDefn.validation) {
            let validations = Array.isArray(propDefn.validation) ? propDefn.validation : [propDefn.validation]
            let context = { service: this.serviceDefinition, action: this.actionDefinition, property: propDefn }
            fieldValidators = validations.map(validation => typeof validation == 'string'
                ? validators[validation]({}, context)
                : validators[validation.name](validation, context)
            )
          }
          this.validators[propName] = fieldValidators
        }

        this.reset()
        this.computeSlotProps()
      },
      reset() {
        for(let propName in this.fieldDefinitions) {
          let prop = this.fieldDefinitions[propName]
          let defaultValue = prop.defaulValue || null
          if(!defaultValue) {
            switch(prop.type) {
              case "String" : defaultValue = ""; break;
              case "Object" : defaultValue = {}; break;
              case "Number" : defaultValue = 0; break;
              case "Array"  : defaultValue = []; break;
            }
          }
          let initialValue
          if(this.initialValues) {
            let path = propName.split('.')
            initialValue = this.initialValues
            for(let pp of path) initialValue = initialValue && initialValue[pp]
            if(initialValue) defaultValue = initialValue
          }
          this.formValues[propName] = initialValue || defaultValue
          this.setFieldError(propName, null)
        }
      },
      observe(propName, observer) {
        let observers = this.valueObservers[propName]
        if(!observers) throw new Error("Unknown property "+propName)
        observers.push(observer)
        observer(this.formValues[propName])
      },
      unobserve(propName, observer) {
        let observers = this.valueObservers[propName]
        if(!observers) throw new Error("Unknown property "+propName)
        let id = observers.indexOf(observer)
        if(id == -1) throw new Error("Observer not found")
        observers.splice(id)
      },
      observeError(propName, observer) {
        let observers = this.errorObservers[propName]
        if(!observers) throw new Error("Unknown property "+propName)
        observers.push(observer)
        observer(this.formErrors[propName])
      },
      unobserveError(propName, observer) {
        let observers = this.errorObservers[propName]
        if(!observers) throw new Error("Unknown property "+propName)
        let id = observers.indexOf(observer)
        if(id == -1) throw new Error("Observer not found")
        observers.splice(id)
      },
      addValidator(propName, validator) {
        let validators = this.validators[propName]
        if(!validators) throw new Error("Unknown property "+propName)
        validators.push(validator)
      },
      removeValidator(propName, validator) {
        let validators = this.validators[propName]
        if(!validators) throw new Error("Unknown property "+propName)
        let id = validators.indexOf(validator)
        if(id == -1) throw new Error("validator not found")
        validators.splice(id)
      },
      validateField(propName) {
        if(this.formErrors[propName]) return this.formErrors[propName]
        let validators = this.validators[propName]
        for(let validator of validators) {
          let error = validator(this.formValues[propName], this.formValues, propName, this.actionDefinition)
          console.log("FIELD VALIDATOR", propName, validator, 'ERROR', error || this.formErrors[propName])
          if(this.formErrors[propName]) return this.formErrors[propName];
          if(error) this.setFieldError(propName, error)
          if(this.formErrors[propName]) return this.formErrors[propName]
        }
      },
      async validate() {
        let anyError = false
        let promises = []
        for(let propName in this.validators) {
          promises.push(this.validateField(propName))
        }
        let results = await Promise.all(promises)
        for(let result of results) {
          anyError = !!result || anyError
        }
        return anyError
      },
      clearFieldValidation(propName) {
        this.formErrors[propName] = null
      },
      clearValidation() {
        for(let propName in this.formErrors) {
          this.clearFieldValidation(propName)
        }
      },
      async submit(additionalParameters) {
        this.state = 'working'
        this.workingTask = this.workingZone.started({ name: `service ${this.service} action ${this.action}` })

        this.clearValidation()

        let anyError = await this.validate()
        console.log("ANY ERROR?", anyError)
        if(anyError) {
          this.workingZone.finished(this.workingTask)
          this.state = 'ready'
          return;
        }

        let parameters = {}
        for(let propName in this.fieldDefinitions) {
          let prop = this.fieldDefinitions[propName]
          if(prop.spreadPath) continue;
          parameters[propName] = this.formValues[propName]
        }
        for(let i = 1; ; i++ ) {
          let foundCount = 0
          for (let propName in this.fieldDefinitions) {
            let prop = this.fieldDefinitions[propName]
            if (!prop.spreadPath) continue;
            let value = this.formValues[propName]
            setByPath(parameters, prop.spreadPath, value)
          }
          if(foundCount == 0) break;
        }
        parameters = { ...parameters, ...this.parameters, ...(additionalParameters || {}) }
        console.log("SUBMIT DATA:\n"+JSON.stringify(parameters, null, "  "))


        return await api.request([this.service, this.action], parameters).then((result) => {
          this.state = 'done'
          this.$emit('done', { result , parameters })
          this.workingZone.finished(this.workingTask)
        }).catch((error) => {
          if(error.properties) {
            for(let propName in error.properties) {
              if(!this.formErrors.hasOwnProperty(propName)) {
                this.state = 'error'
                this.error = `protocol mismatch, field ${propName} not found`
                return;
              }
              this.setFieldError(propName, error.properties[propName])
            }
            this.workingZone.finished(this.workingTask)
          } else {
            this.state = 'error'
            this.error = error
            this.workingZone.failed(this.workingTask, error)
          }
          this.$emit('error', { error, parameters })
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