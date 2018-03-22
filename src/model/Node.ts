import Element from "./Element"
import isNotNil from "../util/isNotNil"
export default class Node extends Element {
  isNode: boolean = true
  label: string = "Unknown"

  drawInstance: any

  segment: any

  constructor( props ) {
    super( props )

    this.id = isNotNil( props.id ) ? props.id : this.id
    this.label = isNotNil( props.label ) ? props.label : this.label

    this.segment = this.getters.draw.addElement( "segment", {
      x: props.x,
      y: props.y
    } )

    const width = 100
    const height = 80
    this.drawInstance = this.getters.draw.addElement( "rect", {
      left  : this.segment.x - width / 2,
      top   : this.segment.y - height / 2,
      width : width,
      height: height
    } )
  }

  get x(): number {
    return this.segment.x
  }

  get y(): number {
    return this.segment.y
  }
}
