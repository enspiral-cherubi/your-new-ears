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

    var delay = new tuna.Delay({
      feedback: 0.45,
      delayTime: 150,
      wetLevel: 0.25,
      dryLevel: 1,
      cutoff: 2000,
      bypass: 0
    })

    var phaser = new tuna.Phaser({
      rate: 1.2,                     //0.01 to 8 is a decent range, but higher values are possible
      depth: 0.3,                    //0 to 1
      feedback: 0.2,                 //0 to 1+
      stereoPhase: 30,               //0 to 180
      baseModulationFrequency: 700,  //500 to 1500
      bypass: 0
    })

    var overdrive = new tuna.Overdrive({
      outputGain: 0.5,         //0 to 1+
      drive: 0.7,              //0 to 1
      curveAmount: 1,          //0 to 1
      algorithmIndex: 0,       //0 to 5, selects one of our drive algorithms
      bypass: 0
    })

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

    return {delay:delay,phaser:phaser,overdrive:overdrive,compressor:compressor}

  }
