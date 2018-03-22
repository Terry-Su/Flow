const flow = new Flow( document.getElementById( "canvas" ) )

flow.addNode( {
  id   : "1",
  label: "A",
  x    : 100,
  y    : 100
} )

flow.addNode( {
  id   : "2",
  label: "B",
  x    : 500,
  y    : 100
} )

flow.addLink( {
  source: "1",
  target: "2",
  style : "line"
} )

flow.render()
