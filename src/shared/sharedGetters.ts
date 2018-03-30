import Link from '../model/Link';
import Segment from "../../../Draw/src/model/Segment"
import { STRAIGHT, ORTHOGONAL } from "../store/contant/linkMode"
import Node from '../model/Node';
export default class SharedGetters {
  /**
   * // Link
   */

  

  getLinkRecommendedInnerPoints( link: Link ): Point2D[] {
    let res: Point2D[] = []
    const { mode, startSegment, endSegment } = link

    if ( mode === STRAIGHT ) {
    }

    if ( mode === ORTHOGONAL ) {
      const { x: sx, y: sy } = startSegment
      const { x: ex, y: ey } = endSegment

      const isNotVertical: boolean = sx !== ex
      const isNotHorizontal: boolean = sy !== ey

      const point: Point2D = {
        x: ex,
        y: sy
      }

      if ( isNotVertical && isNotHorizontal ) {
        res.push( point )
      }
    }

    return res
  }

  getLinkRecommendedInnerSegments( link: Link ): Segment[] {
    const { draw, drawPolyline } = link
    const points: Point2D[] = this.getLinkRecommendedInnerPoints( link )
    const res: Segment[] = points.map( createSegment )
    return res

    function createSegment( point: Point2D ) {
      const { x, y }: Point2D = point
      const segment: Segment = draw.addElement( "segment", {
        x,
        y,
        path: drawPolyline
      } )
      return segment
    }
  }
}
