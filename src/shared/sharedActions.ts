import FlowStore from "../store/flow/FlowStore"
import Getters from "../store/flow/Getters"
import Link from '../model/Link';
import Node from '../model/Node';
import SharedGetters from './sharedGetters';
import Segment from "../../../Draw/src/model/Segment";

export default class SharedActions {
  flowStore: FlowStore
  getters: Getters
  sharedGetters: SharedGetters

  constructor( flowStore: FlowStore, getters: Getters, sharedGetters: SharedGetters ) {
    this.flowStore = flowStore
    this.getters = getters
    this.sharedGetters = sharedGetters
  }


  /**
   * // Node
   */
  addLinkToNode( node: Node, link: Link ) {
    node.links.push( link )
  }
  removeLinkFromNode( node: Node, link: Link ) {
    const newLinks = node.links.filter( shouldNotRemove )

    node.links = newLinks

    function shouldNotRemove( theLink: Link ) {
      const res: boolean = theLink !== link
      return res
    }
  }


  translateNodeDrawTextToCenter( node: Node ) {
    const { drawText, drawSharedActions, x, y } = node
    const { left, top, width, height } = drawText
    drawSharedActions.translateDrawText( drawText, -left + x - width / 2 , -top + y + height / 2 + 15 )
  }
  translateNodesDrawTextsToCenter( nodes: Node[] ) {
    nodes.map( this.translateNodeDrawTextToCenter )
  }
  


  /**
   * // Link
   */
  translateLinkDrawTextToCenter( link: Link ) {
    const { drawText, drawSharedActions, center } = link
    const { left, top, width, height } = drawText
    const { x, y } = center

    drawSharedActions.translateDrawText( drawText, -left + x - width / 2, -top + y + height / 2 + 15 )
  }
  
  translateLinksDrawTextsToCenter( links: Link[] ) {
    links.map( this.translateLinkDrawTextToCenter )
  }



  formatLinkPolyline( link: Link ) {
    link.formatDrawPolyline()
  }

}
