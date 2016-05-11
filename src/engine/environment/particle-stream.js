class ParticleStream {
  constructor (from,to) {

    var geometry = new THREE.BufferGeometry()
		var positions = new Float32Array( particles * 3 )
		var colors = new Float32Array( particles * 3 )
		var sizes = new Float32Array( particles )
		var color = new THREE.Color()
		for ( var i = 0, i3 = 0; i < particles; i ++, i3 += 3 ) {
			positions[ i3 + 0 ] = ( Math.random() * 2 - 1 ) + from.x
			positions[ i3 + 1 ] = ( Math.random() * 2 - 1 ) + from.y
			positions[ i3 + 2 ] = ( Math.random() * 2 - 1 ) + from.z
			color.setHSL( i / particles, 1.0, 0.5 )
			colors[ i3 + 0 ] = color.r
			colors[ i3 + 1 ] = color.g
			colors[ i3 + 2 ] = color.b
			sizes[ i ] = 20;
		}
		geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) )
		geometry.addAttribute( 'customColor', new THREE.BufferAttribute( colors, 3 ) )
		geometry.addAttribute( 'size', new THREE.BufferAttribute( sizes, 1 ) )
		self.particles = new THREE.Points( geometry, shaderMaterial )

  }

  //can take audio input later
  updateParticles () {

  }

}

export default ParticleStream
