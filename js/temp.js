
precision highp float;
uniform vec2 u_resolution;
uniform float u_time;

vec3 colRed = vec3(0.77, 0.35, 0.42);
vec3 colSand = vec3(0.93, 0.82, 0.59);
vec3 colTurqoise = vec3(0.20, 0.93, 0.78);

// Conversions
float deg2rad(float d) {
  // Converts degrees to radians (pi = 3.14159265358979)
  return d*0.01745329251; // radians = degrees*(pi/180);
}
float rad2deg(float r) {
  // Converts radians to degrees (pi = 3.14159265358979)
  return r*57.2957795131; //degrees = radians*(180/pi);
}

// Returns whether a point is in a triangle 
// Code from https://blackpawn.com/texts/pointinpoly/#:~:text=A%20common%20way%20to%20check,triangle%2C%20otherwise%20it%20is%20not.
bool pointInTriangle(vec2 A, vec2 B, vec2 C, vec2 P) {

  // Compute vectors        
  vec2 v0 = C - A;
  vec2 v1 = B - A;
  vec2 v2 = P - A;

  // Compute dot products
  float dot00 = dot(v0, v0);
  float dot01 = dot(v0, v1);
  float dot02 = dot(v0, v2);
  float dot11 = dot(v1, v1);
  float dot12 = dot(v1, v2);

  // Compute barycentric coordinates
  float invDenom = 1.0 / (dot00 * dot11 - dot01 * dot01);
  float u = (dot11 * dot02 - dot01 * dot12) * invDenom;
  float v = (dot00 * dot12 - dot01 * dot02) * invDenom;

  // Check if point is in triangle
  return (u >= 0.0) && (v >= 0.0) && (u + v < 1.0);
}

vec3 lendir(float len, float dir){
	float dirR = deg2rad(dir);
	return vec3(cos(dirR)*len, sin(dirR)*len);
}

vec3 drawTriangle(vec3 pixelColour, vec2 pixelPos, vec2 p1, vec2 p2, vec3 p3, vec3 triangleColour, float alpha){
	if (pointInTriangle(p1,p2,p3,pixelPos)){
	  pixelColour = mix(pixelColour, triangleColour, alpha);
	}
	return pixelColour;
}

vec3 drawLine(vec3 pixelColour, vec3 pixelPos, vec2 p1, vec2 p2, float width, vec3 lineColour, float alpha){
	float dir = pointDirection(p1, p2);
	vec2 r1 = p1+lendir(width, dir-90.0);
	vec2 r2 = p2+lendir(width, dir-90.0);
	vec2 r3 = p2+lendir(width, dir+90.0);
	vec2 r4 = p1+lendir(width, dir+90.0);

	pixelColour = drawTriangle(pixelColour, pixelPos, r1, r2, r3, lineColour, alpha);
	pixelColour = drawTriangle(pixelColour, pixelPos, r1, r3, r4, lineColour, alpha);

	return pixelColour;
}

void main(){
// Set canvas colour
vec3 pixelColour = colRed;

// ------------------------ Draw the background (basically loads of random skewed lines).

float offset = 0.48;

// BLUE STRIPE
// Meta for stripe
float width = u_resolution.x*0.31;
float posX  = mod(u_resolution.x*(0.6+offset)- u_time*400.0,u_resolution.x*2.0)-u_resolution.x*0.5;

// Line coordinates
vec2 p1 = vec2(posX,u_resolution.y*1.5); // Top
vec2 p2 = vec2(posX-u_resolution.x*0.1,0.0-u_resolution.y*0.5); // Bottom

// Draw line
pixelColour = drawLine(pixelColour,gl_fragCoord,p1,p2,width,colTurqoise,1.0);


// SAND STRIPE
// Meta for stripe
width = u_resolution.x*0.31;
posX  = mod(u_resolution.x*(1.2+offset)- u_time*400.0,u_resolution.x*2.0)-u_resolution.x*0.5;

// Line coordinates
p1 = vec2(posX,u_resolution.y*1.5); // Top
p2 = vec2(posX-u_resolution.x*0.1,0.0-u_resolution.y*0.5); // Bottom

// Draw line
gl_FragColor = drawLine(pixelColour,fragCoord,p1,p2,width,colSand,1.0);


}