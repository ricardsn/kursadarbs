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
    let  formData = new FormData();
    let changeImage = false;
    let fishId = window.location.pathname.replace('/fish/','').replace('/edit','');
    const path = window.location.origin;

    $('#uploaded-image').change(function () {
        if($(this).prop('files').length > 0) {
            const file = $(this).prop('files')[0];
            formData.append('image',file);
        }
    });

    function getData() {
        formData.append('name',  $('#name').val());
        formData.append('link', $('#link').val());
        formData.append('isImageChanged', changeImage);
        formData.append('_method', 'PUT')
    }

    uploadButton.onclick = () => {
        getData();
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
