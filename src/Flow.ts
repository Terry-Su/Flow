import FlowStore from "./store/flow/FlowStore"
import Getters from "./store/flow/Getters"
import Actions from "./store/flow/Actions"

import  "../../Draw/build/draw"

export default class Flow {
  flowStore: FlowStore
  getters: Getters
  actions: Actions

  constructor( canvas: CanvasRenderingContext2D ) {
    const flowStore: FlowStore = new FlowStore()
    this.flowStore = flowStore

    const getters = new Getters( flowStore )
    this.getters = getters

    const actions = new Actions( flowStore, getters )
    this.actions = actions

    const Draw = window[ 'Draw' ]
    const draw = new Draw( canvas )
    this.actions.UPDATE_DRAW( draw )
  }

  render() {
    const { draw } = this.getters

    draw.render()
  }
}
