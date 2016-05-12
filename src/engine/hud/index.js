var controlPanel = require('./control-panel')
var $ = require('jquery')

var hud = {
  controlPanel: controlPanel,

  init: function(env) {
    this.controlPanel.init(env)
  },
  showControls: function(object) {
    this.controlPanel.knobs.forEach((k) => {
      $(k).show()
    })
    console.log('meow')
  },
  hideControls: function(object) {
    this.controlPanel.knobs.forEach((k) => {
      $(k).hide()
    })
  }
}


module.exports = hud
