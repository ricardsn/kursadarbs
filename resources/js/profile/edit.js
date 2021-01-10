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

    $('#uploaded-image').change(function () {
        if($(this).prop('files').length > 0) {
            imageFile = $(this).prop('files')[0];
            formData.append('image',imageFile);
        }
    });

    $.ajax({
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

    function getData() {
        formData.append('name',  $('#name').val());
        formData.append('email', $('#email').val());
        formData.append('isImageChanged', changeImage);
        formData.append('_method', 'PUT')
    }

    function validation() {
        let message = [];
        const emailValidator = new RegExp('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$');

        if ($.inArray($('#email').val(), takenEmails) === 1) {
            message.push('Norādītā e-pasta adrese jau ir izmantota.');
        }

        if (!emailValidator.test($('#email').val())) {
            message.push('E-pasts ir nepareiza formāta.');
        }

        if ( $('#name').val().length < 3) {
            message.push('Vārds ir īsāks par 3 simboliem.')
        }

        if(changeImage) {
            if(imageFile.size > 2147484) {
                message.push('Bildes svars ir lielāks par 2,048 MB.')
            }

            if (!(imageFile.type === 'image/jpeg'
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
        getData();
        const errorMsg = validation();

        errorContainer.html('');

        if(errorMsg.length !== 0) {
            let message = '';

            $.each(errorMsg, function (index, error) {
                message += error + '<br />';
            });
            errorContainer.html(message);
            $('#success').hide();
            return;
        }

        $.ajax({
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
