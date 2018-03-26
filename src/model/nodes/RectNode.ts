import Node from '../Node';
import { RECT_NODE } from '../../store/contant/nodeType';
import Segment from '../../../../Draw/src/model/Segment';

export default class RectNode extends Node {
  type = RECT_NODE

  segmentsToLink: Segment[]

  constructor( props ) {
    super( props )

    this.segmentsToLink = this.getters.getRectNodeSegmentsToLink( this )

  }
}