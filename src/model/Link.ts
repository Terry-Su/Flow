import Element from "./Element"
import Node from "./Node"
import isNotNil from "../../../Draw/src/util/isNotNil";

export default class Link extends Element {
  isLink: boolean = true

  source: Node
  target: Node
  style: string

  drawInstance: any

  constructor( props ) {
    super( props )

    this.source = this.getters.findNode( props.source )
    this.target = this.getters.findNode( props.target )
    this.style = isNotNil( props.style ) ? props.style : this.style

    this.drawInstance = this.getters.draw.addElement( "line", {
      sourceSegment: this.source.centerSegment,
      targetSegment: this.target.centerSegment,
      showArrow: true
    } )

    this.drawInstance.dragger.interfaceDragging = this.handleDrawInstanceDragging.bind( this )
  }

  handleDrawInstanceDragging( event, dragger ) {
    const point: Point2DInitial = this.draw.getters.getInitialPoint( event )
    const deltaX = dragger.getDeltaXToPrevPoint( point )
    const deltaY = dragger.getDeltaYToPrevPoint( point )
    
    this.draw.sharedActions.translateSegments( this.source.drawInstance.segments, deltaX, deltaY )
    this.draw.sharedActions.translateSegments( this.target.drawInstance.segments, deltaX, deltaY )
  }
}
