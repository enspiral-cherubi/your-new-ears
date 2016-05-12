import THREE from 'three'
var dolphinLoader = require('three-dolphin-geometry-loader')(THREE)
import $ from 'jquery'
import THREEFlyControls from 'three-fly-controls'
THREEFlyControls(THREE)
import WindowResize from 'three-window-resize'
var audioCtx = new (window.AudioContext || window.webkitAudioContext)
var $micSelector = require('mic-selector')(audioCtx)
import webAudioAnalyser2 from 'web-audio-analyser-2'
import initFX from './init-fx.js'
import _ from 'lodash'
import rand from 'unique-random'
import ParticleStream from './particle-stream.js'
import loadParticleTexture from './particle-texture-loader'
var Tuna = require('tunajs')
var tuna = new Tuna(audioCtx)
import hud from './../hud'
import vmath from './services/vector-math.js'

class Environment {


  constructor () {


    this.scene = new THREE.Scene()

    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.01, 1000)
    this.camera.position.z = 20

    this.renderer = new THREE.WebGLRenderer({alpha: true, canvas: $('#three-canvas')[0]})
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.setClearColor(0x000000, 0)

    this.controls = new THREE.FlyControls(this.camera, this.renderer.domElement)
    this.controls.movementSpeed = 0.1

    var windowResize = new WindowResize(this.renderer, this.camera)

    this.mouse = new THREE.Vector2(0,0)

    this.raycaster = new THREE.Raycaster()
    this.raycaster.setFromCamera(this.mouse,this.camera)
    this.clicked = null
    this.connections = []
    this.closeBy = []

    this.setupAudio()
    this.barkScaleFrequencyData = this.analyser.barkScaleFrequencyData()
    this._makeWidgets()
    this.particleTexture = loadParticleTexture()
    this._makeParticles()

