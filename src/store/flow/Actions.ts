import FlowStore from "./FlowStore"
import Getters from "./Getters"

export default class Actions {
  flowStore: FlowStore

  getters: Getters

  constructor( flowStore: FlowStore, getters: Getters ) {
    this.flowStore = flowStore
    this.getters = getters
  }

  UPDATE_DRAW( draw: DrawType ) {
    this.flowStore.draw = draw
  }
}
