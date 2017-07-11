$(document).ready(function(){

  /*
  Configuration variables
  */
  var debug_mode = false; // Debug mode will write messages to JS console (for example about types of inputs)
  var send_form = true; // After script is finished, decides if POST/GET form or not (if you want only test but dont want to actually send anything)
  var add_id_to_all_forms = true; // Automatically add IDs to all forms on page (if form already have one, no ID vill be added by this scripr)
  var wrong_input_class_name = "wrong-input"; // Class that will be added to non valid forms


  /*
  Regular expressions
  */
  var regex_phone = /^(\+420)?[0-9]{9}$/;


  /*
    Function, that finds all <form> tags in document and adds ID to each
    If <form> already have ID, this ID stays unchanged
    */
    function add_id_to_all_forms(){
      var iteration = 1; // Iteration of forms
      var id_text = ""; // Auxilary variable

      $("form").each(function(){
        id_text = "form_" + iteration; // Variable with prepared ID
        if(!$(this).attr('id')){ // If form doesn't have ID already...
          $(this).attr('id',id_text); // Add automatically generated ID
          iteration++;
        }
      });
    }

    if(add_id_to_all_forms == true){
      add_id_to_all_forms();
    }

    /*
    ------ Rules for validation: ------

    Available rules:
    -------------------------------------
    Name (rule) - (example)
    -------------------------------------
    telefon (čísla, +, mezery) - (+123 123 456 789)
    jmeno (velká + malá písmena, mezery) - (Jan Někdo Něco)
    email (text, tečka, čísla @ text . text) - (nekdo.neco23@domana.com)
    datum (2 čísla <= 31 . 2 čísla <= 12 . 4 čísla <= aktualní rok) - (13.10.1856)
    text (nekontrolování)
    .... možné další
    */

    /*
    Method for input validation
    Returns
      -> True: Valid
      -> False: Invalid
    */
    function validuj_input(value, type){
      var key = "";
      if(type == "telefon"){
        upraveny_string = value.replace(/\s+/g, ''); // Pro zjednodušení výrazů nahradíme případné mezery v tel. čísle

        if(debug_mode == true){
          console.log('Upravené číslo je: ' + upraveny_string);
        }
        key = regex_phone;

        if(key.test(upraveny_string)) {
          return true;
        }else {
          return false;
        }
      }else if (type == "jmeno") {
        key = /^\D{1,} \D{1,}$/;

        if(key.test(value)) {
          return true;
        }else {
          return false;
        }
      }else if (type == "email") {
        key = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

        if(key.test(value)) {
          return true;
        }else {
          return false;
        }
      }else if (type == "datum") {
        key = /^\d{1,2}.\d{1,2}.\d{4}$/;

        if(key.test(value)) {
          return true;
        }else {
          return false;
        }
      }else if (type == "text") {
        return true;
      }else if (type == "soubor") {
        // Musí být nahrán soubor
      }else if (type == "checkbox") {
        // Checkbox
      }else {
        // Není vyplněno nebo má neznámý typ, vracíme false
        return false;
      }
    }

    $(".form-validate").on('click',function(e){ // Při kliknutí na tlačítko s třídou form-validate
      e.preventDefault();

      /*
      Pole, které obsahuje správnost jednotlivých inputů
      */
      var inputs = Array();

      var validni = true;
      /*
      Proměnná, který definuje, zda je formulář validní
      Formulář je na začátku nastaven na true (validní). Pokud se během kontroly objeví chyba,
      je nastaven na false (nevalidní) a označí se input, který chybu vyvolal.
      */

      var parent_form = $(this).closest('form'); // Vybereme rodičovský formlulář

      var form_object_selector = "form#" + parent_form.attr('id') + " :input"; // Sestavíme selektor pro výběr inputů formuláře

      var input_iteration = 0; // Nastavení čísla pro průchod všemi inputy a následného zanesení do pole inputs

      $(form_object_selector).each(function(){
        var input_objekt = $(this); // Nastavení objektu

        input_objekt.removeClass(wrong_input_class_name); // Před validací odstraníme classu wrong input ze všech inputů ve formuláři

        /*
        Proměnné potřebné pro práci s inputem
        */
        var value = input_objekt.val(); // Hodnota (obsah) inputu
        var jmeno = input_objekt.attr('name'); // Zjištění jména inputu
        var druh = input_objekt.data('typ'); // Zjištění o jaký druh inputu se jedná
        var vyzadovan = false; // Zjištění, zda input musí být vyplněn (defaultně nastaveno na false -> není vyžadován)
        var slovo = ""; // Pomocná proměnné pro výpis do konzole

        if(input_objekt.prop('required')){ // Zjištěné, jestli má u sebe input atribut requiered
          vyzadovan = true; // Má u sebe napsáno reqired
          slovo = " je ";
        } else {
          vyzadovan = false; // Nemá u sebe napsáno reqired
          slovo = " není ";
        }
        /*
        Debugovací výpis jednotlivých položek formuláře (druh a jestli jsou requiered)
        */
        if(debug_mode == true){
          console.log("Input " + jmeno + " je druh " + druh + " a" + slovo + "vyžadováno vyplnění.");
        }

        /*
        Pokud input nemá nastavený druh, bude se považovat za validní
        */
        if(!druh){

          inputs[input_iteration] = true;

        }else{

          /*
          Pokud má input nastaveno reqired a není vyplněn, bude se s
          ním počítat jako s nevalidním
          */
          if(vyzadovan == true && !value){

            if(debug_mode == true){
              console.log("Chyba při kontrole. Input " + jmeno + " není vyplněn");
            }

            inputs[input_iteration] = false;
            $(this).addClass('wrong-input');
          }else{
            if(!validuj_input(value, druh)){

              if(debug_mode == true){
                console.log("Chyba při kontrole. Input " + jmeno + " neprošel validací");
              }

              input_objekt.addClass('wrong-input');
              inputs[input_iteration] = false;
            }else{
              inputs[input_iteration] = true;
            }
          }
        }
        input_iteration++;
      });

      for(var i = 0; i <= inputs.length; i++){
        if(inputs[i] == false){
          validni = false;
          break;
        }
      }

      if(validni == true){ // Zjištění, zda je formulář validní
        if(debug_mode == true){
          console.log('Formulář ' + parent_form.attr('id') + " je validní a lze jej odeslat.");
        }
        if(send_form == true){
          parent_form.submit();
        }
      }else {
        if(debug_mode == true){
          console.log('Formulář ' + parent_form.attr('id') + " není validní.");
        }
      }
    });
});
