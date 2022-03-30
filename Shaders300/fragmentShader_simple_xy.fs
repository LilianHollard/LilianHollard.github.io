#version 300 es

precision highp float;

out vec4 fragColor;
uniform float time;

const float density = 35.0;

// Center pixel of the tile
vec2 arrowTileCenterCoord(vec2 pos) {
	return (floor(pos / density) + 0.5) * density;
}

float lineArrow(vec2 p, vec2 p1, vec2 p2) {
	/*
	Modifiables
	*/
	float arrow_head_size = 0.3;
	float distance_arrowLine = 4.;

	//line
	vec2 v = p2 - p1;
	vec2 w = p - p1;
	float d = clamp(dot(w,v) / dot(v,v), 0., 1.);

	//arrow head
	v = v * d;
	if(d > arrow_head_size) d = 0.; //arrow head size
	
	return distance(w, v) - d* distance_arrowLine; //distance btw arrowhead size and line
}


float arrow(vec2 p, vec2 vector_field) {
	// Relative to the center
	p -= arrowTileCenterCoord(p);

	return lineArrow(p, vector_field, -vector_field);
}



// Vector field : créer sa propre fonction.
vec2 field(vec2 pos) {
	//return vec2(1.0, 0.0);
	//return vec2(cos(pos.x * 0.01 + pos.y * 0.01) + cos(pos.y * 0.005 + time), 2.0 * cos(pos.y * 0.01  + time * 0.3)) * 0.5;
	return vec2(cos(pos.x * 0.01 + pos.y * 0.01+ time), sin(pos.y * 0.01 * cos(pos.x *0.01+ time)));
	//return vec2(cos(pos.x * 0.017 + cos(pos.y * 0.004 + time * 0.1) * 6.28 * 4.0) * 3.0, cos(6.28 * cos(pos.y * 0.01 + pos.x * 0.007)));
}


void main() {
	
	float arrow_dist = arrow(gl_FragCoord.xy,
							// size of the arrow inside the tile (modify the float value at the end to increase or decrease the size)
							field(arrowTileCenterCoord(gl_FragCoord.xy)) * density * 0.35);
	
	// clamp the arrow to keep it inside the tile
	vec4 arrow_col = vec4(0, 0, 0, clamp(arrow_dist, 0.0, 1.0)); 
	
	//background color
	vec4 field_col = vec4(field(gl_FragCoord.xy) * 0.5 + 0.5, 0.5, 1.0);
	
	fragColor = mix(-arrow_col, field_col, arrow_col.a);
}

