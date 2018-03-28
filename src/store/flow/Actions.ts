import FlowStore from "./FlowStore"
import Getters from "./Getters"
import generateUniqueId from "../../generateUniqueId"
import Node from "../../model/Node"
import Element from "../../model/Element"
import Link from "../../model/Link"
import { RECT_NODE } from "../contant/nodeType"
import RectNode from "../../model/nodes/RectNode"
import Draw from "../../../../Draw/src/Draw"
import Flow from "../../Flow"

export default class Actions {
  flowStore: FlowStore

  getters: Getters

  constructor( flowStore: FlowStore, getters: Getters ) {
    this.flowStore = flowStore
    this.getters = getters
  }

  /**
   * // System
   */
  UPDATE_DRAW( draw: Draw ) {
    this.flowStore.draw = draw
  }

  FORMAT() {
    const { links } = this.getters

    links.map( link => link.formatDrawPolyline() )
  }

  /**
   * // Node
   */
  ADD_NODE( props: NodeType ) {
    let { flow, id, label, x, y, type = RECT_NODE } = props

    let node: Node

    switch ( type ) {
      case RECT_NODE:
        node = new RectNode( { flow, id, label, x, y } )
        break
    }

    this.getters.nodes.push( node )
  }

  /**
   * // Link
   */
  ADD_LINK( props: LinkType ) {
    let { flow, source, target, style } = props

    const link: Link = new Link( { flow, source, target, style } )

    this.getters.links.push( link )
  }

  ADD_LINKS( props: LinkType[], flow: Flow ) {
    const self = this
    props.map( resolve )

    function resolve( linkProp ) {
      linkProp.flow = flow
      self.ADD_LINK( linkProp )
    }
  }
}
