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
    const saveButton = document.getElementById("publish-comment");
    let pages = 0;
    let page = 0;
    const commentActionUrl = window.location.origin;

    function loadComments(page = null) {
        $.ajax({
            url: `${url}/getComments`,
            dataFormat: 'json',
            success: function (data) {
                users = data.user_data;
                comments = data.comments;
                comments.sort(function (first,second) {
                    return new Date(second.created_at) - new Date(first.created_at);
                });
                commentField.innerText = '';
                if(comments.length > 0) {
                    comments.forEach(comment => {
                        commentField.appendChild(insertComment(comment))
                    });
                    divideIntoPages();
                    addEditFuncOption();
                    addDeleteFuncOption();
                    if (page) {
                        saveCommentPage(page)
                    }
                } else {
                    //commentField.insertAdjacentHTML('beforeend', '<div class="card card-white post">Komentāru nav... :(</div>')
                }
            },
            error: function (err) {
                alert("Error : " + JSON.stringify(err));
            }
        });
    }

    loadComments();

    saveButton.onclick = () => {
        const commentData = $('#comment-block').val();
        const id = window.location.pathname.replace('/forum/','');

        $.ajax({
            method: "POST",
            url: "/comment/store",
            dataType: 'html',
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            data: {
                commentData: commentData,
                reservoirId: id
            },
            success: function() {
                loadComments();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(JSON.stringify(jqXHR));
                console.log("AJAX error: " + textStatus + ' : ' + errorThrown);
                alert('Error occured look into console logs')
            }
        });
    };

    function updateComment() {
        const commentId = (this.id).replace('button-', '');
        const commentData = $('#comment-edit-data'+commentId).val();
        const commentBlock = this.parentNode.parentNode.parentNode.classList[0];

        $.ajax({
            method: "PATCH",
            url: `/comment/${commentId}`,
            dataType: 'html',
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            data: {
                commentData: commentData
            },
            success: function() {
                loadComments(commentBlock);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(JSON.stringify(jqXHR));
                console.log("AJAX error: " + textStatus + ' : ' + errorThrown);
                alert('Error occured look into console logs')
            }
        });
    }

    function saveCommentPage(commentClass) {
        const comments = $('#comments').children();

        comments.each(function (i, comment) {
            if (comment.classList.contains(commentClass)) {
                $(`.${ comment.classList[0] }`).show();
            } else {
                $(`.${ comment.classList[0] }`).hide();
            }
        });
    }

    function onClickEditComment() {
        const commentId = this.id;
        const commentBlock = this.parentNode.parentNode.parentNode;
        const editCommentBlock = document.createElement('div');
        const textarea = document.createElement('textarea');
        const button = document.createElement('button');
        if (!document.getElementById('button-'+commentId)) {
            textarea.name = 'comment-edit-data'+commentId;
            textarea.id = 'comment-edit-data'+commentId;
            textarea.innerText = commentBlock.children[2].getElementsByTagName('p')[0].innerText;
            button.id = 'button-'+commentId;
            button.onclick = updateComment;
            button.classList.add('btn');
            button.classList.add('btn-success');
            button.innerText = 'Rediģēt';
            editCommentBlock.appendChild(textarea);
            editCommentBlock.appendChild(button);
            commentBlock.appendChild(editCommentBlock);
        }
    }

    function onClickDeleteComment() {
        let commentId = (this.id).replace('delete', '');

        $.ajax({
            method: "DELETE",
            url: `/comment/${commentId}`,
            dataType: 'html',
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            success: function() {
                loadComments();
                alert('Komentārs tika izdzēsts!')
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(JSON.stringify(jqXHR));
                console.log("AJAX error: " + textStatus + ' : ' + errorThrown);
                alert('Error occured look into console logs')
            }
        });
    }

    function addDeleteFuncOption() {
        let comments = commentField.getElementsByClassName('delete');
        for (let i = 0; i < comments.length; i++) {
            let comment = comments[i];
            comment.onclick = onClickDeleteComment;
        }
    }

    function addEditFuncOption() {
        let comments = commentField.getElementsByClassName('edit');

        for (let i = 0; i < comments.length; i++) {
            let comment = comments[i];
            comment.onclick = onClickEditComment;
        }
    }

    function insertComment(commentData) {
        const div = document.createElement('div');
        const options = '<div class="nav-item dropdown">\n' +
            '                    <div class="comment-dropdown dropdown-toggle" id="navbarDropdowns" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">\n' +
            '                    </div>\n' +
            '                    <div class="dropdown-menu" aria-labelledby="navbarDropdowns">\n'+
            '                        <a class="dropdown-item edit" id="'+ commentData.id +'">Rediģēt</a>\n' +
            '                        <a class="dropdown-item delete" id="delete'+ commentData.id +'">Dzēst</a>\n' +
            '                    </div>\n' +
            '                </div>';

        div.innerHTML = ' <div class="card card-white post">\n' + options +
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
        return div;
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

    function divideIntoPages() {
        const childNodes = $('#comments').children().length;
        const maxCommentsPerPage = 10;
        let comments = 0;
        pages = Math.ceil(childNodes / maxCommentsPerPage)

        for (let i=0; i < pages; i++) {
            if (i === 0) {
                $('#comments > div').slice(comments, comments+maxCommentsPerPage).addClass(`page${i}`).show();
            } else {
                $('#comments > div').slice(comments, comments+maxCommentsPerPage).addClass(`page${i}`).hide();
            }
            comments += maxCommentsPerPage;
        }
    }

    $('.next').on('click',function(){
        if(page < pages - 1) {
            $("#comments > div:visible").hide();
            $('.page' + ++page).show();
        }
    });

    $('.prev').on('click',function(){
        if(page > 0) {
            $("#comments > div:visible").hide();
            $('.page' + --page).show();
        }
    });
});
