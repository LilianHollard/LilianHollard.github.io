/*
Shaders loader
*/
var InitDemo = function () {
    //WEBGL CONTEXT
    /*
    New: Webgl1 Support
        - le projet se basant uniquement sur l'utilisation de shader, il existe 2 version permettant ainsi d'avoir la version 3.00 glsl es et 1.00
        - La différence varie entre l'utilisation de in & out / varying & attribute / gl_FragCoord ...
    */
    
    var canvas = document.getElementById('vector_surface_texture');
    //canvas.width = 1200;
    //canvas.height = 600;
    var gl = canvas.getContext('webgl2');
    load_Shader(gl, "Shaders300/vertexShader_texture.vs", "Shaders300/fragmentShader_texture.fs");
    // In & out sont utilisé dans les shaders, nous avons besoin de webgl2 pour la version 3.00 de glsl es

}


