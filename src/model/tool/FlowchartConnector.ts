import isSegmentLinesIntersected from "../../../../Draw/src/util/geometry/isSegmentLinesIntersected"
import { isFirst, isLast } from "../../../../Draw/src/util/array"
import removeExtraPointsOnSameSegmentLine from "../../../../Draw/src/util/geometry/removeExtraPointsOnSameSegmentLine"
import isPointOnSegmemtLine from "../../../../Draw/src/util/geometry/isPointOnSegmemtLine"
import MathVector from "../../../../Draw/src/util/math/MathVector"
import Draw from "../../../../Draw/src/Draw";

interface Props {
  sourcePoint: Point2D
  sourceCenter: Point2D
  sourceWidth: number
  sourceHeight: number

  targetPoint: Point2D
  targetCenter: Point2D
  targetWidth: number
  targetHeight: number

  /**
   * For test
   */
  draw: Draw
}

const { min, max } = Math

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

  interval: number = 30

  /**
   * For test
   */
  draw: Draw

  constructor( props: Props ) {
    this.sourcePoint = props.sourcePoint
    this.sourceCenter = props.sourceCenter
    this.sourceWidth = props.sourceWidth
    this.sourceHeight = props.sourceHeight

    this.targetPoint = props.targetPoint
    this.targetCenter = props.targetCenter
    this.targetWidth = props.targetWidth
    this.targetHeight = props.targetHeight

    this.draw = props.draw
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

  get sourceLeftTop(): Point2D {
    return {
      x: this.sourceLeft,
      y: this.sourceTop
    }
  }

  get sourceRightTop(): Point2D {
    return {
      x: this.sourceRight,
      y: this.sourceTop
    }
  }

  get sourceLeftBottom(): Point2D {
    return {
      x: this.sourceLeft,
      y: this.sourceBottom
    }
  }

  get sourceRightBottom(): Point2D {
    return {
      x: this.sourceRight,
      y: this.sourceBottom
    }
  }

  get sourceLeftSegmentLine(): LineTwoPoints {
    return [ this.sourceLeftTop, this.sourceLeftBottom ]
  }

  get sourceRightSegmentLine(): LineTwoPoints {
    return [ this.sourceRightTop, this.sourceRightBottom ]
  }

  get sourceTopSegmentLine(): LineTwoPoints {
    return [ this.sourceLeftTop, this.sourceRightTop ]
  }

  get sourceBottomSegmentLine(): LineTwoPoints {
    return [ this.sourceLeftBottom, this.sourceRightBottom ]
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
   * // Source and target
   */
  get totalExtensionLeft(): number {
    return min( this.sourceLeftExtension.x, this.targetLeftExtension.x )
  }

  get totalExtensionRight(): number {
    return max( this.sourceRightExtension.x, this.targetRightExtension.x )
  }

  get totalExtensionTop(): number {
    return min( this.sourceTopExtension.y, this.targetTopExtension.y )
  }

  get totalExtensionBottom(): number {
    return max( this.sourceBottomExtension.y, this.targetBottomExtension.y )
  }

  get totalExtensionLeftTop(): Point2D {
    return {
      x: this.totalExtensionLeft,
      y: this.totalExtensionTop
    }
  }

  get totalExtensionRightTop(): Point2D {
    return {
      x: this.totalExtensionRight,
      y: this.totalExtensionTop
    }
  }

  get totalExtensionLeftBottom(): Point2D {
    return {
      x: this.totalExtensionLeft,
      y: this.totalExtensionBottom
    }
  }

  get totalExtensionRightBottom(): Point2D {
    return {
      x: this.totalExtensionRight,
      y: this.totalExtensionBottom
    }
  }

  get totalExtensionLeftSegmentLine(): LineTwoPoints {
    return [ this.totalExtensionLeftTop, this.totalExtensionLeftBottom ]
  }

  get totalExtensionRightSegmentLine(): LineTwoPoints {
    return [ this.totalExtensionRightTop, this.totalExtensionRightBottom ]
  }

  get totalExtensionTopSegmentLine(): LineTwoPoints {
    return [ this.totalExtensionLeftTop, this.totalExtensionRightTop ]
  }

  get totalExtensionBottomSegmentLine(): LineTwoPoints {
    return [ this.totalExtensionLeftBottom, this.totalExtensionRightBottom ]
  }

  get totalExtensionSegmentLines(): LineTwoPoints[] {
    return [
      this.totalExtensionLeftSegmentLine,
      this.totalExtensionTopSegmentLine,
      this.totalExtensionRightSegmentLine,
      this.totalExtensionBottomSegmentLine
    ]
  }

  /**
   * // LinesTwoPoints
   */
  get linesTwoPoints(): LineTwoPoints[] {
    let points: Point2D[] = []

    let potential1: Point2D
    let potential2: Point2D
    let potential3: Point2D
    let potential4: Point2D
    let potential5: Point2D

    /**
     * Direction is to source point
     */
    let potentialHorizon: Point2D

    /**
     * Direction is to source point
     */
    let potentialVertical: Point2D

    let proper1: Point2D
    let proper2: Point2D
    let proper3: Point2D
    let proper4: Point2D
    let proper5: Point2D

    /**
     * Temporary horizontal and vertical detecting lines of source that are used to
     * determine next step
     */
    let horizontalDectectingSourceLine: LineTwoPoints
    let verticalDectectingSourceLine: LineTwoPoints
    /**
     * Temporary horizontal and vertical detecting lines of target that are used to
     * determine next step
     */
    let horizontalDectectingTargetLine: LineTwoPoints
    let verticalDectectingTargetLine: LineTwoPoints

    /**
     * Temporary times that is used to
     * determine next step
     */
    let times: number

    const {
      sourcePoint,
      targetPoint,
      currentSourceExtension,
      currentTargetExtension
    } = this
    const { x: sx, y: sy } = sourcePoint
    const { x: tx, y: ty } = targetPoint

    // Draw horizontal line
    potentialHorizon = {
      x: currentTargetExtension.x,
      y: currentSourceExtension.y
    }

    potentialVertical = {
      x: currentSourceExtension.x,
      y: currentTargetExtension.y
    }

    horizontalDectectingSourceLine = [ sourcePoint, potentialHorizon ]
    verticalDectectingSourceLine = [ sourcePoint, potentialVertical ]

    horizontalDectectingTargetLine = [ potentialHorizon, targetPoint ]
    verticalDectectingTargetLine = [ potentialVertical, targetPoint ]

    if (
      this.isIntersectOneSourceBorder( horizontalDectectingSourceLine ) &&
      this.isIntersectOneTargetBorder( horizontalDectectingTargetLine )
    ) {
      points = [
        currentSourceExtension,
        potentialHorizon,
        currentTargetExtension
      ]
    } else if (
      this.isIntersectOneSourceBorder( verticalDectectingSourceLine ) &&
      this.isIntersectOneTargetBorder( verticalDectectingTargetLine )
    ) {
      points = [
        currentSourceExtension,
        potentialVertical,
        currentTargetExtension
      ]
    } else if (
      ( this.notIntersectOneSourceBorder( horizontalDectectingSourceLine ) ||
        this.notIntersectOneTargetBorder( horizontalDectectingTargetLine ) ) &&
      ( this.notIntersectOneSourceBorder( verticalDectectingSourceLine ) ||
        this.notIntersectOneTargetBorder( verticalDectectingTargetLine ) )
    ) {
      const sourceExtensionCorner = this.getSourceExtensionCorner(
        this.currentSourceExtension
      )
      const targetExtensionCorner = this.getTargetExtensionCorner(
        sourceExtensionCorner,
        this.currentTargetExtension
      )

      points = [
        currentSourceExtension,
        sourceExtensionCorner,
        targetExtensionCorner,
        currentTargetExtension
      ]
    }

    points = removeExtraPointsOnSameSegmentLine( [
      sourcePoint,
      ...points,
      targetPoint
    ] )

    const res: LineTwoPoints[] = composeLineTwoPoints( points )

    return res

    function composeLineTwoPoints( points: Point2D[] ) {
      let res: LineTwoPoints[] = []
      points.map( compose )
      return res

      function compose( point: Point2D, index: number, points: Point2D[] ) {
        const { length }: Point2D[] = points

        if ( !isFirst( index ) ) {
          const prev: Point2D = points[ index - 1 ]
          res.push( [ prev, point ] )
        }
      }
    }
  }

  /**
   * // Intersection
   */
  /**
   * // // Source
   */
  getTimesLineIntersectSourceBorder( segmentLine: LineTwoPoints ): number {
    let count: number = 0
    const {
      sourceLeftSegmentLine,
      sourceRightSegmentLine,
      sourceTopSegmentLine,
      sourceBottomSegmentLine
    } = this
    const sourceSegmentLines: LineTwoPoints[] = [
      sourceLeftSegmentLine,
      sourceRightSegmentLine,
      sourceTopSegmentLine,
      sourceBottomSegmentLine
    ]

    sourceSegmentLines.map( resolve )

    return count

    function resolve( sourceSegmentLine: LineTwoPoints ) {
      const isIntersected = isSegmentLinesIntersected(
        segmentLine,
        sourceSegmentLine
      )
      if ( isIntersected ) {
        count = count + 1
      }
    }
  }

  isIntersectOneSourceBorder( segmentLine: LineTwoPoints ) {
    const times = this.getTimesLineIntersectSourceBorder( segmentLine )
    return times === 1
  }

  notIntersectOneSourceBorder( segmentLine: LineTwoPoints ) {
    return !this.isIntersectOneSourceBorder( segmentLine )
  }

  getSourceExtensionCorner( sourceExtension: Point2D ) {
    let res: Point2D = null
    this.totalExtensionSegmentLines.map( resolve )
    return res

    function resolve( segmentLine: LineTwoPoints ) {
      if ( isPointOnSegmemtLine( sourceExtension, segmentLine ) ) {
        res = segmentLine[ 0 ]
      }
    }
  }

  /**
   * // // Target
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
      const isIntersected = isSegmentLinesIntersected(
        segmentLine,
        targetSegmentLine
      )
      if ( isIntersected ) {
        count = count + 1
      }
    }
  }

  isIntersectOneTargetBorder( segmentLine: LineTwoPoints ) {
    const times = this.getTimesLineIntersectTargetBorder( segmentLine )

    return times === 1
  }

  notIntersectOneTargetBorder( segmentLine: LineTwoPoints ) {
    return !this.isIntersectOneTargetBorder( segmentLine )
  }

  getTargetExtensionCorner(
    sourceExtensionCorner: Point2D,
    targetExtension: Point2D
  ) {
    let res: Point2D = null
    this.totalExtensionSegmentLines.map( resolve )
    return res

    function resolve( segmentLine: LineTwoPoints ) {
      if ( isPointOnSegmemtLine( targetExtension, segmentLine ) ) {
        const potentials: Point2D[] = segmentLine
        potentials.map( getRes )
      }
    }

    function getRes( potential: Point2D ) {
      const L: MathVector = new MathVector( potential, sourceExtensionCorner )
      const { angle } = L
      if ( angle === 0 || angle === 90 || angle === 180 || angle === 270 ) {
        res = potential
      }
    }
  }
  // ======================
  // Actions
  // ======================
}
