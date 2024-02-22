  precision highp float;
  uniform vec2 u_resolution;
  uniform float u_time;
  
  vec3 palette(float t){
    vec3 a = vec3(0.5, 0.5, 0.5);
    vec3 b = vec3(0.5, 0.5, 0.5);
    vec3 c = vec3(1.0, 1.0, 1.0);
    vec3 d = vec3(0.263, 0.416, 0.557);
    
    return a + b*cos(1.28318*(c*t+d));
  }
  
  void main() {    
    vec2 uv = (gl_FragCoord.xy * 2.0 - u_resolution) / u_resolution;
    vec2 uv0 = uv;
    vec3 finalColor = vec3(0.0);
    float time = u_time / 3.0;
    for (float i = 0.0; i< 3.0; i++){
      uv = fract(uv*1.2) - 0.5;

      float d = length(uv);
      vec3 col = palette(length(uv0 + time));

      d = sin(d*8. + time)/8.;
      d = abs(d);
      d = 0.02 / d;
      finalColor += col * d;
    }
    gl_FragColor = vec4(finalColor, 1.0);
  }


// next is BLACK HOLE

  precision highp float;
  uniform vec2 u_resolution;
  uniform float u_time;
  
  float map(vec3 p){
    return length(p) - 1.3;
  }
  
  void main(){
    vec2 uv = (gl_FragCoord.xy * 2. - u_resolution.xy) / u_resolution.y;
    
    
    // Initialization
    vec3 ro = vec3(0., 0., -3); // ray origin
    vec3 rd = normalize(vec3(uv, 1.)); // ray direction
    
    vec3 col = vec3(0.); // final pixel color
    
    float t = 0.;   // total distance travelled;
    
    // Raymarching
    for (int i = 0; i < 80; i++){
      vec3 p = ro + rd * t; // position along the ray

      float d = map(p); // current distance to the scene
      t += d; // "march" the ray
      
      col = vec3(i) / 80.;
      col = col * sin(u_time);
      if (d < .0001 || t > 100.) break; 
      //d->early stop if close enough to the object
      //t -> early stop if too far
    }
    
    
    
    gl_FragColor = vec4(col, 1.);
  }