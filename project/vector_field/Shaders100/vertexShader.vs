#version 100
//Inspiré des cours de : webgl2 fundamental https://webgl2fundamentals.org/
//https://webgl2fundamentals.org/webgl/lessons/webgl-fundamentals.html

attribute vec2 vertPosition;
uniform vec2 u_resolution;

void main(){
    vec2 zeroToOne = vertPosition / u_resolution;

    // convert from 0->1 to 0->2
    vec2 zeroToTwo = zeroToOne * 2.0;

    // convert from 0->2 to -1->+1 (clipspace)
    vec2 clipSpace = zeroToTwo - 1.0;
    gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
}