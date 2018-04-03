const flow = new Flow( document.getElementById( "canvas" ) )

const formatBtn = document.getElementById( "format" )
formatBtn.onclick = () => {
  flow.format()
}

flow.draw.getters.viewPort.zoomBy( {
  x: 500,
  y: 500
}, -0.5 )


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
  y   : 250
} )

flow.addNode( {
  id  : `B`,
  label: `B`,
  type: "rect",
  x   : 500,
  y   : 400
} )

flow.addNode( {
  id  : `C`,
  label: `C`,
  type: "rect",
  x   : 500,
  y   : 550
} )

flow.addNode( {
  id  : `D`,
  label: `D`,
  type: "rect",
  x   : 500,
  y   : 700
} )

flow.addNode( {
  id  : `End`,
  label  : `End`,
  type: "rect",
  x   : 500,
  y   : 1000
} )


flow.addLinks( [
  {
    source: `Start`,
    target: `A`,
    mode: "orthogonal"
  },{
    source: `A`,
    target: `B`,
    mode: "orthogonal"
  },
  {
    source: `B`,
    target: `C`,
    mode: "orthogonal"
  },
  {
    source: `C`,
    target: `D`,
    mode: "orthogonal"
  },
  {
    source: `D`,
    target: `End`,
    mode: "orthogonal"
  }
])



flow.render()

