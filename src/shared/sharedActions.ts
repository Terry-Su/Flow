import FlowStore from "../store/flow/FlowStore"
import Getters from "../store/flow/Getters"
import Link from "../model/Link"
import Node from "../model/Node"
import SharedGetters from "./sharedGetters"
import Segment from "../../../Draw/src/model/Segment"

export default class SharedActions {
  flowStore: FlowStore
  getters: Getters
  sharedGetters: SharedGetters

  constructor(
    flowStore: FlowStore,
    getters: Getters,
    sharedGetters: SharedGetters
  ) {
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
  translateNode( node: Node, deltaX: number, deltaY: number ) {
    node.translate( deltaX, deltaY )
  }
  translateNodeDrawInstance( node, deltaX: number, deltaY: number ) {
    node.translateDrawInstance( deltaX, deltaY )
  }
  translateNodeDrawTextToCenter( node: Node ) {
    node.translateDrawTextToCenter()
  }
  translateNodesDrawTextsToCenter( nodes: Node[] ) {
    nodes.map( this.translateNodeDrawTextToCenter )
  }

  /**
   * // Link
   */
  recreateLinkRecommendedStartSegment( link: Link ) {
    link.recreateRecommendedStartSegment()
  }

  recreateLinksRecommendedStartSegment( links: Link[] ) {
    links.map( this.recreateLinkRecommendedStartSegment )
  }

  recreateLinkRecommendedEndSegment( link: Link ) {
    link.recreateRecommendedEndSegment()
  }

  recreateLinksRecommendedEndSegment( links: Link[] ) {
    links.map( this.recreateLinkRecommendedEndSegment )
  }

  recreateLinkRecommendedLines( link: Link ) {
    link.recreateRecommendedLines()
  }

  recreateLinksRecommendedLines( links: Link[] ) {
    links.map( this.recreateLinkRecommendedLines )
  }

  translateLinkDrawTextToCenter( link: Link ) {
    link.translateDrawTextToCenter()
  }

  translateLinksDrawTextToCenter( links: Link[] ) {
    links.map( this.translateLinkDrawTextToCenter )
  }

  translateLinksDrawTextsToCenter( links: Link[] ) {
    links.map( this.translateLinkDrawTextToCenter )
  }
}
