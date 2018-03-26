import Element from "./Element"
import Segment from "../../../Draw/src/model/Segment"
import isNotNil from "../../../Draw/src/util/isNotNil";

export default class Node extends Element {
  isNode: boolean = true
  label: string = "Unknown"

  drawInstance: any

  centerSegment: any

  segmentsToLink: Segment[]

  constructor( props ) {
    super( props )

    this.id = isNotNil( props.id ) ? props.id : this.id
    this.label = isNotNil( props.label ) ? props.label : this.label

    const width = 100
    const height = 80
    this.drawInstance = this.getters.draw.addElement( "rect", {
      left     : props.x - width / 2,
      top      : props.y - height / 2,
      width    : width,
      height   : height,
      rotatable: false,
      sizable  : false
    } )

    this.centerSegment = this.getters.draw.addElement( "segment", {
      x   : props.x,
      y   : props.y,
      path: this.drawInstance
    } )

    this.centerSegment.dragger.interfaceDragging = this.handleCenterSegmentDragging.bind(
      this
    )

    this.drawInstance.dragger.interfaceDragging = this.handleDrawInstanceDragging.bind(
      this
    )
  }

  get x(): number {
    return this.centerSegment.x
  }

  get y(): number {
    return this.centerSegment.y
  }

  handleDrawInstanceDragging( event, dragger ) {
    const point: Point2DInitial = this.draw.getters.getInitialPoint( event )
    const deltaX = dragger.getDeltaXToPrevPoint( point )
    const deltaY = dragger.getDeltaYToPrevPoint( point )

    this.draw.sharedActions.translateSegment( this.centerSegment, deltaX, deltaY )
    this.draw.sharedActions.translateSegments(
      this.segmentsToLink,
      deltaX,
      deltaY
    )
  }

  handleCenterSegmentDragging( event, dragger ) {
    const point: Point2DInitial = this.draw.getters.getInitialPoint( event )
    const deltaX = dragger.getDeltaXToPrevPoint( point )
    const deltaY = dragger.getDeltaYToPrevPoint( point )

    this.draw.sharedActions.translateSegments(
      this.drawInstance.segments,
      deltaX,
      deltaY
    )
    this.draw.sharedActions.translateSegments(
      this.segmentsToLink,
      deltaX,
      deltaY
    )
  }
}
