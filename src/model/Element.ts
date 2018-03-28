import Flow from '../Flow';
import FlowStore from '../store/flow/FlowStore';
import Getters from '../store/flow/Getters';
import Actions from '../store/flow/Actions';
import generateUniqueId from '../generateUniqueId';
import Draw from '../../../Draw/src/Draw'
import Cell from '../../../Draw/src/model/Cell';
import SharedActions from '../shared/sharedActions';
import SharedGetters from '../shared/sharedGetters';


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

  get sharedGetters(): SharedGetters {
    return this.flow.sharedGetters
  }

  get sharedActions(): SharedActions {
    return this.flow.sharedActions
  }

  get drawActions() {
    return this.draw.actions
  }

  get drawGetters() {
    return this.draw.getters
  }

  get drawSharedActions() {
    return this.draw.sharedActions
  }

  get drawSharedGetters() {
    return this.draw.sharedGetters
  }

  render() {
  }
}
