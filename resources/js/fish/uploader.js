define([
    'jquery',
], function(
    $
) {
    "use strict";
    const uploadButton = document.getElementById('save-fish');
    let formData = null;

    $('#uploaded-image').change(function () {
        formData = new FormData();
       if($(this).prop('files').length > 0) {
           const file = $(this).prop('files')[0];
           formData.append('image',file);
       }
    });

    function getData() {
        formData.append('name',  $('#name').val());
        formData.append('link', $('#link').val());
    }

    uploadButton.onclick = () => {
        getData();
        $.ajax({
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
