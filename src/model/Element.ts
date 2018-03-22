import Flow from '../Flow';
import FlowStore from '../store/flow/FlowStore';
import Getters from '../store/flow/Getters';
import Actions from '../store/flow/Actions';
import generateUniqueId from '../generateUniqueId';
export default class Element {
  id: string = generateUniqueId()
  flow: Flow

  constructor( props ) {
    const { flow } = props
    this.flow = flow
  }

  get flowStore(): FlowStore {
    return this.flow.flowStore
  }

  get getters(): Getters {
    return this.flow.getters
  }

  get actions(): Actions {
    return this.flow.actions
  }
}
