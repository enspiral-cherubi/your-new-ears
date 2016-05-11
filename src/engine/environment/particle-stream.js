import THREE from 'three'
import webAudioAnalyser2 from 'web-audio-analyser-2'

class ParticleStream {

  constructor (source,to,texture,context) {
    var particles = 2000

    var geometry = new THREE.Geometry()
    for (var i = 0; i<particles; i++){
      geometry.vertices.push(new THREE.Vector3(( Math.random() - 1/2 ) + source.position.x,
      ( Math.random() - 1/2 ) + source.position.y,
      ( Math.random() - 1/2 ) + source.position.z))
    }

    this.particles = new THREE.Points( geometry )
    this.particles.material.size = 0.1
    // this.particles.material.map = texture


    this.analyser = webAudioAnalyser2({
      context: context,
      fftSize: 2048,
      equalTemperedFreqBinCount: 10
    })

    this.source = source
    this.to = to
    this.connected = false
    this.disconnecting = false
  }

  //can take audio input later
  updateParticles () {
      this.particles.material.size = 0.1*Math.tanh(this.analyser.barkScaleFrequencyData().overallAmplitude/100)+0.1
      this.particles.geometry.vertices.forEach(  (p) => {
          p.addScaledVector(this.flow(p),0.1)
          if (this.distSquared(p,this.to.position)<1){
            //when it gets to the end, put it back
            p.set(( Math.random() - 1/2 ) + this.source.position.x,
            ( Math.random() - 1/2 ) + this.source.position.y,
            ( Math.random() - 1/2 ) + this.source.position.z)


            if (!this.connected) {
              if(this.to.sink){
                this.source.effect.connect(this.analyser)
                this.analyser.connect(this.to.sink)
              } else {
                this.source.effect.connect(this.analyser)
                this.analyser.connect(this.to.effect)
              }
              this.connected = true
            }
          }
      }
    )
    this.particles.geometry.verticesNeedUpdate = true
  }

  flow (vector) {
    var flow = new THREE.Vector3()
    flow.copy(vector)
    if (this.disconnecting){
      flow.multiplyScalar(10/this.magSquared(flow))
      flow.addScaledVector(this.source.position,1/this.distSquared(this.source.position,vector))
      flow.addScaledVector(this.to.position,1/this.distSquared(this.to.position,vector))
    } else {
        flow.sub(this.source.position)
        flow.multiplyScalar(1/this.magSquared(flow))
        flow.addScaledVector(this.to.position,4/this.distSquared(this.to.position,vector))
        flow.addScaledVector(vector,-4/this.distSquared(this.to.position,vector))
    }
    return flow
  }

  disconnect () {
      this.disconnecting = true
  }


  magSquared (vector) {
    return vector.x*vector.x+vector.y*vector.y+vector.z*vector.z
  }

  distSquared (v,w) {
    var diff = new THREE.Vector3()
    diff.copy(v)
    diff.sub(w)
    return this.magSquared(diff)
  }

}

export default ParticleStream
