var $ = require('jquery')
var Knob = require('knob')

var controlPanel = {
  $controlPanel: $('#controlPanel'),
  // context: $('#controlPanel')[0].getContext('2d'),
  knobs: [],
  init: function (env) {
    // this.context.fillStyle = '#FFFFFF'
    this.makeKnobs()
  },

makeKnobs: function () {

  for(var i=0;i<5;i++){
    var knob = Knob({
      label: 'Test 123',
      value: 100,
      angleOffset: -125,
      angleArc: 250,
      min: 0,
      max: 200,
      width: 100
    })

    $('body').append(knob)
    this.knobs.push(knob)
    $(knob).hide()
  }

}

}

module.exports = controlPanel
