import makeKnobs from './make-knobs.js'
var $ = require('jquery')

var hud = {

  init: function(env) {
    _(env.FX).forEach((FX) => {
      FX.knobs = makeKnobs(FX.knobKeys)
      FX.knobs.forEach((k) => {
        $('body').append(k)
      })
    })
  },
  showControls: function(object) {

    object.knobs.forEach((k) => {
      $(k).show()
    })

  },
  hideControls: function(object) {
    if (object.knobs) {
      object.knobs.forEach((k) => {
        $(k).hide()
      })
    }
  }
}


module.exports = hud
