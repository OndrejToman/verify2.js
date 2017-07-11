$(document).ready(function(){

  /*
  Configuration variables
  */
  var debug_mode = true; // Debug mode will write messages to JS console (for example about types of inputs)
  var send_form = true; // After script is finished, decides if POST/GET form or not (if you want only test but dont want to actually send anything)
  var automatic_id = true; // Automatically add IDs to all forms on page (if form already have one, no ID vill be added by this scripr)
  var wrong_input_class_name = "wrong-input"; // Class that will be added to non valid inputs


  /*
  Regular expressions
  */
  var expressions = Array();
  expressions["name"] = /^\D{1,} \D{1,}$/;
  expressions["email"] = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  expressions["phone"] = /^(\+420)?[0-9]{9}$/;
  expressions["date"] = /^\d{1,2}.\d{1,2}.\d{4}$/;
  expressions["text"] = /\D/;
  expressions["number"] = /\d/;

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

    if(automatic_id == true){
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
    Parameters
      -> Value: Value (text) from input
      -> Type: Type of input (phone, name, ...)
    Returns
      -> True: Valid
      -> False: Invalid
    */
    function validuj_input(value, type){
       var key = expressions[type];

       if(key.test(value)){
         return true;
       }else {
         return false;
       }
    }

    $(".form-validate").on('click',function(e){ // Při kliknutí na tlačítko s třídou form-validate
      e.preventDefault();

      /*
      Array, with records about validity of inputs
      */
      var inputs = Array();

      var validni = true;
      /*
      Variable, which defines if form is valid or not
      In the beginning is this variable set to true (valid). If the script discovers non-valid input,
      this variable is changed to false (non-valid) and input will be marked by class (you can change this class in variable wrong_input_class_name)
      */

      var parent_form = $(this).closest('form'); // Select parent form

      var form_object_selector = "form#" + parent_form.attr('id') + " :input"; // Assembled form selector

      var input_iteration = 0; // Iteration for inputs (for purpose of inputs array)

      $(form_object_selector).each(function(){
        var input_objekt = $(this); // Set object

        input_objekt.removeClass(wrong_input_class_name); // Before validation remove wrong input class

        /*
        Variables needed for future work with input
        */
        var value = input_objekt.val(); // Value (text) of an input
        var jmeno = input_objekt.attr('name'); // Name attribute of input
        var druh = input_objekt.data('type'); // Type of input (phone, name, etc.)
        var vyzadovan = false; // Fram start every input is set as non-required
        var slovo = ""; // Pomocná proměnné pro výpis do konzole

        if(input_objekt.prop('required')){ // Check if input is required or not
          vyzadovan = true; // Is required
          slovo = " je ";
        } else {
          vyzadovan = false; // Isn't required
          slovo = " není ";
        }

        if(debug_mode == true){
          console.log("Input " + jmeno + " je druh " + druh + " a" + slovo + "vyžadováno vyplnění.");
        }

        /*
        If input doesn't have data-type set, is automatically valid
        */
        if(!druh){
          inputs[input_iteration] = true;
        }else{

          /*
          Pokud má input nastaveno reqired a není vyplněn, bude se s
          ním počítat jako s nevalidním
          If input is required and empty, no need to validate, it's just invalid
          */
          if(vyzadovan == true && !value){

            if(debug_mode == true){
              console.log("Input " + jmeno + " is empty and required");
            }

            inputs[input_iteration] = false;
            $(this).addClass(wrong_input_class_name);
          }else{
            if(!validuj_input(value, druh)){

              if(debug_mode == true){
                console.log("Input " + jmeno + " isn't valid");
              }

              input_objekt.addClass(wrong_input_class_name);
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

      if(debug_mode == true){
        console.log("----------------");
      }

      if(validni == true){ // Final check, if form have all inputs valid
        if(debug_mode == true){
          console.log('Form with ID ' + parent_form.attr('id') + " is valid");
        }
        if(send_form == true){
          parent_form.submit();
        }
      }else {
        if(debug_mode == true){
          console.log('Form with ID ' + parent_form.attr('id') + " isn't valid");
        }
      }

      if(debug_mode == true){
        console.log("----------------");
      }
    });
});
