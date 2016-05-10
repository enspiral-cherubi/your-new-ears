import THREE from 'three'
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


class Environment {

  constructor () {
    this.scene = new THREE.Scene()

    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.01, 1000)
    this.camera.position.z = 10


    this.renderer = new THREE.WebGLRenderer({alpha: true, canvas: $('#three-canvas')[0]})
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.setClearColor(0xffffff, 1)

    this.controls = new THREE.FlyControls(this.camera, this.renderer.domElement)

    var windowResize = new WindowResize(this.renderer, this.camera)

    this.setupAudio()
    this.barkScaleFrequencyData = this.analyser.barkScaleFrequencyData()
    this._makeWidgets()
  }

  render () {
    this.barkScaleFrequencyData = this.analyser.barkScaleFrequencyData()
    // this._updateCube()
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
      var pos = randNumber()
      FX.widget.position.set(locations[pos].x,locations[pos].y,locations[pos].z)
      self.scene.add(FX.widget)
    })
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

    this.analyser.connect(this.FX.phaser)
    this.FX.phaser.connect(audioCtx.destination)

  }

  _updateCube () {
    this.cube.rotation.x += 0.1
		this.cube.rotation.y += 0.1
  }

}

export default Environment
