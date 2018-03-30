import FlowStore from "./FlowStore"
import Element from "../../model/Element"
import { isNil } from "lodash"
import Node from "../../model/Node"
import Link from "../../model/Link"
import RectNode from "../../model/nodes/RectNode"
import Draw from "../../../../Draw/src/Draw"
import Segment from "../../../../Draw/src/model/Segment"
import isNotNil from "../../../../Draw/src/util/isNotNil"

export default class Getters {
  flowStore: FlowStore

  constructor( flowStore: FlowStore ) {
    this.flowStore = flowStore
  }

  get draw(): Draw {
    return this.flowStore.draw
  }

  get nodes(): Node[] {
    return this.flowStore.nodes
  }

  get links(): Link[] {
    return this.flowStore.links
  }

  get elements(): Element[] {
    return [ ...this.nodes, ...this.links ]
  }

  findNode( id: string ) {
    let res: Node = this.nodes.filter( node => node.id === id )[ 0 ]
    res = isNotNil( res ) ? res : null
    return res
  }
}
