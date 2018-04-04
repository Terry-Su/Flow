import Element from "./Element"
import Node from "./Node"
import isNotNil from "../../../Draw/src/util/isNotNil"
import DrawText from "../../../Draw/src/model/text/DrawText"
import { STRAIGHT, ORTHOGONAL } from "../store/constant/linkMode"
import Line from "../../../Draw/src/model/shape/Line"
import Segment from "../../../Draw/src/model/Segment"
import Polyline from "../../../Draw/src/model/shape/Polyline"
import intersectPToRectCenterAndRectBorder from "../../../Draw/src/util/geometry/intersectPToRectCenterAndRectBorder"
import isTwoRectIntersected from "../../../Draw/src/util/geometry/isTwoRectIntersected"
import isPointInRect from "../../../Draw/src/util/geometry/isPointInRect"
import Path from "../../../Draw/src/model/Path"
import MathVector from "../../../Draw/src/util/math/MathVector"

export default class Link extends Element {
  isLink: boolean = true

  mode: string = STRAIGHT

  source: Node
  target: Node
  style: string

  drawText: DrawText

  lines: Line[] = []
  /**
   * Lines' segments(not including source and target) of link
   * All inner segments may be removed!
   */
  linesSegments: Segment[] = []

  startSegment: Segment
  endSegment: Segment

  /**
   * The lines have been modifed manually
   */
  isManual: boolean = true

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

    this.recreateRecommendedLines()

    // this.drawPolyline = draw.addElement( "polyline", {
    //   segments: [ this.startSegment, this.endSegment ]
    // } )

    this.drawText = draw.addElement( "text", {
      text: "Text on link",
      show: false
    } )

