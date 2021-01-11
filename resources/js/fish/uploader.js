define([
    'jquery',
], function(
    $
) {
    "use strict";
    const uploadButton = document.getElementById('save-fish');
    const errorContainer = $('#js-errors');
    let formData = null;
    let imageFile = null;

    $('#uploaded-image').change(function () { //if image was uploaded
       formData = new FormData();
       if($(this).prop('files').length > 0) {
           imageFile = $(this).prop('files')[0];
           formData.append('image', imageFile); //adding image data to formData
       }
    });

    function getData() { //read input
        formData.append('name',  $('#name').val());
        formData.append('link', $('#link').val());
    }

    function validation() { //validate input
        let message = [];
        const nameValidator = new RegExp(/^[a-žA-Ž\s]+$/); //name consists of letters and whitespaces only
        const name = $('#name').val();
        const link = $('#link').val();

        if ( name.length < 3 || !nameValidator.test('name')) {
            message.push('Nosaukums satur nelatīniskos simbolus vai burtu skaits ir mazāks par 3.');
        }

        if (link.length < 8) {
            message.push('Saites simbolu skaits ir mazāks par 8.');
        }

       if (imageFile.size > 2147484) { //checking size of image
           message.push('Bildes svars ir lielāks par 2,048 MB.');
       }

       if (!(imageFile.type === 'image/jpeg' //checking type of image
           || imageFile.type === 'image/png'
           || imageFile.type === 'image/jpg'
           || imageFile.type === 'image/gif'
           || imageFile.type === 'image/svg')) {
               message.push('Derīgie bildes formāti - jpeg, png, jpg, gif un svg.');
           }

        return message;
    }

    uploadButton.onclick = () => {
       createFish();
    }

    function createFish() {
        getData();

        const errorMsg = validation();

        errorContainer.html(''); //clear messages

        if(errorMsg.length !== 0) { //display errors if any
            let message = '';

            $.each(errorMsg, function (index, error) {
                message += error + '<br />';
            });
            errorContainer.html(message);
            $('#success').hide();
            return;
        }

        $.ajax({ //saving fish species data
            method: "POST",
            url: `storeFish`,
            dataType: 'html',
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            data: formData,
            processData: false,
            contentType: false,
            success: function (data) {
                alert('Zivs tika saglabāta')
            },
            error: function (err) {
                alert("Error : " + JSON.stringify(err));
            }
        });
    }
});
