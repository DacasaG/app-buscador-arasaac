function getJSON(url){
    var req = new XMLHttpRequest();
    
    req.open("GET",url,false);
    req.send(null);
    if(req.status == 200){
        return req.responseText; 
    }else{
        return null;
    }         
}

function saveImageto(path, imagen){
        var fs= require('fs');
        var request = require('request');
        request(imagen).on('error', function(err) {
            console.log(err)
        }).pipe(fs.createWriteStream(path));
}

$(document).ready(function()    {
    $('#search').click(function(){
        var termino = $('#searchTxt').val();
        var idioma = $('#language').val();
        var url = "https://api.arasaac.org/api/pictograms/" + idioma + "/search/" + termino;
        var json = JSON.parse(getJSON(url));
        var id = 0;
        var html = "";
        var nombre = "";
        var vector = [];
        var identificador = "";
        
        $('#resultado').html("");
        
        if(json == null){
            html = '<label>No hay resultados para la busqueda: "' + termino + '"</label>';
        }else{
            json.forEach(function(obj){
                vector.push(obj);
                url = '"https://static.arasaac.org/pictograms/' + obj.idPictogram + '_300.png"';
                nombre = obj.keywords[0].keyword;
                html += '<div class="col-4"><img id="' + id + '" src=' + url + ' class="img-thumbnail" name="pictograma"><label>' + nombre + '</label><br/><label>Size:  </label><select class="selectpicker"><option value="300">300</option><option value="500">500</option><option value="2500">2500</option></select><button type="button" id="' + obj.idPictogram + '" name="guardar">Descargar</button></div>';
                if((id+1)%3 == 0){
                    html = '<div class="row">' + html + '</div>'; $('#resultado').append(html); 
                    html="";
                }
                id++;
            });

            html = '<div class="row">' + html + '</div>';
        }
        
        $('#resultado').append(html); html="";
        
        id=0;
        vector.forEach(function(a){
            identificador = "#" + id;
            $(identificador).data("json", a);
            id++;
        });
    });
    
    $('#saveImage').on("change", function(){
        var filePath = this.value;
        
        saveImageto(filePath, $(this).data("img"));
    });
    
    $('body').on('keypress', 'input', function(args) {
        if (args.keyCode == 13) {
            $("#search").click();
            return false;
        }
    });
});



$(document).on('click', '[name=guardar]', function () {
        var id= $(this).attr('id');
        var size = $(this).siblings('select').val();
        var imagen = 'https://static.arasaac.org/pictograms/' + id + '_' + size + '.png'
        
        $('#saveImage').data("img", imagen);
        $('#saveImage').click();
});

$(document).on('click', '[name=pictograma]', function () {
        var id= $(this).attr('id');
        var obj;
        var autor = "";
        var web = "";
        var email = "";
        var palabras = "";
        var url = "";
        var significado = "";
    
        obj = $(this).data("json");
    
        obj.authors.forEach(function(aut){
            autor += aut.name + " ";
            web += aut.url + " ";
            email += aut.email + " ";
        });
    
        obj.keywords.slice(1).forEach(function(word){
            palabras += word.keyword + ", ";
        });
        
        if(obj.keywords[0].meaning != null){
            significado = obj.keywords[0].meaning;
        }
                   
        url = '"https://static.arasaac.org/pictograms/' + obj.idPictogram + '_300.png"';
        var html = '<div class="row" id="infoPage"><div class="col-4"><img id="' + id + '" src=' + url + ' class="img-thumbnail"><label>Tamaño: </label><select class="selectpicker"><option value="300">300</option><option value="500">500</option><option value="2500">2500</option></select><button type="button" id="' + obj.idPictogram + '" name="guardar">Descargar</button></div><div class="col-4"><label>' + obj.keywords[0].keyword + ': ' + significado + '</label><br/><label>Palabras relacionadas: </label><label>' + palabras + '</label></div><div class="col-4"><label>Autor: ' + autor + '</label><br/><label>Web: ' + web + '</label><label></label><br/><label>Email: ' + email + '</label><label></label><br/><label>Licencia: ' + obj.license + '</label></div></div>';
    
        $('#resultado').html(html);
});



