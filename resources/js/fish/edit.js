define([
    'jquery',
], function(
    $
) {
    "use strict";
    const uploadButton = document.getElementById('save-fish');
    const changeButton = document.getElementById('change-image');
    const changeContent = document.getElementById('change');
    const imageUploader = document.getElementById('ImageUploader');
    const errorContainer = $('#js-errors');
    let  formData = new FormData();
    let changeImage = false;
    let fishId = window.location.pathname.replace('/fish/','').replace('/edit','');
    const path = window.location.origin;
    let imageFile = null;

    $('#uploaded-image').change(function () {
        if($(this).prop('files').length > 0) {
            imageFile = $(this).prop('files')[0];
            formData.append('image', imageFile);
        }
    });

    function getData() {
        formData.append('name',  $('#name').val());
        formData.append('link', $('#link').val());
        formData.append('isImageChanged', changeImage);
        formData.append('_method', 'PUT')
    }

    function validation() {
        let message = [];
        const nameValidator = new RegExp(/^[a-žA-Ž\s]+$/);
        const name = $('#name').val();
        const link = $('#link').val();

        if ( name.length < 3 || !nameValidator.test('name')) {
            message.push('Nosaukums satur nelatīniskos simbolus vai burtu skaits ir mazāks par 3.');
        }

        if (link.length < 8) {
            message.push('Saites simbolu skaits ir mazāks par 8.');
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
            url: `${path}/fish/${fishId}`,
            dataType: 'html',
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            data: formData,
            processData: false,
            contentType: false,
            success: function (data) {
                alert('Zivs tika atjaunota')
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
