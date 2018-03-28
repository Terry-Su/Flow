import FlowStore from "./store/flow/FlowStore"
import Getters from "./store/flow/Getters"
import Actions from "./store/flow/Actions"
import Draw from "../../Draw/src/Draw"
import SharedActions from "./shared/sharedActions"
import SharedGetters from "./shared/sharedGetters"

export default class Flow {
  draw: Draw
  flowStore: FlowStore
  getters: Getters
  actions: Actions

  sharedActions: SharedActions
  sharedGetters: SharedGetters

  constructor( canvas: CanvasRenderingContext2D ) {
    this.flowStore = new FlowStore()

    this.getters = new Getters( this.flowStore )

    this.sharedGetters = new SharedGetters()
    this.sharedActions = new SharedActions( this.flowStore, this.getters, this.sharedGetters )

    this.actions = new Actions( this.flowStore, this.getters )

    const Draw = window[ "Draw" ]
    this.draw = new Draw( canvas )
    this.actions.UPDATE_DRAW( this.draw )
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

  
  format() {
    this.actions.FORMAT()
  }
}
