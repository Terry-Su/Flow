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
  },{
    source: `A`,
    target: `B`
  },
  {
    source: `B`,
    target: `C`
  },
  {
    source: `C`,
    target: `D`
  },
  {
    source: `D`,
    target: `End`
  }
])



flow.render()

