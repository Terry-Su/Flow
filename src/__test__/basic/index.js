const flow = new Flow( document.getElementById( "canvas" ) )

const formatBtn = document.getElementById( "format" )
formatBtn.onclick = () => {
  flow.format()
}


flow.addNode( {
  id  : `1`,
  label  : `1`,
  type: "rect",
  x   : 300,
  y   : 500
} )

flow.addNode( {
  id  : `2`,
  label: `2`,
  type: "rect",
  x   : 300,
  y   : 100
} )



flow.addLink( {
  source: `1`,
  target: `2`,
  mode: "orthogonal"
} )

flow.render()