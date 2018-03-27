import Element from "./Element"
import Segment from "../../../Draw/src/model/Segment"
import isNotNil from "../../../Draw/src/util/isNotNil"
import Link from "./Link"
import DrawText from "../../../Draw/src/model/text/DrawText"

export default class Node extends Element {
  isNode: boolean = true
  label: string = "Unknown"

  centerSegment: any

  segmentsToLink: Segment[]

  links: Link[] = []

  drawText: DrawText

  constructor( props ) {
    super( props )

    this.id = isNotNil( props.id ) ? props.id : this.id
    this.label = isNotNil( props.label ) ? props.label : this.label

    const width = 100
    const height = 80

    const { draw } = this.getters

    this.drawInstance = draw.addElement( "rect", {
      left     : props.x - width / 2,
      top      : props.y - height / 2,
      width    : width,
      height   : height,
      rotatable: false,
      sizable  : false
    } )

    this.centerSegment = draw.addElement( "segment", {
      x   : props.x,
      y   : props.y,
      path: this.drawInstance
    } )

    this.drawText = draw.addElement( "text", {
      text: this.label,
    } )
    this.sharedActions.translateNodeDrawTextToCenter( this )
    

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

    const { centerSegment, segmentsToLink } = this

    this.draw.sharedActions.translateSegments(
      [ centerSegment, ...segmentsToLink ],
      deltaX,
      deltaY
    )

    this.sharedActions.translateNodeDrawTextToCenter( this )
    this.sharedActions.translateLinksDrawTextsToCenter( this.links )
  }

  handleCenterSegmentDragging( event, dragger ) {
    const point: Point2DInitial = this.draw.getters.getInitialPoint( event )
    const deltaX = dragger.getDeltaXToPrevPoint( point )
    const deltaY = dragger.getDeltaYToPrevPoint( point )

    const { segmentsToLink } = this

    this.draw.sharedActions.translateSegments(
      [ ...this.drawInstance.segments, segmentsToLink ],
      deltaX,
      deltaY
    )

    this.sharedActions.translateNodeDrawTextToCenter( this )
    this.sharedActions.translateLinksDrawTextsToCenter( this.links )
  }
}
