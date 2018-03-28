import Link from "../model/Link"
import Segment from "../../../Draw/src/model/Segment"
export default class SharedGetters {
  /**
   * // Link
   */
  getLinkRecommendedInnerPoints( link: Link ): Point2D[] {
    const { source, target } = link

    const { x: sx, y: sy } = source.centerSegment
    const { x: tx, y: ty } = target.centerSegment

    const point: Point2D = {
      x: tx,
      y: sy
    }

    return [ point ]
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
