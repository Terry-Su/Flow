import Flow from '../Flow';
import FlowStore from '../store/flow/FlowStore';
import Getters from '../store/flow/Getters';
import Actions from '../store/flow/Actions';
import generateUniqueId from '../generateUniqueId';
import Draw from '../../../Draw/src/Draw'


export default class Element {
  id: string = generateUniqueId()
  flow: Flow
  draw: Draw

  constructor( props ) {
    const { flow } = props
    this.flow = flow
    this.draw = this.flow.draw
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

  render() {
  }
}
