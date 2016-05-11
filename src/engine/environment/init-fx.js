var Tuna = require('tunajs')

module.exports =
  function (audioCtx){
    var tuna = new Tuna(audioCtx)

    var chorus = new tuna.Chorus({
      rate: 1.5,
      feedback: 0.2,
      delay: 0.0045,
      bypass: 0
    })

    chorus.knob = function(ra,fe,de,dont,use){
      chorus.rate = 8*ch+0.01
      chorus.feedback = 1.1*fe
      chorus.delay = de
    }

    var delay = new tuna.Delay({
      feedback: 0.45,
      delayTime: 150,
      wetLevel: 0.25,
      dryLevel: 1,
      cutoff: 2000,
      bypass: 0
    })

    delay.knob = function (fe,de,we,dr,cu){
      delay.feedback = 1.1*fe
      delay.delayTime = 2000*de
      delay.wetLevel = 1.1*we
      delay.dryLevel = 1.1*dr
      delay.cutoff = 20000*cu+20
    }

    var phaser = new tuna.Phaser({
      rate: 1.2,                     //0.01 to 8 is a decent range, but higher values are possible
      depth: 0.3,                    //0 to 1
      feedback: 0.2,                 //0 to 1+
      stereoPhase: 30,               //0 to 180
      baseModulationFrequency: 700,  //500 to 1500
      bypass: 0
    })

    phaser.knob = function (ra,de,fe,st,ba) {
      phaser.rate = 8*ra+0.01
      phaser.depth = de
      phaser.feedback = 1.1*fe
      phaser.stereoPhase = 180*st
      phaser.ba = 1000*ba + 500
    }
    //TODO:destroy all overdrive
    // var overdrive = new tuna.Overdrive({
    //   outputGain: 0.5,         //0 to 1+
    //   drive: 0.7,              //0 to 1
    //   curveAmount: 1,          //0 to 1
    //   algorithmIndex: 0,       //0 to 5, selects one of our drive algorithms
    //   bypass: 0
    // })

    var compressor = new tuna.Compressor({
      threshold: 0.5,    //-100 to 0
      makeupGain: 1,     //0 and up
      attack: 1,         //0 to 1000
      release: 0,        //0 to 3000
      ratio: 4,          //1 to 20
      knee: 5,           //0 to 40
      automakeup: true,  //true/false
      bypass: 0
    })

    compressor.knob = function (th,at,re,ra,kn) {
      compressor.threshold = -100*th
      compressor.attack = 1000*at
      compressor.release = 3000*re
      compressor.ratio = 19*ra+1
      compressor.knee = 40*kn
    }

    //TODO:figure out something to do with this
  //   var convolver = new tuna.Convolver({
  //     highCut: 22050,                         //20 to 22050
  //     lowCut: 20,                             //20 to 22050
  //     dryLevel: 1,                            //0 to 1+
  //     wetLevel: 1,                            //0 to 1+
  //     level: 1,                               //0 to 1+, adjusts total output of both wet and dry
  //     impulse: "impulses/impulse_rev.wav",    //the path to your impulse response
  //     bypass: 0
  // })

  var filter = new tuna.Filter({
      frequency: 440, //20 to 22050
      Q: 1, //0.001 to 100
      gain: 0, //-40 to 40
      filterType: "lowpass", //lowpass, highpass, bandpass, lowshelf, highshelf, peaking, notch, allpass
      bypass: 0
  })

  filter.knob = function (fr,q,ga,no,nope) {
    filter.frequency = fr*22030+20
    filter.Q = q*100+0.001
    filter.ga = 80*ga-40
  }

  // var cabinet = new tuna.Cabinet({
  //   makeupGain: 1,                                 //0 to 20
  //   impulsePath: "impulses/impulse_guitar.wav",    //path to your speaker impulse
  //   bypass: 0
  // })


  var tremolo = new tuna.Tremolo({
      intensity: 0.3,    //0 to 1
      rate: 4,         //0.001 to 8
      stereoPhase: 0,    //0 to 180
      bypass: 0
  })

  tremolo.knob = function(int,ra,st,ohno,never){
    tremolo.intensity = int
    tremolo.rate = 8*ra+0.001
    tremolo.stereoPhase = st*180
  }

  var wahwah = new tuna.WahWah({
      automode: true,                //true/false
      baseFrequency: 0.5,            //0 to 1
      excursionOctaves: 2,           //1 to 6
      sweep: 0.2,                    //0 to 1
      resonance: 10,                 //1 to 100
      sensitivity: 0.5,              //-1 to 1
      bypass: 0
  })

  wahwah.knob = function (ba,ex,sw,re,se){
    wahwah.baseFrequency = ba
    wahwah.excursionOctaves = 6*ex
    wahwah.sweep = sw
    wahwah.resonance = 99*re+1
    wahwah.sensitivity = 2*se-1
  }


  var moog = new tuna.MoogFilter({
      cutoff: 0.065,    //0 to 1
      resonance: 3.5,   //0 to 4
      bufferSize: 4096  //256 to 16384
  })

  moog.knob = function (cu,re,bushi,nyet,nein){
    moog.cutoff = cu
    moog.resonance = 4*re
  }

  var pingPongDelay = new tuna.PingPongDelay({
      wetLevel: 0.5, //0 to 1
      feedback: 0.3, //0 to 1
      delayTimeLeft: 150, //1 to 10000 (milliseconds)
      delayTimeRight: 200 //1 to 10000 (milliseconds)
  })

  pingPongDelay.knob = function (we,fe,dl,dr,NO){
    pingPongDelay.wetLevel = we
    pingPongDelay.feedback = fe
    pingPongDelay.delayTimeLeft = l*9999+1
    pingPongDelay.delayTimeRight = r*9999+1
  }

  // var bitcrusher = new tuna.Bitcrusher({
  //     bits: 4,          //1 to 16
  //     normfreq: 0.1,    //0 to 1
  //     bufferSize: 4096  //256 to 16384
  // })
  //
  // bitcrusher.knob = function (bi,fr,omg,dont,use){
  //   bitcrusher.bits = Math.floor(15*bi+1)
  //   bitcrusher.normfreq = fr
  // }


    return {delay:delay,phaser:phaser,compressor:compressor,
      filter:filter,tremolo:tremolo,wahwah:wahwah,
      moog:moog,pingPongDelay:pingPongDelay}

  }