    this.sharedActions.translateLinkDrawTextToCenter( this )
  }

  // ======================
  // Getters
  // ======================

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
      ...this.linesSegments,
      this.endSegment
    ]
    return res
  }

  /**
   * // Start segment or end segment
   */
  getPointOnDrawInstanceKeyPoint( point: Point2D, drawInstance: Path ) {
    let res: Point2D = null

    const { bounds }: Path = drawInstance
    const { left, top, right, bottom } = bounds

    const center: Point2D = { x: ( left + right ) / 2, y: ( top + bottom ) / 2 }
    const { x: cx, y: cy } = center

    const V: MathVector = new MathVector( center, point )

    const angle = V.angle

    if ( ( angle >= 315 && angle < 360 ) || ( angle >= 0 && angle < 45 ) ) {
      res = {
        x: right,
        y: cy
      }
    }

    if ( angle >= 45 && angle < 135 ) {
      res = {
        x: cx,
        y: bottom
      }
    }

    if ( angle >= 135 && angle < 225 ) {
      res = {
        x: left,
        y: cy
      }
    }

    if ( angle >= 225 && angle < 315 ) {
      res = {
        x: cx,
        y: top
      }
    }

    return res
  }

  // ======================
  // Actions
  // ======================
  /**
   * // is manual or not
   */
  updateIsMannual( value: boolean ) {
    this.isManual = value
  }

  enableManual() {
    this.updateIsMannual( true )
  }

  disableManual() {
    this.updateIsMannual( false )
  }

  /**
   * // Start segment and end segment
   */
  updateStartSegment( segment: Segment ) {
    this.startSegment = segment
  }

  recreateStartSegment( segment: Segment ) {
    // Remove old start segment
    this.startSegment && this.draw.actions.REMOVE_ELEMENT( this.startSegment )

    this.startSegment = segment

    this.bindStartSegemntDrag()
  }

  recreateRecommendedStartSegment() {
    const { source, target, draw, mode } = this

    let x: number
    let y: number

    x = source.centerSegment.x
    y = source.centerSegment.y

    if ( mode === STRAIGHT ) {
      if (
        !isPointInRect(
          source.centerSegment.point,
          target.centerSegment.point,
          target.drawBounds.left,
          target.drawBounds.top
        ) &&
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

        if ( isNotNil( intersected ) ) {
          x = intersected.x
          y = intersected.y
        }
      }
    }

    if ( mode === ORTHOGONAL ) {
      const A: Bounds = source.drawInstance.bounds
      const B: Bounds = target.drawInstance.bounds

      if ( B.bottom < A.top || B.top > A.bottom ) {
        if ( B.left > A.right ) {
          x = A.right
        }
        if ( B.right < A.left ) {
          x = A.left
        }
      }

      if ( B.left <= A.right && B.right >= A.left ) {
        if ( B.bottom < A.top ) {
          y = A.top
        }
        if ( B.top > A.bottom ) {
          y = A.bottom
        }
      }

      if ( B.bottom >= A.top && B.top <= A.bottom ) {
        if ( B.left > A.right ) {
          x = A.right
        }
        if ( B.right < A.left ) {
          x = A.left
        }
      }
    }

    const segment: Segment = draw.addElement( "segment", {
      x,
      y,
      draggable: false
    } )

    this.recreateStartSegment( segment )
  }

  bindStartSegemntDrag() {
    this.startSegment.dragger.interfaceStartDrag = this.handleStartSegmentStartDrag.bind(
      this
    )

    this.startSegment.dragger.interfaceDragging = this.handleStartSegmentDragging.bind(
      this
    )

    this.startSegment.dragger.interfaceStopDrag = this.handleStartSegmentStopDrag.bind(
      this
    )
  }

  handleStartSegmentStartDrag( event, dragger ) {
    !this.isManual && this.enableManual()
  }

  handleStartSegmentDragging( event, dragger ) {
    const point: Point2DInitial = this.draw.getters.getInitialPoint( event )
    const deltaX = dragger.getDeltaXToPrevPoint( point )
    const deltaY = dragger.getDeltaYToPrevPoint( point )

    const keyPoint = this.getPointOnDrawInstanceKeyPoint(
      point,
      this.source.drawInstance
    )

    this.draw.getters.testUtils.delayRenderPoint( keyPoint, "blue" )
  }

  handleStartSegmentStopDrag( event, dragger ) {
    const { draw } = this
    const point: Point2DInitial = this.draw.getters.getInitialPoint( event )
    const deltaX = dragger.getDeltaXToPrevPoint( point )
    const deltaY = dragger.getDeltaYToPrevPoint( point )

    const keyPoint = this.getPointOnDrawInstanceKeyPoint(
      point,
      this.source.drawInstance
    )

    const segment: Segment = draw.addElement( "segment", {
      ...keyPoint,
      draggable: false
    } )

    this.recreateStartSegment( segment )
    this.recreateRecommendedLines()
  }

  updateEndSegment( segment: Segment ) {
    this.endSegment = segment
  }

  recreateEndSegment( segment: Segment ) {
    // Remove old end segment
    this.endSegment && this.draw.actions.REMOVE_ELEMENT( this.endSegment )

    this.endSegment = segment

    this.bindEndSegemntDrag()
  }

  recreateRecommendedEndSegment() {
    const { source, target, draw, mode } = this
    let x: number
    let y: number

    x = target.centerSegment.x
    y = target.centerSegment.y

    if ( mode === STRAIGHT ) {
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

        if ( isNotNil( intersected ) ) {
          x = intersected.x
          y = intersected.y
        }
      }
    }

    if ( mode === ORTHOGONAL ) {
      const A: Bounds = source.drawInstance.bounds
      const B: Bounds = target.drawInstance.bounds

      if ( B.bottom < A.top ) {
        y = B.bottom
      }

      if ( B.top > A.bottom ) {
        y = B.top
      }

      if ( B.bottom >= A.top && B.top <= A.bottom ) {
        if ( B.left > A.right ) {
          x = B.left
        }
        if ( B.right < A.left ) {
          x = B.right
        }
      }
    }

    const segment: Segment = draw.addElement( "segment", {
      x,
      y,
      draggable: false
    } )

    this.recreateEndSegment( segment )
  }

  bindEndSegemntDrag() {
    this.endSegment.dragger.interfaceStartDrag = this.handleEndSegmentStartDrag.bind(
      this
    )

    this.endSegment.dragger.interfaceDragging = this.handleEndSegmentDragging.bind(
      this
    )

    this.endSegment.dragger.interfaceStopDrag = this.handleEndSegmentStopDrag.bind(
      this
    )
  }

  handleEndSegmentStartDrag( event, dragger ) {
    !this.isManual && this.enableManual()
  }

  handleEndSegmentDragging( event, dragger ) {
    const point: Point2DInitial = this.draw.getters.getInitialPoint( event )
    const deltaX = dragger.getDeltaXToPrevPoint( point )
    const deltaY = dragger.getDeltaYToPrevPoint( point )

    const keyPoint = this.getPointOnDrawInstanceKeyPoint(
      point,
      this.target.drawInstance
    )

    this.draw.getters.testUtils.delayRenderPoint( keyPoint, "blue" )
  }

  handleEndSegmentStopDrag( event, dragger ) {
    const { draw } = this
    const point: Point2DInitial = this.draw.getters.getInitialPoint( event )
    const deltaX = dragger.getDeltaXToPrevPoint( point )
    const deltaY = dragger.getDeltaYToPrevPoint( point )

    const keyPoint = this.getPointOnDrawInstanceKeyPoint(
      point,
      this.target.drawInstance
    )

    const segment: Segment = draw.addElement( "segment", {
      ...keyPoint,
      draggable: false
    } )

    this.recreateEndSegment( segment )
    this.recreateRecommendedLines()
  }

  /**
   * // Lines and linesSegments
   */
  updateLinesSegments( linesSegments: Segment[] ) {
    this.linesSegments = linesSegments
  }

  recreateLinesSegments( linesSegments: Segment[] ) {
    // Remove old lines' segments
    this.linesSegments && this.draw.actions.REMOVE_ELEMENTS( this.linesSegments )

    this.linesSegments = linesSegments
  }

  updateLines( lines: Line[] ) {
    this.lines = lines
  }

  recreateLines( lines: Line[] ) {
    // Remove old lines
    this.lines && this.draw.actions.REMOVE_ELEMENTS( this.lines )

    this.lines = lines

    this.bindLinesDrag()
  }

  recreateRecommendedLines() {
    const { mode, draw, startSegment, endSegment, isManual } = this
    let lines: Line[] = []

    // Remove old lines
    this.draw.actions.REMOVE_ELEMENTS( this.linesSegments )
    this.draw.actions.REMOVE_ELEMENTS( this.lines )

    if ( mode === STRAIGHT ) {
      const line = draw.addElement( "line", {
        sourceSegment: startSegment,
        targetSegment: endSegment,
        draggable    : false
      } )

      lines.push( line )
    }

    if ( mode === ORTHOGONAL ) {
      if ( !isManual ) {
        const autoRecommendedOrthogonalLines = this.getAutoRecommendedOrthogonalLines()
        lines = [ ...autoRecommendedOrthogonalLines ]
      }

      if ( isManual ) {
        const manualRecommendedOrthogonalLines = this.getManualRecommendedOrthogonalLines()
        lines = [ ...manualRecommendedOrthogonalLines ]
      }

      
    }

    this.recreateLines( lines )
  }

  getAutoRecommendedOrthogonalLines(): Line[] {
    const { source, target, draw, startSegment, endSegment } = this
    const A: Bounds = source.drawInstance.bounds
    const B: Bounds = target.drawInstance.bounds

    let lines: Line[] = []

    if ( B.bottom < A.top || B.top > A.bottom ) {
      if ( B.left > A.right || B.right < A.left ) {
        let line1: Line
        let line2: Line

        const linesSegment: Segment = draw.addElement( "segment", {
          x        : endSegment.x,
          y        : startSegment.y,
          draggable: false
        } )

        this.recreateLinesSegments( [ linesSegment ] )

        line1 = draw.addElement( "line", {
          sourceSegment: startSegment,
          targetSegment: linesSegment,
          showArrow    : false,
          draggable    : false
        } )
        line2 = draw.addElement( "line", {
          sourceSegment: linesSegment,
          targetSegment: endSegment,
          draggable    : false
        } )

        lines = [ line1, line2 ]
      }

      if ( B.left <= A.right && B.right >= A.left ) {
        let line1: Line
        let line2: Line
        let line3: Line

        const centerDeltaY = ( endSegment.y - startSegment.y ) / 2

        const linesSegment1: Segment = draw.addElement( "segment", {
          x        : startSegment.x,
          y        : startSegment.y + centerDeltaY,
          draggable: false
        } )

        const linesSegment2: Segment = draw.addElement( "segment", {
          x        : endSegment.x,
          y        : linesSegment1.y,
          draggable: false
        } )

        this.recreateLinesSegments( [ linesSegment1, linesSegment2 ] )

        line1 = draw.addElement( "line", {
          sourceSegment: startSegment,
          targetSegment: linesSegment1,
          showArrow    : false,
          draggable    : false
        } )
        line2 = draw.addElement( "line", {
          sourceSegment: linesSegment1,
          targetSegment: linesSegment2,
          showArrow    : false,
          draggable    : false
        } )
        line3 = draw.addElement( "line", {
          sourceSegment: linesSegment2,
          targetSegment: endSegment,
          draggable    : false
        } )

        lines = [ line1, line2, line3 ]
      }
    }

    if ( B.bottom >= A.top && B.top <= A.bottom ) {
      let line1: Line
      let line2: Line
      let line3: Line

      const centerDeltaX = ( endSegment.x - startSegment.x ) / 2

      const linesSegment1: Segment = draw.addElement( "segment", {
        x        : startSegment.x + centerDeltaX,
        y        : startSegment.y,
        draggable: false
      } )

      const linesSegment2: Segment = draw.addElement( "segment", {
        x        : linesSegment1.x,
        y        : endSegment.y,
        draggable: false
      } )

      this.recreateLinesSegments( [ linesSegment1, linesSegment2 ] )

      line1 = draw.addElement( "line", {
        sourceSegment: startSegment,
        targetSegment: linesSegment1,
        showArrow    : false,
        draggable    : false
      } )
      line2 = draw.addElement( "line", {
        sourceSegment: linesSegment1,
        targetSegment: linesSegment2,
        showArrow    : false
      } )
      line3 = draw.addElement( "line", {
        sourceSegment: linesSegment2,
        targetSegment: endSegment,
        draggable    : false
      } )

      lines = [ line1, line2, line3 ]
    }

    return lines
  }

  getManualRecommendedOrthogonalLines(): Line[] {
    const { source, target, draw, startSegment, endSegment } = this
    const A: BoundsExtra = source.drawInstance.boundsExtra
    const B: BoundsExtra = target.drawInstance.boundsExtra

    const { x: sx, y: sy }: Segment = startSegment
    const { x: ex, y: ey }: Segment = endSegment
    let lines: Line[] = []

    if ( B.left > A.right ) {
      if ( B.bottom < A.top ) {
        let line1: Line
        let line2: Line

        const linesSegment: Segment = draw.addElement( "segment", {
          x        : endSegment.x,
          y        : startSegment.y,
          draggable: false
        } )

        this.recreateLinesSegments( [ linesSegment ] )

        line1 = draw.addElement( "line", {
          sourceSegment: startSegment,
          targetSegment: linesSegment,
          showArrow    : false,
          draggable    : false
        } )
        line2 = draw.addElement( "line", {
          sourceSegment: linesSegment,
          targetSegment: endSegment,
          draggable    : false
        } )

        lines = [ line1, line2 ]
      }
    } 


    return lines
  }

  bindLinesDrag() {
    const self = this
    this.lines.map( resolve )

    function resolve( line ) {
      line.dragger.interfaceDragging = self.handleLineDragging.bind( self )
    }
  }

  handleLineDragging( event, dragger ) {
    const point: Point2DInitial = this.draw.getters.getInitialPoint( event )
    const deltaX = dragger.getDeltaXToPrevPoint( point )
    const deltaY = dragger.getDeltaYToPrevPoint( point )

    const { source, target, startSegment, endSegment } = this

    // this.sharedActions.translateNode( source, deltaX, deltaY )
    // this.sharedActions.translateNodeDrawInstance( source, deltaX, deltaY )
    // this.sharedActions.translateNode( target, deltaX, deltaY )
    // this.sharedActions.translateNodeDrawInstance( target, deltaX, deltaY )
  }

  translateDrawTextToCenter() {
    const { drawText, drawSharedActions, center } = this
    const { left, top, width, height } = drawText
    const { x, y } = center

    drawSharedActions.translateDrawText(
      drawText,
      -left + x - width / 2,
      -top + y + height / 2 + 15
    )
  }

  // update() {
  //   const { source, target } = this

  //   // this.sharedActions.translateLinkDrawTextToCenter( this )
  //   // this.sharedActions.translateNodesDrawTextsToCenter( [ source, target ] )

  //   this.recreateRecommendedStartSegment()
  //   this.recreateRecommendedEndSegment()
  //   // this.recreateRecommendedLines()
  //   // drawPolyline.updateSegments( this.segments )
  // }
}
