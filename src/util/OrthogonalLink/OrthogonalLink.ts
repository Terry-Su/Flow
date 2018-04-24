import OrthogonalLinkRect from "./OrthogonalLinkRect";

export default class OrthogonalLink {
  /**
   * // Source
   */

  /**
   * Source point
   */
  sourcePoint: Point2D

  /**
   * Source rect
   */
  s: OrthogonalLinkRect


  /**
   * // Target
   */

  /**
   * Target point
   */
  targetPoint: Point2D

  /**
   * Target rect
   */
  t: OrthogonalLinkRect


  constructor( props ) {
    const {
      sourcePoint,
      sourceRect,
      targetPoint,
      targetRect
    } = props
    this.s = sourceRect
    this.sourcePoint = sourcePoint

    this.s = targetRect
    this.targetPoint = targetPoint
  }

  // =====================
  // Getters
  // =====================
  getLinesPoints() {



    return []
  }
}