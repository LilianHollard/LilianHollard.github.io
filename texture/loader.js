/*
Permet l'utilisation de fichier externe pour développer les shaders 
sans passer par l'utilisation de serveur quelconques (python, wamp, etc...).

Le code peut ainsi se lancer depuis un navigateur tel que firefox sans installation ou lancement préalable.

(Attention: génère une erreur d'analyse XML pour mauvaise syntaxe dans la console du navigateur).
*/
var loadImage = function (url, callback) {
	var image = new Image();
	image.onload = function () {
		callback(null, image);
	};
	image.src = url;
};

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

var load_Shader = function (gl, vertexPath, fragmentPath){

    if (!gl) {
        console.log('WebGL 2 not supported, falling back on webgl 1');
        gl = canvas.getContext('webgl');
        if(!gl){
            alert('Your browser does not support Webgl');
        }else{
            //\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\//
            /*Webgl 1 shader loading*/
            loadTextResource(vertexPath, function (vsErr, vsText) {
                if (vsErr) {
                    alert('Fatal error getting vertex shader (see console)');
                    console.error(vsErr);
                } else {
                    loadTextResource(fragmentPath, function (fsErr, fsText) {
                        if (fsErr) {
                            alert('Fatal error getting fragment shader (see console)');
                            console.error(fsErr);
                        }else{
                            loadImage('water.jpg', function (imgErr, img) {
                                if (imgErr) {
                                    alert('Fatal error getting Water texture (see console)');
                                    console.error(imgErr);
                                } else { 
                                    RunWebglContext(vsText, fsText, gl, img);
                                }
                            });
                        }
                    });
                } 
            });
        }
    }else{
        //\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\//
        /*Webgl 2 shader loading*/
        loadTextResource(vertexPath, function (vsErr, vsText) {
            if (vsErr) {
                alert('Fatal error getting vertex shader (see console)');
                console.error(vsErr);
            } else {
                loadTextResource(fragmentPath, function (fsErr, fsText) {
                    if (fsErr) {
                        alert('Fatal error getting fragment shader (see console)');
                        console.error(fsErr);
                    }else{
                        loadImage('water.jpg', function (imgErr, img) {
                            if (imgErr) {
                                alert('Fatal error getting Susan Water (see console)');
                                console.error(imgErr);
                            } else { 
                                RunWebglContext(vsText, fsText, gl, img);
                            }
                        });
                    }
                });
            } 
        });

    }
}