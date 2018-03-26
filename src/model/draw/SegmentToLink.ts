import Segment from "../../../../Draw/src/model/Segment"

const { PI } = Math

export default class SegmentToLink extends Segment {
  constructor( props ) {
    super( props )
  }
  get path2d(): Path2D {
    const path = new Path2D()
    path.arc( this.x, this.y, 10, 0, PI * 2 )
    return path
  }

  render() {
    const { ctx } = this.getters
    ctx.save()
    ctx.lineWidth = 3
    ctx.fillStyle = "#6ec580"
    ctx.fill( this.path2d )
    ctx.restore()

    this.handleIn.render()
    this.handleOut.render()
  }

  /**
   * Override this to disable drag
   */
  updateDrag() {
    
  }
}
