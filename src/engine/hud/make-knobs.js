var $ = require('jquery')
var Knob = require('knob')

function makeKnobs (knobKeys) {

  var knobs = []

  knobKeys.forEach( (k) => {
    var knob = Knob({
      label: k.name,
      value: k.value,
      angleOffset: -125,
      angleArc: 250,
      min: k.min,
      max: k.max,
      width: 100
    })
    knobs.push(knob)
  })

  return knobs


}

export default makeKnobs
