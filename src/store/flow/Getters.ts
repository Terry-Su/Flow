import FlowStore from "./FlowStore"
import Element from '../../model/Element';
import { isNil } from "lodash"
import Node from "../../model/Node"
import Link from "../../model/Link"
import RectNode from "../../model/nodes/RectNode"
import Draw from '../../../../Draw/src/Draw'
import Segment from '../../../../Draw/src/model/Segment'
import isNotNil from "../../../../Draw/src/util/isNotNil";
import SegmentToLink from "../../model/draw/SegmentToLink";

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
    return [
      ... this.nodes,
      ... this.links
    ]
  }


  findNode( id: string ) {
    let res: Node = this.nodes.filter( node => node.id === id )[ 0 ]
    res = isNotNil( res ) ? res : null
    return res
  }

  /**
   * // Node
   */
  /**
   * Get segments to link
   */
  getRectNodeSegmentsToLink( rectNode: RectNode ): Segment[] {
    const { drawInstance, draw } = rectNode
    const { left, right, top, bottom } = drawInstance.bounds

    const point1: Point2D = {
      x: ( left + right ) / 2,
      y: top
    }
    const point2: Point2D = {
      x: right,
      y: ( top + bottom ) / 2
    }
    const point3: Point2D = {
      x: ( left + right ) / 2,
      y: bottom
    }
    const point4: Point2D = {
      x: left,
      y: ( top + bottom ) / 2
    }

    const segment1 = new SegmentToLink( {
      draw: draw,
      x   : point1.x,
      y   : point1.y,
      path: drawInstance,
    } )
    const segment2 = new SegmentToLink( {
      draw: draw,
      x   : point2.x,
      y   : point2.y,
      path: drawInstance,
    } )
    const segment3 = new SegmentToLink( {
      draw: draw,
      x   : point3.x,
      y   : point3.y,
      path: drawInstance,
    } )
    const segment4 = new SegmentToLink( {
      draw: draw,
      x   : point4.x,
      y   : point4.y,
      path: drawInstance,
    } )

    const res: Segment[] = [ segment1, segment2, segment3, segment4 ]
    return res
  }
}
