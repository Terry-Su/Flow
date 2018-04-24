export default class {
  center: Point2D
  width: number
  height: number

  constructor( center: Point2D, width: number, height: number ) {
    this.center = center
    this.width = width
    this.height = height
  }

  get cx() {
    return this.center.x
  }

  get cy() {
    return this.center.y
  }

  get left() {
    return this.cx - this.width / 2
  }

  get right() {
    return this.cx + this.width / 2
  }

  get top() {
    return this.cy - this.height / 2
  }

  get bottom() {
    return this.cy + this.height / 2
  }

  get topCenter(): Point2D {
    return {
      x: this.cx,
      y: this.top
    }
  }

  get bottomCenter(): Point2D {
    return {
      x: this.cx,
      y: this.bottom
    }
  }

  get leftCenter(): Point2D {
    return {
      x: this.left,
      y: this.cy
    }
  }

  get rightCenter(): Point2D {
    return {
      x: this.right,
      y: this.cy
    }
  }

  get leftTop(): Point2D {
    return {
      x: this.left,
      y: this.top
    }
  }

  get rightTop(): Point2D {
    return {
      x: this.right,
      y: this.top
    }
  }

  get leftBottom(): Point2D {
    return {
      x: this.left,
      y: this.bottom
    }
  }

  get rightBottom(): Point2D {
    return {
      x: this.right,
      y: this.bottom
    }
  }

  get leftLine(): LineTwoPoints {
    return [ this.leftBottom, this.leftTop  ]
  }

  get rightLine(): LineTwoPoints {
    return [ this.rightTop, this.rightBottom ]
  }

  get topLine(): LineTwoPoints {
    return [ this.leftTop, this.rightTop ]
  }

  get bottomLine(): LineTwoPoints {
    return [ this.rightBottom, this.leftBottom ]
  }

}