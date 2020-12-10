define([
    'jquery',
], function(
    $
) {
    "use strict";
    const url = window.location.pathname;
    const commentField = document.getElementById('comments');
    let users = [];
    let comments = [];

    $.ajax({
        url: `${url}/getComments`,
        dataFormat: 'json',
        success: function (data) {
           users = data.user_data;
           comments = data.comments;
           if(comments) {
               comments.forEach(comment => {
                   commentField.insertAdjacentHTML('beforeend', insertComment(comment));
               });
           } else {
               commentField.insertAdjacentHTML('beforeend', '<div>Komentāru nav... :(</div>')
           }
        },
        error: function (err) {
            alert("Error : " + JSON.stringify(err));
        }
    });

    function insertComment(commentData) {
        const element = ' <div class="card card-white post">\n' +
            '                <div class="post-heading">\n' +
            '                    <div class="float-left meta">\n' +
            '                        <div class="title h5">\n' +
            '                            <a href="#"><b>'+ getUserName(commentData.user_id) +'</b></a>\n' +
            '                            komentēja: \n' +
            '                        </div>\n' +
            '                        <h6 class="text-muted time">Pievienots: '+ commentData.created_at +'</h6>\n' +
            '                    </div>\n' +
            '                </div> \n' +
            '                <div class="post-description"> \n' +
            '                    <p>'+ commentData.content +'</p>\n' +
            '\n' +
            '                </div>\n' +
            '            </div>';

        return element;
    }

    function getUserName(userId) {
        let returnResult = 'Anonymous';

        users.forEach(user => {
            if (user.id === userId) {
                returnResult = user.name;
            }
        });

        return returnResult;
    }
});
