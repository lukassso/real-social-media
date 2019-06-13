import Vue from 'vue'

let createElement

var getElementPosition = function(element) {
  var o = element
  var x = 0
  var y = 0
  while (true) {
    x += o.offsetLeft
    y += o.offsetTop
    o = o.offsetParent
    if(!o) return {
      x: x,
      y: y
    }
    if(o.scrollLeft) x -= o.scrollLeft
    if(o.scrollTop) y -= o.scrollTop
  }
}

function createOverlayModel() {
  return new Vue({
    data: {
      overlayStack: [],
      overlayCloseListeners: [],
      createElement: null
    },
    methods: {
      show({component, props, on, slots, parentId}) {
        parentId = parentId || 0
        props = props || {}
        on = on || {}
        slots = slots || []
        this.overlayStack.splice(parentId, Infinity) // remove all above parent
        let stackId = this.overlayStack.length + 1
        props = {
          props: {
            ...props,
            stackId,
            parentId
          },
          attrs: {
            'data-overlay-stack' : stackId
          },
          on: {
            ...on,
            close: () => this.close(stackId),
            closeAll: () => this.closeAll(),
            overlay: (definition) => this.show({ ...definition, parentId: stackId })
          },
          slots
        }
        if(on.close) this.overlayCloseListeners[stackId] = on.close
        this.overlayStack.push(this.createElement(component, props, slots))
        return stackId
      },
      close(stackId) {
        if(this.overlayCloseListeners[stackId]) this.overlayCloseListeners[stackId]()
        delete this.overlayCloseListeners[stackId]
        this.overlayStack.splice(stackId - 1, Infinity)
      },
      closeAll() {
        for(var k in this.overlayCloseListeners) {
          this.overlayCloseListeners[k]()
        }
        this.overlayCloseListeners = []
        this.overlayStack.splice(0, Infinity)
      },
      elementAnchor(element) {
        let position = getElementPosition(element)
        return { ...position, w: element.clientWidth, h: element.clientHeight }
      }
    }
  })
}

let OverlayComponent = {
  name: 'OverlayLayer',
  props: {
    overlayModel : {
      required: true,
      type: Object
    }
  },
  mounted() {
    this.focusLostListener = (ev) => {
      let stackId
      let tg = ev.target
      while(tg) {
        stackId = +tg.getAttribute('data-overlay-stack')
        if (stackId) break;
        tg = tg.parentElement
      }
      if(stackId) {
        this.overlayModel.close(stackId+1)
      } else {
        this.overlayModel.closeAll()
      }
    }
    document.body.addEventListener("touch", this.focusLostListener, true)
    document.body.addEventListener("click", this.focusLostListener, true)
  },
  beforeDestroy() {
    document.body.removeEventListener("touch", this.focusLostListener)
    document.body.removeEventListener("click", this.focusLostListener)
  },
  render(createElement) {
    this.overlayModel.createElement = createElement
    return createElement("div", { class:"overlayLayer" }, this.overlayModel.overlayStack)
  }
}

let allDirections = [
  { x: 1, y: 1 },
  { x: 1, y: 0 },
  { x: 1, y: -1 },
  { x: 0, y: 1 },
  { x: 0, y: -1 },
  { x: -1, y: 1 },
  { x: -1, y: 0 },
  { x: -1, y: -1 }
]

let windowDimmensions = new Vue({
  data: {
    width: (typeof window != 'undefined') && window.innerWidth,
    height: (typeof window != 'undefined') && window.innerHeight
  }
})
if(typeof window != 'undefined') {
  window.addEventListener('resize', () => {
    windowDimmensions.width = window.innerWidth
    windowDimmensions.height = window.innerHeight
  })
}

function computeDimmensions(anchor, size, direction) {
  let aw = anchor.w || 0
  let ah = anchor.h || 0
  let ax = anchor.x || 0
  let ay = anchor.y || 0

  let dx = direction.x || 0
  let dy = direction.y || 0
  let dax = direction.ax || 0
  let day = direction.ay || 0

  let acx = ax + aw / 2
  let acy = ay + ah / 2
  let hx = acx + aw / 2 * dax
  let hy = acy + ah / 2 * day

  let mw = size.x || 0
  let mh = size.y || 0
  let mcx = - mw / 2
  let mcy = - mh / 2

  let xp = hx + mcx + mw / 2 * dx
  let yp = hy + mcy + mh / 2 * dy

  return {
    x: xp,
    y: yp,
    x2: xp + mw,
    y2: yp + mh
  }
}

let OverlayAnchor = {
  name: 'OverlayAnchor',
  props: {
    anchor: {
      required: true,
      type: Object
    },
    directions: {
      default: () => allDirections,
      type: Array
    }
  },
  data() {
    return {
      width: 0,
      height: 0
    }
  },
  computed: {
    possibleDirections() {
      let size = { x: this.width, y: this.height }
      return this.directions.map(direction => ({
        direction,
        position: computeDimmensions(this.anchor, size, direction)
      })).filter(dir => {
        if(dir.position.x < 0) return false
        if(dir.position.x2 > windowDimmensions.width) return false
        if(dir.position.y < 0) return false
        if(dir.position.y2 > windowDimmensions.height) return false
        return true
      })
    },
    style() {
      let directions = this.possibleDirections
      if(directions.length == 0) return { display: "none" }
      this.$emit("positioned", directions[0].position)
      return {
        left: directions[0].position.x + 'px',
        top: directions[0].position.y + 'px'
      }
    }
  },
  methods: {
    updateSize() {
      if(this.finished) return;
      let element = this.$refs.anchor
      if(!element) return
      let width = element.clientWidth
      let height = element.clientHeight
      if(width != this.width) this.width = width
      if(height != this.height) this.height = height
      setTimeout(()=>this.updateSize(), 100)
    }
  },
  mounted() {
    this.updateSize()
  },
  beforeDestroy() {
    this.finished = true
  },
  render(createElement) {
    return createElement("div", {
      'class': 'overlayAnchor',
      style: this.style,
      ref: 'anchor'
    }, this.$slots.default)
  }
}

let OverlayActivator = {
  name: "OverlayActivator",
  props: ["model", "directions"],
  render(createElement) {
    return createElement("div", {
      ref: "button",
      on: {
        click: () => {
          console.error("OVERLAY SLOT", this.$slots.overlay)
          this.model.show({
            component: OverlayAnchor,
            props: {
              anchor: this.model.elementAnchor(this.$refs.button),
              directions: this.directions
            },
            on: {
              positioned: (position) => this.$emit('positioned', position)
            },
            slots: this.$slots.overlay
          })
        }
      }
    }, this.$slots.button)
  }
}

export { OverlayComponent, createOverlayModel, OverlayAnchor, windowDimmensions, OverlayActivator }



