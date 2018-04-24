const flow0 = new Flow( document.getElementById( "canvas0" ) )
const { OrthogonalLink, OrthogonalLinkRect } = flow0.getters.test

const node1 = flow0.addNode( {
  id   : `A`,
  label: `A`,
  type : "rect",
  x    : 200,
  y    : 300
} )

const node2 = flow0.addNode( {
  id   : `B`,
  label: `B`,
  type : "rect",
  x    : 400,
  y    : 300
} )


const rect1 = new OrthogonalLinkRect(
  node1.centerSegment.point,
  node1.drawInstance.boundsExtra.width,
  node1.drawInstance.boundsExtra.height,
)

const rect2 = new OrthogonalLinkRect(
  node2.centerSegment.point,
  node2.drawInstance.boundsExtra.width,
  node2.drawInstance.boundsExtra.height,
)

const link1 = new OrthogonalLink( {
  sourceRect: rect1,
  sourcePoint: rect1.topCenter,
  targetRect: rect2,
  targetPoint: rect2.leftCenter
} )

const linesPoints1 = link1.getLinesPoints()


console.log( linesPoints1 )


flow0.render()
