jQuery(document).ready( function($){
    console.log("dom ready") ;
    
    // référence à des éléments du DOM (commencent par $ pour être identifiables facilement)
    var $form   = $("form");
    var $statut = $("form #statut");
    
    // écouteur sur la soumission du formulaire
    $form.on("submit", function(e){
        // récupération des éléments du formulaire    
        var formData = getFormData();
        
        // si ok, on appelle le script PHP d'envoi du mail
        if( formData !== false )
        {
            $statut.html("envoi en cours ...") ;
            
            $.ajax({
                url     : "send_mail.php",
                type    : "POST",
                data    : formData,
                success : function(data)
                {
                    var result = $.parseJSON( data );
                    if( !result.error ){
                        $statut.html("message envoyé !") ;
                        clearForm() ;
                    }else{
                        $statut.html(result.error) ;
                    }
                },
                error   : function(data)
                {
                    $statut.html(data) ;
                }
            }) ;
        }
        else
        {
            $statut.html("Erreur : il manque des données ou le mail est incorrect") ;
        }
        
        // on retourne false pour bloquer le comportement par défaut du formulaire HTML 
        return false ;
    }) ;


    /** 
    * controle et retourne les elements du formulaire
    *
    * @return Object si ok, false sinon
    *
    */
    function getFormData(){
        var nom     = $form.find("#name").val() ;
        var mail    = $form.find("#email").val() ;
        var message = $form.find("#message").val() ;
        
        var returnData = false ;
        
        if( nom && mail && message ){
            if( checkMail(mail) ){
                returnData = { nom : nom, mail : mail, message : message };  
            }
        }
        
        return returnData;
    };
    
    /**
    * remet le form à vide
    */
    function clearForm(){
        $form.find("input, textarea").val('') ;
    };
    
    /**
    * contrôle la validité de l'adresse mail
    */
    function checkMail( mail ){
		var reg = new RegExp('^[a-z0-9]+([_|\.|-]{1}[a-z0-9]+)*@[a-z0-9]+([_|\.|-]{1}[a-z0-9]+)*[\.]{1}[a-z]{2,6}$', 'i');
        var valide = false ;
		if(reg.test(mail))
		{
			valide = true;
		}
        return valide;
	};
    
}) ;