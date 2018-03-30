import Node from "../Node"
import { RECT_NODE } from "../../store/contant/nodeType"
import Segment from "../../../../Draw/src/model/Segment"

export default class RectNode extends Node {
  type = RECT_NODE


  constructor( props ) {
    super( props )

  }
}
