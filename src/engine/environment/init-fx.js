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

    chorus.knobKeys = [
      {name:'rate',value:1.5,min:0.01,max:8},
      {name:'feedback',value:0.2,min:0,max:1.1},
      {name:'delay',value:0.0045,min:0,max:1}
    ]

    var delay = new tuna.Delay({
      feedback: 0.45,
      delayTime: 150,
      wetLevel: 0.25,
      dryLevel: 1,
      cutoff: 2000,
      bypass: 0
    })

    delay.knobKeys = [
      {name:'wet',value:0.25,min:0,max:1.1},
      {name:'feedback',value:0.45,min:0,max:1.1},
      {name:'time',value:150,min:0,max:2000},
      {name:'dry',value:1,min:0,max:1.1},
      {name:'cutoff',value:2000,min:20,max:20000}
    ]


    var phaser = new tuna.Phaser({
      rate: 1.2,                     //0.01 to 8 is a decent range, but higher values are possible
      depth: 0.3,                    //0 to 1
      feedback: 0.2,                 //0 to 1+
      stereoPhase: 30,               //0 to 180
      baseModulationFrequency: 700,  //500 to 1500
      bypass: 0
    })

    phaser.knobKeys = [
      {name:'rate',value:1.2,min:0.01,max:11},
      {name:'depth',value:0.3,min:0,max:1},
      {name:'feedback',value:0.2,min:0,max:1.1},
      {name:'phase',value:30,min:30,max:180},
      {name:'mod',value:700,min:500,max:1500},
    ]


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

    compressor.knobKeys = [
      {name:'thresh',value:-0.5,min:-100,max:0},
      {name:'gain',value:1,min:0,max:12},
      {name:'attack',value:1,min:0,max:1000},
      {name:'release',value:0,min:0,max:3000},
      {name:'knee',value:5,min:0,max:40},
    ]

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

  filter.knobKeys = [
    {name:'freq',value:440,min:20,max:20000},
    {name:'Q',value:1.5,min:0.001,max:100},
    {name:'gain',value:1.5,min:-40,max:40},
  ]

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

  tremolo.knobKeys = [
    {name:'intensity',value:0.3,min:0,max:1},
    {name:'rate',value:4,min:0.01,max:8},
    {name:'phase',value:0,min:0,max:180},
  ]

  var wahwah = new tuna.WahWah({
      automode: true,                //true/false
      baseFrequency: 0.5,            //0 to 1
      excursionOctaves: 2,           //1 to 6
      sweep: 0.2,                    //0 to 1
      resonance: 10,                 //1 to 100
      sensitivity: 0.5,              //-1 to 1
      bypass: 0
  })

  wahwah.knobKeys = [
    {name:'freq',value:0.5,min:0,max:1},
    {name:'octaves',value:2,min:1,max:6},
    {name:'sweep',value:0.2,min:0,max:1},
    {name:'resonance',value:10,min:1,max:100},
    {name:'sensitivity',value:0.5,min:-1,max:1},
  ]



  var moog = new tuna.MoogFilter({
      cutoff: 0.065,    //0 to 1
      resonance: 3.5,   //0 to 4
      bufferSize: 4096  //256 to 16384
  })

  moog.knobKeys = [
    {name:'cutoff',value:0.065,min:0,max:1},
    {name:'resonance',value:3.5,min:0,max:4},
  ]


  var pingPongDelay = new tuna.PingPongDelay({
      wetLevel: 0.5, //0 to 1
      feedback: 0.3, //0 to 1
      delayTimeLeft: 150, //1 to 10000 (milliseconds)
      delayTimeRight: 200 //1 to 10000 (milliseconds)
  })

  pingPongDelay.knobKeys = [
    {name:'wet',value:0.5,min:0,max:1},
    {name:'feedback',value:0.3,min:0,max:1},
    {name:'delayR',value:150,min:1,max:10000},
    {name:'delayL',value:200,min:1,max:10000},

  ]

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
