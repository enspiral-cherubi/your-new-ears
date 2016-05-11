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
    this.controls.movementSpeed = 0.1

    var windowResize = new WindowResize(this.renderer, this.camera)

    this.mouse = new THREE.Vector2(0,0)

    this.raycaster = new THREE.Raycaster()
    this.raycaster.setFromCamera(this.mouse,this.camera)
    this.clicked = []

    this.setupAudio()
    this.barkScaleFrequencyData = this.analyser.barkScaleFrequencyData()
    this._makeWidgets()
  }

  render () {
    this.barkScaleFrequencyData = this.analyser.barkScaleFrequencyData()

    //find intersections
    this.camera.lookAt(this.scene.position)
    this.camera.updateMatrixWorld()
    this.raycaster.setFromCamera(this.mouse,this.camera)
    var intersects = this.raycaster.intersectObjects(this.scene.children)
    intersects.forEach(function (i) {
      i.object.rotation.x += .01
      i.object.rotation.y += .01
    })
  //   for ( var i = 0; i < intersects.length; i++ ) {
  //
	// 	intersects[ i ].object.material.color.set( 0xff0000 );
  //
	// }


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
      FX.widget.effect = FX
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

  onMouseMove (e) {
    e.preventDefault()

    this.mouse.x = (e.clientX/window.innerWidth)*2-1
    this.mouse.y = -(e.clientY/window.innerHeight)*2+1
  }

  onMouseDown (e) {

    var intersects = this.raycaster.intersectObjects(this.scene.children)
    intersects.forEach(function (i) {
      console.log(i.object.effect)
    })
  }

  _updateCube () {

  }

}

export default Environment
