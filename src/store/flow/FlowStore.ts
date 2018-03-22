import Element from '../../model/Element';
import Node from '../../model/Node';
import Link from '../../model/Link';
export default class FlowStore {
  draw: DrawType

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
