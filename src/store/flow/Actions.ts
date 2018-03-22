import FlowStore from "./FlowStore"
import Getters from "./Getters"
import generateUniqueId from "../../generateUniqueId"
import isNotNil from "../../util/isNotNil"
import Node from "../../model/Node"
import Element from "../../model/Element"
import Link from "../../model/Link"

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

  /**
   * // Node
   */
  ADD_NODE( props: Node ) {
    let { flow, id, label, x, y } = props

    const node: Node = new Node( { flow, id, label, x, y } )

    this.getters.nodes.push( node )
  }

  /**
   * // Link
   */
  ADD_Link( props: LinkType ) {
    let { flow, source, target, style } = props

    const link: Link = new Link( { flow, source, target, style } )

    this.getters.links.push( link )
  }
}
