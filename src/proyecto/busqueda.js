function getJSON(url){
    var req = new XMLHttpRequest();
    
    req.open("GET", url, false);
    req.send(null);
    
    if(req.status == 200){
        return req.responseText; 
    }else{
        return null;
    }         
}

function saveImageto(path, imagen){
        var fs = require('fs');
        var request = require('request');
		var res = request(imagen);
		
		res.on('error', function(err) {
            console.log(err);
			$("#errorModal").modal();
        });
		res.on('response', function(response) {
			if(response.headers['content-type'] == 'image/png'){
				res.pipe(fs.createWriteStream(path));
				$("#downloadModal").modal();
			}
			else{
				$("#errorModal").modal();
			}
		});
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
            html = '<span class="col-12">No hay resultados para la búsqueda: "' + termino + '"</span>';
        }else{
            json.forEach(function(obj){
                vector.push(obj);
                url = '"https://static.arasaac.org/pictograms/' + obj.idPictogram + '_300.png"';
                nombre = obj.keywords[0].keyword;
                
                html += '<div class="shownPicto col-4 col-sm-3 col-lg-2"><img id="' + id + '" src=' + url + ' class="img-thumbnail btn btn-outline-info" name="pictograma"><span>' + nombre + '</span><br/><form ><span>Size:  </span><select class="form-control-sm selectpicker btn-outline-info mb-2"><option value="300">300</option><option value="500">500</option><option value="2500">2500</option></select></form><button type="button" idPicto="' + obj.idPictogram + '" name="guardar" picto="' + nombre + '" class="btn btn-sm btn-outline-info mb-2"><i class="fa fa-save"></i> Download</button></div>';
                
                id++;
            });

            html = '<div class="row">' + html + '</div>';
        }
        
        $('#resultado').append(html);
        
        id=0;
        vector.forEach(function(aux){
            identificador = "#" + id;
            $(identificador).data("json", aux);
            id++;
        });
        
        $('#volver').click();
    });
    
    $('#volver').click(function(){
        $('#infoPage').hide();
        $('#resultado').css('display', 'flex');
    });
    
    $('#saveImage').on("change", function(){
        var filePath = this.value;
        $('#saveImage').val("");
        
        saveImageto(filePath, $(this).data("img"));
    });
    
    $('body').on('keypress', 'input', function(args) {
        if (args.keyCode == 13) {
            $('#search').click();
            return false;
        }
    });
    
    $('a').on('click', function(e){
        var open = require("open");
        
        e.preventDefault();
        
        open(this.href);
    });
    
    $('.modal').on('shown.bs.modal', function(event) {
        $(this).find('.btn').focus();
    });
});

$(document).on('click', '[name=guardar]', function () {
        var id= $(this).attr('idPicto');
        var size = $(this).siblings('form').children('select').val();
        var name = $(this).attr('picto');
        var imagen = 'https://static.arasaac.org/pictograms/' + id + '_' + size + '.png';
        
        $('#saveImage').attr("nwsaveas", name);
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
        var significado = "";
        var url = "";
    
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
                   
        url = 'https://static.arasaac.org/pictograms/' + obj.idPictogram + '_300.png';
        
        $('#wikiImg').attr('name', id);
        $('#wikiImg').attr('src', url);
        $('#wikiSave').attr('idPicto', obj.idPictogram);
        $('#wikiSave').attr('picto', obj.keywords[0].keyword);
        $('#wikiPicto').html(obj.keywords[0].keyword + ': ');
        $('#wikiMeaning').html(significado);
        $('#wikiWords').html(palabras);
        $('#wikiAuthor').html(autor);
        $('#wikiWeb').html(web);
        $('#wikiWeb').attr('href', web);
        $('#wikiEmail').html(email);
        $('#wikiLicense').html(obj.license);
        $('#resultado').hide();
        $('#infoPage').css('display', 'flex');
});