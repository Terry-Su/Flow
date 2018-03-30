import Element from "./Element"
import Node from "./Node"
import isNotNil from "../../../Draw/src/util/isNotNil"
import DrawText from "../../../Draw/src/model/text/DrawText"
import { STRAIGHT, ORTHOGONAL } from "../store/contant/linkMode"
import Line from "../../../Draw/src/model/shape/Line"
import Segment from "../../../Draw/src/model/Segment"
import Polyline from "../../../Draw/src/model/shape/Polyline"
import intersect from "../../../Draw/src/util/geometry/intersect"
import intersectPToRectCenterAndRectBorder from "../../../Draw/src/util/geometry/intersectPToRectCenterAndRectBorder"
import isTwoRectIntersected from "../../../Draw/src/util/geometry/isTwoRectIntersected"
import isPointInRect from "../../../Draw/src/util/geometry/isPointInRect"

export default class Link extends Element {
  isLink: boolean = true

  mode: string = STRAIGHT

  source: Node
  target: Node
  style: string

  drawText: DrawText

  drawPolyline: Polyline

  startSegment: Segment
  endSegment: Segment

  /**
   * Inner segments(not including source and target) of link
   * All inner segments may be removed!
   */
  innerSegments: Segment[] = []

  constructor( props ) {
    super( props )

    const { draw } = this.getters

    this.source = this.getters.findNode( props.source )
    this.target = this.getters.findNode( props.target )
    this.mode = isNotNil( props.mode ) ? props.mode : this.mode
    this.style = isNotNil( props.style ) ? props.style : this.style

    this.sharedActions.addLinkToNode( this.source, this )
    this.sharedActions.addLinkToNode( this.target, this )

    this.recreateRecommendedStartSegment()
    this.recreateRecommendedEndSegment()

    this.drawPolyline = draw.addElement( "polyline", {
      segments: [ this.startSegment, this.endSegment ]
    } )

    this.drawText = draw.addElement( "text", {
      text: "Text on link",
      show: false
    } )
    this.sharedActions.translateLinkDrawTextToCenter( this )

    this.drawPolyline.dragger.interfaceDragging = this.handleDrawInstanceDragging.bind(
      this
    )
  }

  get center(): Point2D {
    const { source, target } = this
    const { x: sx, y: sy } = source
    const { x: tx, y: ty } = target
    const res: Point2D = {
      x: ( sx + tx ) / 2,
      y: ( sy + ty ) / 2
    }
    return res
  }

  get segments(): Segment[] {
    const res: Segment[] = [
      this.startSegment,
      ...this.innerSegments,
      this.endSegment
    ]
    return res
  }

  recreateRecommendedStartSegment() {
    const { source, target, draw } = this

    // Remove old start segment
    this.startSegment && this.draw.actions.REMOVE_ELEMENT( this.startSegment )

    let x: number = source.centerSegment.x
    let y: number = source.centerSegment.y

    if (
      !isPointInRect(
        source.centerSegment.point,
        target.centerSegment.point,
        target.drawBounds.left,
        target.drawBounds.top
      )
      &&
      !isPointInRect(
        target.centerSegment.point,
        source.centerSegment.point,
        source.drawBounds.left,
        source.drawBounds.top
      )
    ) {
      const center = source.centerSegment.point
      const { left, top } = source.drawBounds
      const P = target.centerSegment.point

      const intersected: Point2D = intersectPToRectCenterAndRectBorder(
        center,
        left,
        top,
        P
      )

      x = intersected.x
      y = intersected.y
    }

    const segment: Segment = draw.addElement( "segment", {
      x,
      y
    } )

    this.startSegment = segment
  }

  recreateRecommendedEndSegment() {
    const { source, target, draw } = this

    // Remove old start segment
    this.endSegment && this.draw.actions.REMOVE_ELEMENT( this.endSegment )

    let x: number = target.centerSegment.x
    let y: number = target.centerSegment.y

    if (
      !isTwoRectIntersected(
        source.centerSegment.point,
        source.drawBounds.left,
        source.drawBounds.top,
        target.centerSegment.point,
        target.drawBounds.left,
        target.drawBounds.top
      )
    ) {
      const center = target.centerSegment.point
      const { left, top } = target.drawBounds
      const P = source.centerSegment.point

      const intersected: Point2D = intersectPToRectCenterAndRectBorder(
        center,
        left,
        top,
        P
      )

      x = intersected.x
      y = intersected.y
    }

    const segment: Segment = draw.addElement( "segment", {
      x,
      y
    } )

    this.endSegment = segment
  }

  handleDrawInstanceDragging( event, dragger ) {
    const point: Point2DInitial = this.draw.getters.getInitialPoint( event )
    const deltaX = dragger.getDeltaXToPrevPoint( point )
    const deltaY = dragger.getDeltaYToPrevPoint( point )

    const { source, target } = this

    this.drawSharedActions.translateSegments(
      [ ...source.drawInstance.segments, ...target.drawInstance.segments ],
      deltaX,
      deltaY
    )

    this.update()
  }

  update() {
    const { source, target, drawPolyline } = this

    this.sharedActions.translateLinkDrawTextToCenter( this )
    this.sharedActions.translateNodesDrawTextsToCenter( [ source, target ] )

    this.recreateRecommendedStartSegment()
    this.recreateRecommendedEndSegment()
    drawPolyline.updateSegments( this.segments )
  }
}
