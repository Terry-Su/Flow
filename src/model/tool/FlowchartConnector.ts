import isSegmentLinesIntersected from "../../../../Draw/src/util/geometry/isSegmentLinesIntersected";

interface Props {
  sourcePoint: Point2D
  sourceCenter: Point2D
  sourceWidth: number
  sourceHeight: number

  targetPoint: Point2D
  targetCenter: Point2D
  targetWidth: number
  targetHeight: number
}

/**
 * Flowchart connector
 * It's used to get the quantity and the position of lines
 */
export default class FlowchartConnector {
  sourcePoint: Point2D
  sourceCenter: Point2D
  sourceWidth: number
  sourceHeight: number

  targetPoint: Point2D
  targetCenter: Point2D
  targetWidth: number
  targetHeight: number

  interval: number = 5

  constructor( props: Props ) {
    this.sourcePoint = props.sourcePoint
    this.sourceCenter = props.sourceCenter
    this.sourceWidth = props.sourceWidth
    this.sourceHeight = props.sourceHeight

    this.targetPoint = props.targetPoint
    this.targetCenter = props.targetCenter
    this.targetWidth = props.targetWidth
    this.targetHeight = props.targetHeight
  }

  // ======================
  // Getters
  // ======================
  /**
   * // Source
   */
  get sourceLeft(): number {
    return this.sourceCenter.x - this.sourceWidth / 2
  }

  get sourceRight(): number {
    return this.sourceCenter.x + this.sourceWidth / 2
  }

  get sourceTop(): number {
    return this.sourceCenter.y - this.sourceHeight / 2
  }

  get sourceBottom(): number {
    return this.sourceCenter.y + this.sourceHeight / 2
  }

  get sourceLeftExtension(): Point2D {
    const { sourceCenter, sourceWidth, interval } = this
    const { x, y } = sourceCenter
    return {
      x: x - sourceWidth / 2 - interval,
      y: sourceCenter.y
    }
  }

  get sourceRightExtension(): Point2D {
    const { sourceCenter, sourceWidth, interval } = this
    const { x, y } = sourceCenter
    return {
      x: x + sourceWidth / 2 + interval,
      y: sourceCenter.y
    }
  }

  get sourceTopExtension(): Point2D {
    const { sourceCenter, sourceHeight, interval } = this
    const { x, y } = sourceCenter
    return {
      x: x,
      y: y - sourceHeight / 2 - interval
    }
  }

  get sourceBottomExtension(): Point2D {
    const { sourceCenter, sourceHeight, interval } = this
    const { x, y } = sourceCenter
    return {
      x: x,
      y: y + sourceHeight / 2 + interval
    }
  }

  get currentSourceExtension(): Point2D {
    const {
      sourceLeft,
      sourceRight,
      sourceTop,
      sourceBottom,
      sourcePoint,
      sourceCenter,
      sourceLeftExtension,
      sourceRightExtension,
      sourceTopExtension,
      sourceBottomExtension
    } = this
    const { x, y } = sourcePoint
    const { x: cx, y: cy } = sourceCenter
    let res: Point2D = this.sourceLeftExtension

    if ( x === sourceLeft && y === cy ) {
      res = sourceLeftExtension
    }

    if ( x === sourceRight && y === cy ) {
      res = sourceRightExtension
    }

    if ( x === cx && y === sourceTop ) {
      res = sourceTopExtension
    }

    if ( x === cx && y === sourceBottom ) {
      res = sourceBottomExtension
    }

    return res
  }

  /**
   * // Target
   */
  get targetLeft(): number {
    return this.targetCenter.x - this.targetWidth / 2
  }

  get targetRight(): number {
    return this.targetCenter.x + this.targetWidth / 2
  }

  get targetTop(): number {
    return this.targetCenter.y - this.targetHeight / 2
  }

  get targetBottom(): number {
    return this.targetCenter.y + this.targetHeight / 2
  }

  get targetLeftTop(): Point2D {
    return {
      x: this.targetLeft,
      y: this.targetTop
    }
  }

  get targetRightTop(): Point2D {
    return {
      x: this.targetRight,
      y: this.targetTop
    }
  }

