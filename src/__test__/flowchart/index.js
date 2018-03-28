const flow = new Flow( document.getElementById( "canvas" ) )

const formatBtn = document.getElementById( "format" )
formatBtn.onclick = () => {
  flow.format()
}

flow.addNode( {
  id  : `Start`,
  label: `Start`,
  type: "rect",
  x   : 500,
  y   : 100
} )

flow.addNode( {
  id  : `A`,
  label: `A`,
  type: "rect",
  x   : 500,
  y   : 300
} )

flow.addNode( {
  id  : `End`,
  label  : `End`,
  type: "rect",
  x   : 300,
  y   : 300
} )


flow.addLink( {
  source: `Start`,
  target: `End`,
} )

flow.render()

