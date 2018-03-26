import Element from "../../model/Element"
import Node from "../../model/Node"
import Link from "../../model/Link"
import Draw from "../../../../Draw/src/Draw"

export default class FlowStore {
  draw: Draw

  /**
   * Used to export and import data
   */
  data: any = {
    nodes: [],
    links: []
  }

  nodes: Node[] = []

  links: Link[] = []
}
