var RunWebglContext = function (vertexShaderText, fragmentShaderText, gl, image) {
	

	gl.clearColor(0.75, 0.85, 0.8, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

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
	  

	var positionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);


	setRectangle(gl, 0, 0, gl.canvas.width, gl.canvas.height);
	var VAO = gl.createVertexArray();
	gl.bindVertexArray(VAO);

    
	var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
	var resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");
	
	var size = 2;          // 2 components per iteration
	var type = gl.FLOAT;   // the data is 32bit floats
	var normalize = false; // don't normalize the data
	var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
	var offset = 0;        // start at the beginning of the buffer


	gl.vertexAttribPointer(
		positionAttribLocation, // Attribute location
		2, // Number of elements per attribute
		gl.FLOAT, // Type of elements
		gl.FALSE,
		5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
		0 // Offset from the beginning of a single vertex to this attribute
	);

	gl.enableVertexAttribArray(positionAttribLocation);
    

	gl.vertexAttribPointer(positionAttribLocation, size, type, normalize, stride, offset);
	
	//
	// Main render loop
	//
	gl.useProgram(program);

	gl.bindVertexArray(VAO);

	gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);
	gl.uniform2f(gl.getUniformLocation(program, "fragCoord"), gl.canvas.width, gl.canvas.height);


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
