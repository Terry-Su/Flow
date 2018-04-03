import Element from "./Element"
import Node from "./Node"
import isNotNil from "../../../Draw/src/util/isNotNil"
import DrawText from "../../../Draw/src/model/text/DrawText"
import { STRAIGHT, ORTHOGONAL } from "../store/constant/linkMode"
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

  lines: Line[] = []

  startSegment: Segment
  endSegment: Segment

  /**
   * Inner segments(not including source and target) of link
   * All inner segments may be removed!
   */
  innerSegments: Segment[] = []


  /**
   * The lines have been modifed manually
   */
  isManual: boolean = false

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

    this.recreateLines()

    // this.drawPolyline = draw.addElement( "polyline", {
    //   segments: [ this.startSegment, this.endSegment ]
    // } )

    this.drawText = draw.addElement( "text", {
      text: "Text on link",
      show: false
    } )

    this.sharedActions.translateLinkDrawTextToCenter( this )

    this.bindStartSegemntDrag()
    this.bindEndSegemntDrag()
    this.bindLinesDrag()
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
  get recommendedOrthogonalLines(): Line[] {
    const { source, target, draw, startSegment, endSegment } = this
    const A: Bounds = source.drawInstance.bounds
    const B: Bounds = target.drawInstance.bounds

    let lines: Line[] = []

    if ( B.bottom < A.top || B.top > A.bottom ) {
      if ( B.left > A.right || B.right < A.left ) {
        let line1: Line
        let line2: Line

        const innerSegment: Segment = draw.addElement( "segment", {
          x        : endSegment.x,
          y        : startSegment.y,
          draggable: false
        } )

        this.innerSegments.push( innerSegment )

        line1 = draw.addElement( "line", {
          sourceSegment: startSegment,
          targetSegment: innerSegment,
          showArrow    : false,
          draggable    : false
        } )
        line2 = draw.addElement( "line", {
          sourceSegment: innerSegment,
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

        const innerSegment1: Segment = draw.addElement( "segment", {
          x        : startSegment.x,
          y        : startSegment.y + centerDeltaY,
          draggable: false
        } )

        const innerSegment2: Segment = draw.addElement( "segment", {
          x        : endSegment.x,
          y        : innerSegment1.y,
          draggable: false
        } )

        this.innerSegments = [ innerSegment1, innerSegment2 ]

        line1 = draw.addElement( "line", {
          sourceSegment: startSegment,
          targetSegment: innerSegment1,
          showArrow    : false,
          draggable    : false
        } )
        line2 = draw.addElement( "line", {
          sourceSegment: innerSegment1,
          targetSegment: innerSegment2,
          showArrow    : false,
          draggable    : false
        } )
        line3 = draw.addElement( "line", {
          sourceSegment: innerSegment2,
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

      const innerSegment1: Segment = draw.addElement( "segment", {
        x: startSegment.x + centerDeltaX,
        y: startSegment.y,
        draggable    : false
      } )

      const innerSegment2: Segment = draw.addElement( "segment", {
        x: innerSegment1.x,
        y: endSegment.y,
        draggable    : false
      } )

      this.innerSegments = [ innerSegment1, innerSegment2 ]

      line1 = draw.addElement( "line", {
        sourceSegment: startSegment,
        targetSegment: innerSegment1,
        showArrow    : false,
        draggable    : false
      } )
      line2 = draw.addElement( "line", {
        sourceSegment: innerSegment1,
        targetSegment: innerSegment2,
        showArrow    : false,
      } )
      line3 = draw.addElement( "line", {
        sourceSegment: innerSegment2,
        targetSegment: endSegment,
        draggable    : false
      } )

      lines = [ line1, line2, line3 ]
    }

    return lines
  }

  recreateRecommendedStartSegment() {
    const { source, target, draw, mode } = this

    let x: number
    let y: number

    // Remove old start segment
    this.startSegment && this.draw.actions.REMOVE_ELEMENT( this.startSegment )

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

    this.startSegment = segment
  }

  recreateRecommendedEndSegment() {
    const { source, target, draw, mode } = this
    let x: number
    let y: number

    // Remove old start segment
    this.endSegment && this.draw.actions.REMOVE_ELEMENT( this.endSegment )

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

    this.endSegment = segment
  }

  recreateLines() {
    const { mode, draw, startSegment, endSegment } = this
    let lines: Line[] = []

    // Remove old lines
    this.draw.actions.REMOVE_ELEMENTS( this.innerSegments )
    this.draw.actions.REMOVE_ELEMENTS( this.lines )

    switch ( mode ) {
      case STRAIGHT:
        const line = draw.addElement( "line", {
          sourceSegment: startSegment,
          targetSegment: endSegment,
          draggable    : false
        } )

        lines.push( line )
        break
      case ORTHOGONAL:
        lines = [ ...this.recommendedOrthogonalLines ]
        break
    }

    this.lines = lines
  }

  bindLinesDrag() {
    const self = this
    this.lines.map( resolve )

    function resolve( line ) {
      line.dragger.interfaceDragging = self.handleLineDragging.bind( self )
    }
  }

  bindStartSegemntDrag() {
    this.startSegment.dragger.interfaceDragging = this.handleStartSegmentDragging.bind(
      this
    )
  }

  bindEndSegemntDrag() {
    this.endSegment.dragger.interfaceDragging = this.handleEndSegmentDragging.bind(
      this
    )
  }

  handleStartSegmentDragging( event, dragger ) {
    const point: Point2DInitial = this.draw.getters.getInitialPoint( event )
    const deltaX = dragger.getDeltaXToPrevPoint( point )
    const deltaY = dragger.getDeltaYToPrevPoint( point )

    const { source } = this

    this.sharedActions.translateNode( source, deltaX, deltaY )
    this.sharedActions.translateNodeDrawInstance( source, deltaX, deltaY )

    this.recreateLines()
  }

  handleEndSegmentDragging( event, dragger ) {
    const point: Point2DInitial = this.draw.getters.getInitialPoint( event )
    const deltaX = dragger.getDeltaXToPrevPoint( point )
    const deltaY = dragger.getDeltaYToPrevPoint( point )

    const { target } = this

    this.sharedActions.translateNode( target, deltaX, deltaY )
    this.sharedActions.translateNodeDrawInstance( target, deltaX, deltaY )

    this.recreateLines()
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
  //   // this.recreateLines()
  //   // drawPolyline.updateSegments( this.segments )
  // }
}