  get targetLeftBottom(): Point2D {
    return {
      x: this.targetLeft,
      y: this.targetBottom
    }
  }

  get targetRightBottom(): Point2D {
    return {
      x: this.targetRight,
      y: this.targetBottom
    }
  }

  get targetLeftSegmentLine(): LineTwoPoints {
    return [ this.targetLeftTop, this.targetLeftBottom ]
  }

  get targetRightSegmentLine(): LineTwoPoints {
    return [ this.targetRightTop, this.targetRightBottom ]
  }

  get targetTopSegmentLine(): LineTwoPoints {
    return [ this.targetLeftTop, this.targetRightTop ]
  }

  get targetBottomSegmentLine(): LineTwoPoints {
    return [ this.targetLeftBottom, this.targetRightBottom ]
  }

  get targetLeftExtension(): Point2D {
    const { targetCenter, targetWidth, interval } = this
    const { x, y } = targetCenter
    return {
      x: x - targetWidth / 2 - interval,
      y: targetCenter.y
    }
  }

  get targetRightExtension(): Point2D {
    const { targetCenter, targetWidth, interval } = this
    const { x, y } = targetCenter
    return {
      x: x + targetWidth / 2 + interval,
      y: targetCenter.y
    }
  }

  get targetTopExtension(): Point2D {
    const { targetCenter, targetHeight, interval } = this
    const { x, y } = targetCenter
    return {
      x: x,
      y: y - targetHeight / 2 - interval
    }
  }

  get targetBottomExtension(): Point2D {
    const { targetCenter, targetHeight, interval } = this
    const { x, y } = targetCenter
    return {
      x: x,
      y: y + targetHeight / 2 + interval
    }
  }

  get currentTargetExtension(): Point2D {
    const {
      targetLeft,
      targetRight,
      targetTop,
      targetBottom,
      targetPoint,
      targetCenter,
      targetLeftExtension,
      targetRightExtension,
      targetTopExtension,
      targetBottomExtension
    } = this
    const { x, y } = targetPoint
    const { x: cx, y: cy } = targetCenter
    let res: Point2D = this.targetLeftExtension

    if ( x === targetLeft && y === cy ) {
      res = targetLeftExtension
    }

    if ( x === targetRight && y === cy ) {
      res = targetRightExtension
    }

    if ( x === cx && y === targetTop ) {
      res = targetTopExtension
    }

    if ( x === cx && y === targetBottom ) {
      res = targetBottomExtension
    }

    return res
  }

  /**
   * // LinesTwoPoints
   */
  get linesTwoPoints(): LineTwoPoints[] {
    let potential1: Point2D
    let potential2: Point2D
    let potential3: Point2D
    let potential4: Point2D
    let potential5: Point2D

    /**
     * Temporary detecting line that is used to
     * determine next step
     */
    let dectectingLine: LineTwoPoints
    
    /**
     * Temporary times that is used to
     * determine next step
     */
    let times: number

    const { sourcePoint, targetPoint } = this
    const { x: sx, y: sy } = sourcePoint
    const { x: tx, y: ty } = targetPoint

    // Draw horizontal line
    potential1 = {
      x: tx,
      y: sy
    }

    dectectingLine = [ potential1, targetPoint ]

    times = this.getTimesLineIntersectTargetBorder( dectectingLine )

    console.log( times )

    return []
  }

  /**
   * // Intersection
   */
  getTimesLineIntersectTargetBorder( segmentLine: LineTwoPoints ): number {
    let count: number = 0
    const {
      targetLeftSegmentLine,
      targetRightSegmentLine,
      targetTopSegmentLine,
      targetBottomSegmentLine
    } = this
    const targetSegmentLines: LineTwoPoints[] = [
      targetLeftSegmentLine,
      targetRightSegmentLine,
      targetTopSegmentLine,
      targetBottomSegmentLine
    ]

    targetSegmentLines.map( resolve )

    return count

    function resolve( targetSegmentLine: LineTwoPoints ) {
      const isIntersected = isSegmentLinesIntersected( segmentLine, targetSegmentLine )
      if ( isIntersected ) {
        count = count + 1
      }
    }
  }

  // ======================
  // Actions
  // ======================
}
