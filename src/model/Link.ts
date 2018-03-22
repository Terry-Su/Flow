import Element from "./Element"
import isNotNil from "../util/isNotNil"
import Node from "./Node"

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

    const instance = this.getters.draw.addElement( "line", {
      source: {
        x: this.source.x,
        y: this.source.y
      },
      target: {
        x: this.target.x,
        y: this.target.y
      }
    } )
  }
}
