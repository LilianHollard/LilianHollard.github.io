var RunWebglContext = function (vertexShaderText, fragmentShaderText, gl, image) {
	console.log("alo?")
	//
	// Create shaders
	// 
	var vertexShader = gl.createShader(gl.VERTEX_SHADER);
	var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

	gl.shaderSource(vertexShader, vertexShaderText);
	gl.shaderSource(fragmentShader, fragmentShaderText);

	gl.compileShader(vertexShader);
	if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
		console.error('ERROR compiling vertex shader!', gl.getShaderInfoLog(vertexShader));
		return;
	}

	gl.compileShader(fragmentShader);
	if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
		console.error('ERROR compiling fragment shader!', gl.getShaderInfoLog(fragmentShader));
		return;
	}

	var program = gl.createProgram();
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);
	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		console.error('ERROR linking program!', gl.getProgramInfoLog(program));
		return;
	}
	gl.validateProgram(program);
	if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
		console.error('ERROR validating program!', gl.getProgramInfoLog(program));
		return;
	}

    
	//
	// Create buffer 
	//
	function setRectangle(gl, x, y, width, height) {
		var x1 = x;
		var x2 = x + width;
		var y1 = y;
		var y2 = y + height;
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
		   x1, y1,
		   x2, y1,
		   x1, y2,
		   x1, y2,
		   x2, y1,
		   x2, y2,
		]), gl.STATIC_DRAW);
	}
	  
//
	// Create shaders
	// 
	// look up where the vertex data needs to go.
	var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
	var texCoordAttributeLocation = gl.getAttribLocation(program, "a_texCoord");

	// lookup uniforms
	var resolutionLocation = gl.getUniformLocation(program, "u_resolution");
	var imageLocation = gl.getUniformLocation(program, "u_texture");

	// Create a vertex array object (attribute state)
	var vao = gl.createVertexArray();

	// and make it the one we're currently working with
	gl.bindVertexArray(vao);

	// Create a buffer and put a single pixel space rectangle in
	// it (2 triangles)
	var positionBuffer = gl.createBuffer();

	// Turn on the attribute
	gl.enableVertexAttribArray(positionAttributeLocation);

	// Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

	// Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
	var size = 2;          // 2 components per iteration
	var type = gl.FLOAT;   // the data is 32bit floats
	var normalize = false; // don't normalize the data
	var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
	var offset = 0;        // start at the beginning of the buffer
	gl.vertexAttribPointer(
		positionAttributeLocation, size, type, normalize, stride, offset);

	// provide texture coordinates for the rectangle.
	var texCoordBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
		0.0,  0.0,
		1.0,  0.0,
		0.0,  1.0,
		0.0,  1.0,
		1.0,  0.0,
		1.0,  1.0,
	]), gl.STATIC_DRAW);

	// Turn on the attribute
	gl.enableVertexAttribArray(texCoordAttributeLocation);

	// Tell the attribute how to get data out of texCoordBuffer (ARRAY_BUFFER)
	var size = 2;          // 2 components per iteration
	var type = gl.FLOAT;   // the data is 32bit floats
	var normalize = false; // don't normalize the data
	var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
	var offset = 0;        // start at the beginning of the buffer
	gl.vertexAttribPointer(
		texCoordAttributeLocation, size, type, normalize, stride, offset);

	// Create a texture.
	var texture = gl.createTexture();

	// make unit 0 the active texture uint
	// (ie, the unit all other texture commands will affect
	gl.activeTexture(gl.TEXTURE0 + 0);

	// Bind it to texture unit 0' 2D bind point
	gl.bindTexture(gl.TEXTURE_2D, texture);

	// Set the parameters so we don't need mips and so we're not filtering
	// and we don't repeat at the edges
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

	// Upload the image into the texture.
	var mipLevel = 0;               // the largest mip
	var internalFormat = gl.RGBA;   // format we want in the texture
	var srcFormat = gl.RGBA;        // format of data we are supplying
	var srcType = gl.UNSIGNED_BYTE; // type of data we are supplying
	gl.texImage2D(gl.TEXTURE_2D,
				mipLevel,
				internalFormat,
				srcFormat,
				srcType,
				image);


	// Tell WebGL how to convert from clip space to pixels
	//gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

	// Clear the canvas
	gl.clearColor(0.12, 0.75, 0.23, 0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	// Tell it to use our program (pair of shaders)
	gl.useProgram(program);

	// Bind the attribute/buffer set we want.
	gl.bindVertexArray(vao);

	// Pass in the canvas resolution so we can convert from
	// pixels to clipspace in the shader
	gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);

	// Tell the shader to get the texture from texture unit 0
	gl.uniform1i(imageLocation, 0);

	// Bind the position buffer so gl.bufferData that will be called
	// in setRectangle puts data in the position buffer
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

	// Set a rectangle the same size as the image.
	setRectangle(gl, 0, 0, image.width, image.height);


	var primitiveType = gl.TRIANGLES;
	var offset = 0;
	var count = 6;
	const timeLocation = gl.getUniformLocation(program, "time");

	function render(time) {
		
		gl.useProgram(program);
		gl.uniform1f(timeLocation, time * 0.001);  // time in seconds
	
		// draw
		gl.drawArrays(primitiveType, offset, count);
		requestAnimationFrame(render);
	  }
	  requestAnimationFrame(render);

};

