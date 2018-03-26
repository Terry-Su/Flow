import FlowStore from "./store/flow/FlowStore"
import Getters from "./store/flow/Getters"
import Actions from "./store/flow/Actions"
import Draw from '../../Draw/src/Draw'


export default class Flow {
  draw: Draw
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
    this.draw = draw    
    this.actions.UPDATE_DRAW( draw )
    
  }

  render() {
    const { draw } = this.getters

    this.getters.elements.map( this.draw.sharedActions.renderElement )

    draw.render()

    function renderElement( element ) {
      element.render()
    }
  }

  addNode( props: NodeType ) {
    props.flow = this
    return this.actions.ADD_NODE( props )
  }

  addLink( props: LinkType ) {
    props.flow = this
    return this.actions.ADD_Link( props )
  }
}
