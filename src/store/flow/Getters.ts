import FlowStore from "./FlowStore";

export default class Getters {
  flowStore: FlowStore

  constructor( flowStore: FlowStore ) {
    this.flowStore = flowStore
  }

  get draw(): DrawType {
    return this.flowStore.draw
  }
}