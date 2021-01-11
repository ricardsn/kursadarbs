define([
    'jquery',
], function(
    $
) {
    "use strict";
    const uploadButton = document.getElementById('save-user');
    const changeButton = document.getElementById('change-image');
    const changeContent = document.getElementById('change');
    const imageUploader = document.getElementById('ImageUploader');
    const errorContainer = $('#js-errors');
    let takenEmails = null;
    let formData = new FormData();
    let changeImage = false;
    let imageFile = null;

    $('#uploaded-image').change(function () { //if image is uploaded adds it to formData
        if($(this).prop('files').length > 0) {
            imageFile = $(this).prop('files')[0];
            formData.append('image',imageFile);
        }
    });

    $.ajax({ //retrieving emails that are already taken
        method: "GET",
        url: `/profile/getEmails`,
        dataType: 'html',
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        success: function (data) {
           takenEmails = JSON.parse(data);
        },
        error: function (err) {
            alert("Error : " + JSON.stringify(err));
        }
    });

    function getData() { //getting all inputed data
        formData.append('name',  $('#name').val());
        formData.append('email', $('#email').val());
        formData.append('isImageChanged', changeImage); //if image change was requested
        formData.append('_method', 'PUT')
    }

    function validation() { //validating edit data
        let message = [];
        const emailValidator = new RegExp('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$'); //email check

        if ($.inArray($('#email').val(), takenEmails) === 1) { //checks if email is not already used
            message.push('Norādītā e-pasta adrese jau ir izmantota.');
        }

        if (!emailValidator.test($('#email').val())) { //validate email
            message.push('E-pasts ir nepareiza formāta.');
        }

        if ( $('#name').val().length < 3) {
            message.push('Vārds ir īsāks par 3 simboliem.')
        }

        if(changeImage) {
            if(imageFile.size > 2147484) { //checking if size is not bigger than 2,048MB
                message.push('Bildes svars ir lielāks par 2,048 MB.')
            }

            if (!(imageFile.type === 'image/jpeg' //checking image format
                || imageFile.type === 'image/png'
                || imageFile.type === 'image/jpg'
                || imageFile.type === 'image/gif'
                || imageFile.type === 'image/svg')) {
                message.push('Derīgie bildes formāti - jpeg, png, jpg, gif un svg.')
            }
        }

        return message;
    }

    uploadButton.onclick = () => {
       updateProfile();
    }

    function updateProfile() {
        getData(); //reading all data from inputs
        const errorMsg = validation();

        errorContainer.html(''); //clearing all error msg

        if(errorMsg.length !== 0) { //display errors if any
            let message = '';

            $.each(errorMsg, function (index, error) {
                message += error + '<br />';
            });
            errorContainer.html(message);
            $('#success').hide();
            return;
        }

        $.ajax({ //posting data to user controller
            method: "POST",
            url: `saveEditProfile`,
            dataType: 'html',
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            data: formData,
            processData: false,
            contentType: false,
            success: function (data) {
                $('#success').show();
            },
            error: function (err) {
                alert("Error : " + JSON.stringify(err));
            }
        });
    }

    changeButton.onclick = () => {
        changeContent.style.display = 'none';
        imageUploader.style.display = 'block';
        changeImage = true;
    }
});
