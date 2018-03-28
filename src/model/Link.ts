import Element from "./Element"
import Node from "./Node"
import isNotNil from "../../../Draw/src/util/isNotNil"
import DrawText from "../../../Draw/src/model/text/DrawText"
import { STRAIGHT, ORTHOGONAL } from '../store/contant/linkMode';
import Line from "../../../Draw/src/model/shape/Line";
import Segment from "../../../Draw/src/model/Segment";
import Polyline from "../../../Draw/src/model/shape/Polyline";

export default class Link extends Element {
  isLink: boolean = true

  mode: string = ORTHOGONAL

  source: Node
  target: Node
  style: string

  drawText: DrawText

  drawPolyline: Polyline  

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

    this.drawPolyline = draw.addElement( "polyline", {
      segments: [
        this.source.centerSegment,
        this.target.centerSegment,
      ]
    } )
    this.sharedActions.formatLinkPolyline( this )

    this.drawText = draw.addElement( "text", {
      text: "Hello draw!",
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

  get recommendedInnerSegments(): Segment[] {
    return[]
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

  formatDrawPolyline() {
    const self = this
    
    const { drawPolyline, draw, drawActions, innerSegments } = this

    drawActions.REMOVE_ELEMENTS( innerSegments )
    this.innerSegments = this.sharedGetters.getLinkRecommendedInnerSegments( this ) 

    const potentialAdjustedDrawPolylineSegments: Segment[] = getPotentialAdjustedDrawPolylineSegments()

    drawPolyline.updateSegments( potentialAdjustedDrawPolylineSegments )

    draw.render()

    function getPotentialAdjustedDrawPolylineSegments(): Segment[] {
      const { segments } = drawPolyline
      const { length } = segments
      const first: Segment = segments[ 0 ]
      const last: Segment = segments[ length - 1 ]

      const res: Segment[] = [
        first,
        ...self.innerSegments,
        last,
      ]

      return res
    }
  }
}
