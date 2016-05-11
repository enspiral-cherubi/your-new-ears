import THREE from 'three'


class ParticleStream {

  constructor (source,to,texture) {
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



    this.source = source
    this.to = to
  }

  //can take audio input later
  updateParticles () {
      this.particles.geometry.vertices.forEach(  (p) => {
          p.addScaledVector(this.flow(p),0.1)
          if (this.distSquared(p,this.to.position)<1){
            //when it gets to the end, put it back
            p.set(( Math.random() - 1/2 ) + this.source.position.x,
            ( Math.random() - 1/2 ) + this.source.position.y,
            ( Math.random() - 1/2 ) + this.source.position.z)
          }
      }
    )
    this.particles.geometry.verticesNeedUpdate = true
  }

  flow (vector) {
    var flow = new THREE.Vector3()
    flow.copy(vector)
    flow.sub(this.source.position)
    flow.multiplyScalar(1/this.magSquared(flow))
    flow.addScaledVector(this.to.position,4/this.distSquared(this.to.position,vector))
    flow.addScaledVector(vector,-4/this.distSquared(this.to.position,vector))
    return flow
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
