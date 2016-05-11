import THREE from 'three'

function loadParticleTexture () {
  //make promise
  var promise = new Promise((resolve,reject) => {
    var loader = new THREE.TextureLoader()
    var texture = new THREE.TextureLoader().load('/src/engine/environment/images/particle.png',
            (texture) => {
              resolve(texture)
            },
          null,
        () => {
          reject()
        })

  })
  return promise
}

export default loadParticleTexture
