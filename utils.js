/*
Permet l'utilisation de fichier externe pour développer les shaders 
sans passer par l'utilisation de serveur quelconques (python, wamp, etc...).

Le code peut ainsi se lancer depuis un navigateur tel que firefox sans installation ou lancement préalable.

(Attention: génère une erreur d'analyse XML pour mauvaise syntaxe dans la console du navigateur).
*/


var loadTextResource = function (url, callback) {
	var request = new XMLHttpRequest();
	request.open('GET', url + '?=' + Math.random(), true);
	request.onload = function () {
		if (request.status < 200 || request.status > 299) {
			callback('Error: HTTP Status ' + request.status + ' on resource ' + url);
		} else {
			callback(null, request.responseText);
		}
	};
	request.send();
};

var load_Shader = function (gl, fragmentPath){
    if (!gl) {
        console.log('WebGL 2 not supported, falling back on webgl 1');
        gl = canvas.getContext('webgl');
        if(!gl){
            alert('Your browser does not support Webgl');
        }else{
            //\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\//
            /*Webgl 1 shader loading*/
            loadTextResource('Shaders100/vertexShader.vs', function (vsErr, vsText) {
                if (vsErr) {
                    alert('Fatal error getting vertex shader (see console)');
                    console.error(vsErr);
                } else {
                    loadTextResource(fragmentPath, function (fsErr, fsText) {
                        if (fsErr) {
                            alert('Fatal error getting fragment shader (see console)');
                            console.error(fsErr);
                        }else{
                            RunWebglContext(vsText, fsText, gl);
                        }
                    });
                } 
            });
        }
    }else{
        //\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\//
        /*Webgl 2 shader loading*/
        loadTextResource('Shaders300/vertexShader.vs', function (vsErr, vsText) {
            if (vsErr) {
                alert('Fatal error getting vertex shader (see console)');
                console.error(vsErr);
            } else {
                loadTextResource(fragmentPath, function (fsErr, fsText) {
                    if (fsErr) {
                        alert('Fatal error getting fragment shader (see console)');
                        console.error(fsErr);
                    }else{
                        RunWebglContext(vsText, fsText, gl);
                    }
                });
            } 
        });

    }
}

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
    var canvas = document.getElementById('vector_surface');
    canvas.width = 1200;
    canvas.height = 600;
    var gl = canvas.getContext('webgl2'); 	
    load_Shader(gl, "Shaders300/fragmentShader.fs");

    var canvas = document.getElementById('vector_surface_simple');
    canvas.width = 1200;
    canvas.height = 600;
    var gl2 = canvas.getContext('webgl2');
    load_Shader(gl2, "Shaders300/fragmentShader_simple.fs");

    var canvas = document.getElementById('vector_surface_xy');
    canvas.width = 1200;
    canvas.height = 600;
    var gl2 = canvas.getContext('webgl2');
    load_Shader(gl2, "Shaders300/fragmentShader_simple_xy.fs");
    // In & out sont utilisé dans les shaders, nous avons besoin de webgl2 pour la version 3.00 de glsl es

}
