
function shippingPage(mainID) {
    var screen = mainID;
    var initialized = false;
    var subtot = 0;
    var shipping = 0;
    var tax = 0;
    var total = 0;

    loadContacts();

    return {
        init: function () {
            if (initialized) {
                return;
            }

            $(screen).find('textarea').keyup(function (evt) {
                if ($(evt.target).siblings('.textCount')) {
                    var characters = $(evt.target).val().length;
                    $(evt.target).siblings('.textCount').text(characters + ' characters');

                }
            });

            // prevent form onsubmit form blanking out the page
            $(screen).find('form').submit(
               function (evt) {
                   evt.preventDefault();
               }.bind(this)
           );

            
            //click event to handle the deleteAll button click
            $(screen).find("a.deleteAll").click(
                function (evt) {
                    //stops the default action of an element from happening
                    //evt.preventDefault();
                    localStorage.clear();
                    $(screen).find('table tbody').remove();
                    //refresh the page after table is deleted
                    //https://www.w3schools.com/jsref/met_loc_reload.asp
                    location.reload();
                }
             );
            //click event to handle the delete (single row) button click
            $(screen).find("a.delete").click(
                function (evt) {
                    //stops the default action of an element from happening
                    //evt.preventDefault();
                    deleteContact(evt);
                    //refresh the page after a row is deleted
                    //https://www.w3schools.com/jsref/met_loc_reload.asp
                    location.reload();
                }
            );

            //click event to handle the submit button click
            $(screen).find('form input[type="submit"]').click(
                 function (evt) {
                    // evt.preventDefault();
                     //stops the default action of an element from happening
                     //evt.preventDefault();
                     //check validity of the entered data before storing it
                     if ($(evt.target).parents('form')[0].checkValidity()) {
                         saveContact();
                         //refresh page after a new shoppingCart is submitted
                         //https://www.w3schools.com/jsref/met_loc_reload.asp
                         location.reload();
                     }
                     
                 }
            );

         

           

            //adds a * for required fields
            $(':input[required]').siblings('label').append($('<span>').text('*').addClass('requiredMarker'));

            //Custom validation for the Name field 
            //Name.OnInput checks the validity when the textarea element is changed 
            var Name = document.getElementById('Name')
            Name.oninput = function (e) {
                e.target.setCustomValidity("");
            };

            //Checks to see if the value in the textarea element is valid and if not provides the custom message
            Name.oninvalid = function (e) {
                e.target.setCustomValidity("");
                if (e.target.validity.valid == false) {
                    if (e.target.value.length == 0) {
                        e.target.setCustomValidity("Name is required.");
                    } else if (e.target.value.length < 5) {
                        e.target.setCustomValidity("Name must be at least 5 characters.");
                    }
                }
           };

            //Custom validation for the ItemID field 
            //itemid.OnInput checks the validity when the textarea element is changed 
            var itemid = document.getElementById('ItemID')
            itemid.oninput = function (e) {
                e.target.setCustomValidity("");
            };
            //Checks to see if the value in the textarea element is valid and if not provides the custom message
           itemid.oninvalid = function (e) {
               e.target.setCustomValidity("");
               if (e.target.validity.valid == false) {
                   if (e.target.value.length == 0) {
                       e.target.setCustomValidity("Item ID is Requied");
                   } else if (e.target.value.length < 10000000 || e.target.value.length > 99999999 ) {
                       e.target.setCustomValidity("Item ID must be between 9999999 and 100000000");
                   }
               }
           };

            //Custom validation for the Description field 
            //description.OnInput checks the validity when the textarea element is changed 
           var description = document.getElementById('Description')
           description.oninput = function (e) {
               e.target.setCustomValidity("");
           };
            //Checks to see if the value in the textarea element is valid and if not provides the custom message
           description.oninvalid = function (e) {
               e.target.setCustomValidity("");
               if (e.target.validity.valid == false) {
                   if (e.target.value.length == 0) {
                       e.target.setCustomValidity("Description is Requied");
                   } 
               }
           };

            //Custom validation for the quantity field 
            //quantity.OnInput checks the validity when the textarea element is changed 
           var quantity = document.getElementById('Quantity')
           quantity.oninput = function (e) {
               e.target.setCustomValidity("");
           };
            //Checks to see if the value in the textarea element is valid and if not provides the custom message
           quantity.oninvalid = function (e) {
               e.target.setCustomValidity("");
               if (e.target.validity.valid == false) {
                   if (e.target.value.length == 0) {
                       e.target.setCustomValidity("Quantity is Requied");
                   } else if (e.target.value < 1)  {
                       e.target.setCustomValidity("Quantity must be greater than 0");
                   }
               }
           };

            //Custom validation for the unitprice field 
            //unitprice.OnInput checks the validity when the textarea element is changed 
           var unitprice = document.getElementById('UnitPrice')
           unitprice.oninput = function (e) {
               e.target.setCustomValidity("");
           };

            //Checks to see if the value in the textarea element is valid and if not provides the custom message
           unitprice.oninvalid = function (e) {
               e.target.setCustomValidity("");
               if (e.target.validity.valid == false) {
                   if (e.target.value.length == 0) {
                       e.target.setCustomValidity("Unit Price is Required");
                   }
                   else if (e.target.value < .01) {
                       e.target.setCustomValidity("Unit Price must be .01 or greater");
                   }
               } 
               
           };
       


            initialized = true;
        }

    }

    //this function produces an object containing the entered input form values and returns the result
    function serializeForm() {
        var inputFields = $(screen).find('form :input');
        var result = {};
        $.each(inputFields, function (index, value) {
            if ($(value).attr('name')) {
                result[$(value).attr('name')] = $(value).val();
            }
        });
        return result;
    }

    //this function loads any existing shoppingCarts
    function loadContacts() {
        //store the shoppingCarts from the local storage into a variable
        var contactsStored = localStorage.getItem('shoppingCarts');
        //if theres any shoppingCarts stored, fill the table with that data
        if (contactsStored) {
            shoppingCarts = JSON.parse(contactsStored);
            $.each(shoppingCarts, function (index, shoppingCart) {
                //build the html and row string variables containing the new table row
                var row = $('<tr>');
                var html = '<td>' + shoppingCart.ItemID + '</td>' +
                           '<td>' + shoppingCart.Name + '</td>' +
                           '<td>' + shoppingCart.Description + '</td>' +
                           '<td>' + shoppingCart.Quantity + '</td>' +
                           '<td>' + shoppingCart.UnitPrice + '</td>' +
                           '<td>' + shoppingCart.itemCost + '</td>' +
                           //creates a new button to delete only tha
                           '<td><a class="delete" href="#">delete</a></td>';

                row.data().shoppingId = shoppingCart.id;
                row.append(html);
                $(screen).find('table tbody').append(row);
                //provides the calculation for subtot, shipping, tax and total
                subtot = parseFloat(subtot) + parseFloat(shoppingCart.itemCost);
                shipping = parseFloat(subtot)*.085 + parseFloat(shipping);
                tax = parseFloat(tax) + parseFloat(subtot) * .11;
                total = tax + shipping + subtot;
              
               
            });
            //files in the subtotal,shipping,tax and total fields
            $("#Subtotal").val(subtot.toFixed(2));
            $("#Shipping").val(shipping.toFixed(2));
            $("#Tax").val(tax.toFixed(2));
            $("#Total").val(total.toFixed(2));

        }
    }

    //this function retrieves all shoppingCarts and stores into an array
    function store(shoppingCart) {
        //get shoppingCarts currently in the local storage and store in a variable
        var contactsStored = localStorage.getItem('shoppingCarts');
        //create the shoppingCarts array
        var shoppingCarts = [];
        //populate the shoppingCarts array
        if (contactsStored) {
            shoppingCarts = JSON.parse(contactsStored);
        }
        //push a new shoppingCart onto the end of the shoppingCarts array
        shoppingCarts.push(shoppingCart);
        //stores all shoppingCarts in local storage
        localStorage.setItem('shoppingCarts', JSON.stringify(shoppingCarts));
    }
    //this function saves the entered shoppingCart data and appends it to the table below the form
    function saveContact() {
        //initialize a variable that creates an object of the entered data from the form by the serializeForm() function call
        var shoppingCart = serializeForm();
        shoppingCart.id = $.now();
        //build the html and row string variables containing the new table row
        var row = $('<tr>');
        var html = '<td>' + shoppingCart.ItemID + '</td>' +
                           '<td>' + shoppingCart.Name + '</td>' +
                           '<td>' + shoppingCart.Description + '</td>' +
                           '<td>' + shoppingCart.Quantity + '</td>' +
                           '<td>' + shoppingCart.UnitPrice + '</td>' +
                           '<td>' + shoppingCart.itemCost + '</td>' +
                           //creates a new button to delete only tha
                           '<td><a class="delete" href="#">delete</a></td>';
        row.data().shoppingId = shoppingCart.id;
        row.append(html);
        //store the saved data in the local storage
        store(shoppingCart);
        //append the data to the stored shoppingCart table
        $(screen).find('table tbody').append(row);
        $(screen).find('form :input[name]').val('');
    }

    //this function deletes a single shoppingCart from a row
    function deleteContact(evt) {
        //creates an object of the selected shoppingCart to delete
        var shoppingId = $(evt.target).parents('tr').data().shoppingId;
        //retrieve all shoppingCarts from the local storage
        var shoppingCarts = JSON.parse(localStorage.getItem('shoppingCarts'));
        //filter out the the selected shoppingCart to delete
        var newContacts = shoppingCarts.filter(function (c) {
            return c.id != shoppingId;
        });
        //save the remaining shoppingCarts in the local storage
        localStorage.setItem('shoppingCarts', JSON.stringify(newContacts));
        //remove the table row of that selected shoppingCart data
        $(evt.target).parents('tr').remove();
    }

}