    hud.init(this)

  }

  render () {

    this.barkScaleFrequencyData = this.analyser.barkScaleFrequencyData()

    this.updateAnalyser()

    this.rotateSelections()

    this.updateParticleStreams()

    this.swell()

    this.updatehud()

    this.renderer.render(this.scene, this.camera)
  }

  updatehud () {
    var closestObject = null
    var dist = 9
    _(this.FX).forEach((FX) => {
      var newDist = vmath.distSquared(FX.widget.position,this.camera.position)
      if (newDist<dist) {
        closestObject = FX
        dist = newDist
      } else {
        hud.hideControls(FX)
      }
    })

    if (closestObject) {
      hud.showControls(closestObject)
    }
  }


  // 'private'

  _makeWidgets () {
    var self = this
    //I use a sphere geometry to arrange the FX boxes
    var sphere = new THREE.SphereGeometry(15,30,30)
    var locations = sphere.vertices
    var randNumber = rand(0,locations.length)

    _(this.FX).forEach(function (FX){
      var geometry = new THREE.BoxGeometry(1,1,1)
      var material = new THREE.MeshNormalMaterial()
      FX.widget = new THREE.Mesh(geometry, material)
      FX.widget.clickable = true
      FX.widget.effect = FX
      var pos = randNumber()
      FX.widget.position.set(locations[pos].x + 2*Math.random(),
      locations[pos].y+2*Math.random(),
      locations[pos].z+2*Math.random())
      FX.widget.particleStreams = []
      self.scene.add(FX.widget)
    })

    this.analyserGeometry = new THREE.SphereGeometry(1,6,6)
    this.analyserGeometry.dynamic = true
    var material = new THREE.MeshNormalMaterial()
    var sourceSink = new THREE.Mesh(this.analyserGeometry,material)
    sourceSink.effect = this.analyser
    this.analyser.name = 'Source // Sink'
    sourceSink.sink = this.filter
    sourceSink.clickable = true
    sourceSink.flow = function (vector) {
      //flowing away
      var flow = vector.multiplyScalar(1/magSquared(vector))
    }
    sourceSink.particleStreams = []
    this.sourceSink = sourceSink
    this.scene.add(sourceSink)



  }

  _makeParticles () {
    var particles = 2000
    var geometry = new THREE.BufferGeometry()
    var colors = new Float32Array(particles*3)
    var sizes = new Float32Array(particles)
    var positions = new Float32Array(particles*3)
    var color = new THREE.Color()
    for(var i = 0, i3 = 0; i<particles; i++, i+=3){
      positions[ i3 + 0 ] = ( Math.random() * 2 - 1 );
			positions[ i3 + 1 ] = ( Math.random() * 2 - 1 );
			positions[ i3 + 2 ] = ( Math.random() * 2 - 1 );
			color.setHSL( i / particles, 1.0, 0.5 );
			colors[ i3 + 0 ] = color.r;
			colors[ i3 + 1 ] = color.g;
			colors[ i3 + 2 ] = color.b;
			sizes[ i ] = 20;
    }

  }

  setupAudio () {
    this.analyser = webAudioAnalyser2({
      context: audioCtx,
      fftSize: 2048,
      equalTemperedFreqBinCount: 10
    })
    var self = this



    $micSelector.on('bang', function (e, node) {
      node.connect(self.analyser)
    })

    $('body').append($micSelector)
    $micSelector.css('position','absolute')

    var compressor = audioCtx.createDynamicsCompressor()
    compressor.threshold.value = 80;
    compressor.knee.value = 80;
    compressor.ratio.value = 25;
    compressor.reduction.value = 50;
    compressor.attack.value = 0;
    compressor.release.value = 0.25;

    this.filter = new tuna.Filter({
        frequency: 8000, //20 to 22050
        Q: 10, //0.001 to 100
        gain: 20, //-40 to 40
        filterType: "lowpass", //lowpass, highpass, bandpass, lowshelf, highshelf, peaking, notch, allpass
        bypass: 0
    })

    this.filter.connect(compressor)

    compressor.connect(audioCtx.destination)

    this.FX = initFX(audioCtx)

  }

  onKeydown (e) {
    if (e.keyCode == 32){
      _(this.FX).forEach((fx) => {
        fx.disconnect()
        fx.widget.particleStreams.forEach((ps) => {
          ps.disconnect()
        })
      })
      this.analyser.disconnect()
      this.sourceSink.particleStreams.forEach((ps) => {ps.disconnect()})
    }
//keycodes TODO: make into knob turners
    // 84 71
    // 89 72
    // 85 74
    // 73 75
    // 79 76
    // 80 186
  }

  onMouseMove (e) {

    this.mouse.x = (e.clientX/window.innerWidth)*2-1
    this.mouse.y = -(e.clientY/window.innerHeight)*2+1
  }

  onMouseDown (e) {
    var notClicked = true
    var self = this
    var intersects = this.raycaster.intersectObjects(this.scene.children)
    intersects.forEach(function (i) {
      if (i.object.clickable && notClicked){
        if (self.clicked) {
          if (self.clicked === i.object){
              self.clicked.effect.disconnect()
              self.clicked.particleStreams.forEach( (ps) => {
                ps.disconnect()
              })
          } else{
            if (i.object.sink){
              var particleStream = new ParticleStream(self.clicked,i.object,self.particleTexture,audioCtx)
              self.clicked.particleStreams.push(particleStream)
              self.scene.add(particleStream.particles)
            } else {
              if (self.clicked === i.object){
                  self.clicked.effect.disconnect()
                  self.clicked.particleStreams.forEach( (ps) => {
                    ps.disconnect()
                  })
              } else {
                i.object.scale.set(2,2,2)
                i.object.growing = 50
                var particleStream = new ParticleStream(self.clicked,i.object,self.particleTexture,audioCtx)
                self.clicked.particleStreams.push(particleStream)
                self.scene.add(particleStream.particles)
              }
          }
        }
          self.clicked = null
        } else {
          self.clicked = i.object
        }
        notClicked = false
      }
    })
  }

  onMouseUp (e) {
    var closestObject = null
    var dist = 9
    _(this.FX).forEach((FX) => {
      var newDist = vmath.distSquared(FX.widget.position,this.camera.position)
      if (newDist<dist) {
        closestObject = FX
        dist = newDist
      }
    })

    if (closestObject) {
      var knobVals = closestObject.knobs.map((k) => {return k.getValue()})
      closestObject.turn(knobVals)
    }
  }



  _updateParticles () {
    this.particles.forEach(function (particle) {
      var flow = particle.from.flow.add(particle.to.flow)
      particle.position.addScaledVector(flow,0.1)
      var distanceToSink = magSquared(particle.position.sub(particle.to.position))
      if (distanceToSink<1) {
        if (particle.to.particleStreams.length>0){
          //send particle to next box when it gets close to its destination
          var randNumber = rand(0,particle.to.particleStreams.length)
          particle.to = particle.to.particleStreams[randNumber]
        }
      }
    })
  }


    swell () {
      _(this.FX).forEach((FX) => {
        if (FX.widget.growing>0) {
          var growing = FX.widget.growing
          FX.widget.scale.set(1+growing/50,1+growing/50,1+growing/50)
          FX.widget.growing-=1
        }
      })
    }

    updateParticleStreams () {
      _(this.FX).forEach((FX) => {
        FX.widget.particleStreams.forEach( (ps) => {
          ps.updateParticles()
        })
      })

      this.sourceSink.particleStreams.forEach( (ps) => {ps.updateParticles()})
    }

    updateAnalyser () {
      for (var i = 0; i < 24; i++){
        var amplitude = Math.sin(this.barkScaleFrequencyData.frequencies[i])
        this.analyserGeometry.vertices[2*i].add(new THREE.Vector3((Math.random()-0.5)*amplitude,
        (Math.random()-0.5)*amplitude,
        (Math.random()-0.5)*amplitude))
        this.analyserGeometry.vertices[2*i].multiplyScalar(0.99)
      }
      this.analyserGeometry.verticesNeedUpdate = true
    }

    rotateSelections () {
      //find intersections
      // this.camera.lookAt(this.scene.position)
      this.camera.updateMatrixWorld()
      this.raycaster.setFromCamera(this.mouse,this.camera)
      var intersects = this.raycaster.intersectObjects(this.scene.children)
      intersects.forEach(function (i) {
        if (i.object.clickable){
          i.object.rotation.x += .01
          i.object.rotation.y += .01
          $('div.effect-label').html('<font size=12>' + i.object.effect.name + '</font>')
        }
      })

      if (this.clicked) {
        this.clicked.rotation.x -= 0.1
        this.clicked.rotation.y -= 0.1
      }
    }



}

export default Environment
