import Rect from "../geometry/Rect";

export default class OrthogonalLinkRect extends Rect {
  interval: number = 20

  constructor( center: Point2D, width: number, height: number ) {
    super( center, width, height )
  }

  get leftExtension(): Point2D {
    const { center, width, interval } = this
    const { x, y } = center
    return {
      x: x - width / 2 - interval,
      y: center.y
    }
  }

  get rightExtension(): Point2D {
    const { center, width, interval } = this
    const { x, y } = center
    return {
      x: x + width / 2 + interval,
      y: center.y
    }
  }

  get topExtension(): Point2D {
    const { center, height, interval } = this
    const { x, y } = center
    return {
      x: x,
      y: y - height / 2 - interval
    }
  }

  get bottomExtension(): Point2D {
    const { center, height, interval } = this
    const { x, y } = center
    return {
      x: x,
      y: y + height / 2 + interval
    }
  }
}