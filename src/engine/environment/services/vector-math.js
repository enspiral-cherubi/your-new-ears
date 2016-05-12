import THREE from 'three'

module.exports = {
  magSquared: function (vector) {
    return vector.x*vector.x+vector.y*vector.y+vector.z*vector.z
  },

  distSquared: function (v,w) {
    var diff = new THREE.Vector3()
    diff.copy(v)
    diff.sub(w)
    return this.magSquared(diff)
  }
}
