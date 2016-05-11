import THREE from 'three'
var dolphinLoader = require('three-dolphin-geometry-loader')(THREE)
import $ from 'jquery'
import THREEFlyControls from 'three-fly-controls'
THREEFlyControls(THREE)
import WindowResize from 'three-window-resize'
var audioCtx = new (window.AudioContext || window.webkitAudioContext)
import GetMic from './get-mic.js'
var getMic = GetMic(audioCtx)
import webAudioAnalyser2 from 'web-audio-analyser-2'
import initFX from './init-fx.js'
import _ from 'lodash'
import rand from 'unique-random'
var mag = require('vectors/mag')(3)

class Environment {


  constructor () {
    this.scene = new THREE.Scene()

    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.01, 1000)
    this.camera.position.z = 10

    this.renderer = new THREE.WebGLRenderer({alpha: true, canvas: $('#three-canvas')[0]})
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.setClearColor(0xffffff, 1)

    this.controls = new THREE.FlyControls(this.camera, this.renderer.domElement)
    this.controls.movementSpeed = 0.1

    var windowResize = new WindowResize(this.renderer, this.camera)

    this.mouse = new THREE.Vector2(0,0)

    this.raycaster = new THREE.Raycaster()
    this.raycaster.setFromCamera(this.mouse,this.camera)
    this.clicked = null
    this.connections = []
    this.on = []

    this.setupAudio()
    this.barkScaleFrequencyData = this.analyser.barkScaleFrequencyData()
    this._makeWidgets()
    this._makeParticles()
  }

  render () {
    this.barkScaleFrequencyData = this.analyser.barkScaleFrequencyData()

    //find intersections
    this.camera.lookAt(this.scene.position)
    this.camera.updateMatrixWorld()
    this.raycaster.setFromCamera(this.mouse,this.camera)
    var intersects = this.raycaster.intersectObjects(this.scene.children)
    intersects.forEach(function (i) {
      if (i.object.clickable){
        i.object.rotation.x += .01
        i.object.rotation.y += .01
      }
    })

    if (this.clicked) {
      this.clicked.rotation.x -= 0.1
      this.clicked.rotation.y -= 0.1
    }



    this.renderer.render(this.scene, this.camera)
  }

  // 'private'

  _makeWidgets () {
    var self = this
    //I use a sphere geometry to arrange the FX boxes
    var sphere = new THREE.SphereGeometry(5,10,10)
    var locations = sphere.vertices
    var randNumber = rand(0,locations.length)

    _(this.FX).forEach(function (FX){
      var geometry = new THREE.BoxGeometry(1,1,1)
      var material = new THREE.MeshNormalMaterial()
      FX.widget = new THREE.Mesh(geometry, material)
      FX.widget.clickable = true
      FX.widget.effect = FX
      var pos = randNumber()
      FX.widget.position.set(locations[pos].x,locations[pos].y,locations[pos].z)
      FX.widget.flow = function (vector) {
        //flowing away
        var flow = vector.sub(FX.widget.position)
        flow = flow.multiplyScalar(1/magSquared(flow))
        //the next is a radius cut-off
        flow = flow.sub(cutoffFlow(vector))
        return flow
      }
      FX.widget.connectedTo = []
      self.scene.add(FX.widget)
    })

    var geometry = new THREE.SphereGeometry(1,5,2)
    var material = new THREE.MeshNormalMaterial()
    var sourceSink = new THREE.Mesh(geometry,material)
    sourceSink.effect = this.analyser
    sourceSink.sink = true
    sourceSink.clickable = true
    sourceSink.flow = function (vector) {
      //flowing away
      var flow = vector.multiplyScalar(1/magSquared(vector))
    }
    sourceSink.connectedTo = []
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

    getMic(audioCtx)
    .then(function (microphone) {
      microphone.connect(self.analyser)
    })
    .fail(function (err) {
      console.log('err: ', err)
    })


    this.FX = initFX(audioCtx)

  }

  onMouseMove (e) {
    e.preventDefault()

    this.mouse.x = (e.clientX/window.innerWidth)*2-1
    this.mouse.y = -(e.clientY/window.innerHeight)*2+1
  }

  onMouseDown (e) {
    var self = this
    var intersects = this.raycaster.intersectObjects(this.scene.children)
    intersects.forEach(function (i) {
      if (i.object.clickable){
        if (self.clicked) {
          if (i.object.sink){
            console.log('output!')
            self.clicked.effect.connect(audioCtx.destination)
            // particleStream = new particleStream(self.clicked,i.object)
          } else {
            if (self.clicked === i.object){
                self.clicked.effect.disconnect()
            } else {
              self.clicked.effect.connect(i.object.effect)
            }
          }
          self.clicked = null
        } else {
          self.clicked = i.object
        }
      }
    })
  }

  cutoffFlow (vector) {
    var magSquare = magSquared(vector)
    return vector.multiplyScalar(-0.01*magSquare*magSquare)
  }

  magSquared (vector) {
    return vector.x*vector.x+vector.y*vector.y+vector.z*vector.z
  }

  _updateParticles () {
    this.particles.forEach(function (particle) {
      var flow = particle.from.flow.add(particle.to.flow)
      particle.position.addScaledVector(flow,0.1)
      var distanceToSink = magSquared(particle.position.sub(particle.to.position))
      if (distanceToSink<1) {
        if (particle.to.connectedTo.length>0){
          //send particle to next box when it gets close to its destination
          var randNumber = rand(0,particle.to.connectedTo.length)
          particle.to = particle.to.connectedTo[randNumber]
        }
      }
    })
  }

}

export default Environment
