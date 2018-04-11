import Element from "./Element"
import Segment from "../../../Draw/src/model/Segment"
import isNotNil from "../../../Draw/src/util/isNotNil"
import Link from "./Link"
import DrawText from "../../../Draw/src/model/text/DrawText"
import Item from "../../../Draw/src/model/Item"
import Path from "../../../Draw/src/model/Path"

export default class Node extends Element {
  isNode: boolean = true
  label: string = "Unknown"

  centerSegment: Segment

  // segmentsToLinkList: RectNodeSegmentsToLinkList
  // segmentsToLink: Segment[]

  links: Link[] = []

  linkSegments: Segment[] = []

  drawText: DrawText

  drawInstance: Path

  constructor( props ) {
    super( props )

    this.id = isNotNil( props.id ) ? props.id : this.id
    this.label = isNotNil( props.label ) ? props.label : this.label

    const { draw } = this.getters

      const width = 100
      const height = 80
      this.drawInstance = draw.addElement( "rect", {
        left     : props.x - width / 2,
        top      : props.y - height / 2,
        width    : width,
        height   : height,
        rotatable: false,
        sizable  : false
      } )


    this.centerSegment = draw.addElement( "segment", {
      x   : props.x,
      y   : props.y,
      path: this.drawInstance,
      show: false
    } )

    this.drawText = draw.addElement( "text", {
      text: this.label
    } )
    this.sharedActions.translateNodeDrawTextToCenter( this )

    this.centerSegment.dragger.interfaceDragging = this.handleCenterSegmentDragging.bind(
      this
    )

    this.drawInstance.dragger.interfaceDragging = this.handleDrawInstanceDragging.bind(
      this
    )
  }

  // ======================
  // Getters
  // ======================

  get x(): number {
    return this.centerSegment.x
  }

  get y(): number {
    return this.centerSegment.y
  }

  get drawBounds(): Bounds {
    return this.drawInstance.bounds
  }

  get manualLinks(): Link[] {
    const res: Link[] = this.links.filter( shouldUpdate )
    return res

    function shouldUpdate( link ) {
      return link.isManual
    }
  }

  // ======================
  // Actions
  // ======================
  /**
   * // Link segments
   */
  addLinkSegment( segment: Segment ) {
    this.linkSegments.push( segment )
  }

  removeLinkSegment( segment: Segment ) {
    const { linkSegments } = this

    const segmentIndex: number = getIndex( linkSegments, segment )

		if ( isNotNil( segmentIndex )) {
			this.linkSegments.splice( segmentIndex, 1 )
    }
    
		function getIndex( linkSegments, segment ) {
			let res = null
			linkSegments.map( resolve )
			return res

			function resolve( theSegment, index ) {
				if ( theSegment === segment ) {
					res = index
				}
			}
		}
  }

  /**
   * // Translation
   */
  translate( deltaX: number, deltaY: number ) {
    const { centerSegment } = this

    this.draw.sharedActions.translateSegments( [ centerSegment ], deltaX, deltaY )
    this.translateDrawTextToCenter()    
  }

  translateDrawInstance( deltaX: number, deltaY: number ) {
    this.draw.sharedActions.translateSegments( this.drawInstance.segments, deltaX, deltaY )
  }

  translateLinkSegments( deltaX: number, deltaY: number ) {
    this.drawSharedActions.translateSegments( this.linkSegments, deltaX, deltaY )
  }

  translateDrawTextToCenter(  ) {
    const { drawText, drawSharedActions, x, y } = this
    const { left, top, width, height } = drawText
    drawSharedActions.translateDrawText(
      drawText,
      -left + x - width / 2,
      -top + y + height / 2 + 15
    )
  }

  handleDrawInstanceDragging( event, dragger ) {
    const point: Point2DInitial = this.draw.getters.getInitialPoint( event )
    const deltaX = dragger.getDeltaXToPrevPoint( point )
    const deltaY = dragger.getDeltaYToPrevPoint( point )

    this.translate( deltaX, deltaY )

    this.translateLinkSegments( deltaX, deltaY )

    this.sharedActions.recreateLinksRecommendedLines( this.manualLinks )
    
    // this.sharedActions.translateLinksDrawTextToCenter( this.manualLinks )

    // this.sharedActions.recreateLinksRecommendedStartSegment( this.manualLinks )
    // this.sharedActions.recreateLinksRecommendedEndSegment( this.manualLinks )
    // this.sharedActions.recreateLinksRecommendedLines( this.manualLinks )

  }

  handleCenterSegmentDragging( event, dragger ) {
    // const point: Point2DInitial = this.draw.getters.getInitialPoint( event )
    // const deltaX = dragger.getDeltaXToPrevPoint( point )
    // const deltaY = dragger.getDeltaYToPrevPoint( point )
    // const { segmentsToLink } = this
    // this.draw.sharedActions.translateSegments(
    //   [ ...this.drawInstance.segments, ...segmentsToLink ],
    //   deltaX,
    //   deltaY
    // )
    // this.sharedActions.translateNodeDrawTextToCenter( this )
    // this.sharedActions.translateLinksDrawTextsToCenter( this.links )
  }
}
