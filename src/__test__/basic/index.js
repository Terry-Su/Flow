const flow = new Flow( document.getElementById( "canvas" ) )

flow.addNode( {
  id  : `1`,
  type: "rect",
  x   : 300,
  y   : 300
} )

flow.render()
