import FlowStore from "./FlowStore"
import Element from "../../model/Element"
import { isNil } from "lodash"
import Node from '../../model/Node';
import Link from "../../model/Link"
import isNotNil from "../../util/isNotNil"

export default class Getters {
  flowStore: FlowStore

  constructor( flowStore: FlowStore ) {
    this.flowStore = flowStore
  }

  get draw(): DrawType {
    return this.flowStore.draw
  }

  get nodes(): Node[] {
    return this.flowStore.nodes
  }

  get links(): Link[] {
    return this.flowStore.links
  }

  findNode( id: string ) {
    let res: Node = this.nodes.filter( node => node.id === id )[ 0 ]
    res = isNotNil( res ) ? res : null
    return res
  }
}
