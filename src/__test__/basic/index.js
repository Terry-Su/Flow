const flow = new Flow( document.getElementById( "canvas" ) )

flow.addNode( {
  id  : `1`,
  label: `1`,
  type: "rect",
  x   : 100,
  y   : 100
} )

flow.addNode( {
  id  : `2`,
  label  : `2`,
  type: "rect",
  x   : 300,
  y   : 300
} )

flow.addLink( {
  source: `1`,
  target: `2`
} )

flow.render()
