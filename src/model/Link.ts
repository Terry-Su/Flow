import Element from "./Element"
import Node from "./Node"
import isNotNil from "../../../Draw/src/util/isNotNil"
import DrawText from "../../../Draw/src/model/text/DrawText"

export default class Link extends Element {
  isLink: boolean = true

  source: Node
  target: Node
  style: string

  drawText: DrawText

  constructor( props ) {
    super( props )

    const { draw } = this.getters

    this.source = this.getters.findNode( props.source )
    this.target = this.getters.findNode( props.target )
    this.style = isNotNil( props.style ) ? props.style : this.style

    this.sharedActions.addLinkToNode( this.source, this )
    this.sharedActions.addLinkToNode( this.target, this )

    this.drawInstance = draw.addElement( "line", {
      sourceSegment: this.source.centerSegment,
      targetSegment: this.target.centerSegment,
      showArrow    : true
    } )

    this.drawText = draw.addElement( "text", {
      text: "Hello draw!",
    } )
    this.sharedActions.translateLinkDrawTextToCenter( this )
    

    this.drawInstance.dragger.interfaceDragging = this.handleDrawInstanceDragging.bind(
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

  handleDrawInstanceDragging( event, dragger ) {
    const point: Point2DInitial = this.draw.getters.getInitialPoint( event )
    const deltaX = dragger.getDeltaXToPrevPoint( point )
    const deltaY = dragger.getDeltaYToPrevPoint( point )

    const { source, target } = this

    this.drawSharedActions.translateSegments(
      [
        ...this.source.drawInstance.segments,
        ...this.target.drawInstance.segments,

        ...this.source.segmentsToLink,
        ...this.target.segmentsToLink
      ],
      deltaX,
      deltaY
    )

    this.sharedActions.translateLinkDrawTextToCenter( this )
    this.sharedActions.translateNodesDrawTextsToCenter( [ source, target ] )
  }
}
