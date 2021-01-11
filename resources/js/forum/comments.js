define([
    'jquery',
], function(
    $
) {
    "use strict";
    const url = window.location.pathname;
    const commentField = document.getElementById('comments');
    const commentErrorField = $('#comment-error');
    let users = [];
    let comments = [];
    let currUser = null;
    const saveButton = document.getElementById("publish-comment");
    let pages = 0;
    let page = 0;
    let pageCount = document.createElement('div');
    let commentCount = 0;
    const pageCounter = document.getElementById('pageCount');
    pageCount.innerText = page + 1;
    pageCounter.appendChild(pageCount)

    function loadComments(page = null) { //getting comment data
        $.ajax({
            url: `${url}/getComments`,
            dataFormat: 'json',
            success: function (data) {
                users = data.user_data;
                comments = data.comments;
                commentCount = data.comments.length;

                if (commentCount <= 10) { //arrows shows and hides depending on comment count
                    $('.forum-arrows').hide();
                } else {
                    $('.forum-arrows').show();
                }

                currUser = data.curr_user;
                comments.sort(function (first,second) { //order comment in desc order
                    return new Date(second.created_at) - new Date(first.created_at);
                });
                commentField.innerText = '';
                commentErrorField.hide();
                if(comments.length > 0) { //if any comment data is gained display it and divide into pages
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
                    commentField.insertAdjacentHTML('beforeend', '<div class="card card-white post">Komentāru nav... :(</div>')
                }
            },
            error: function (err) {
                alert("Error : " + JSON.stringify(err));
            }
        });
    }

    loadComments(); //loading comments on page load

    function validation(commentData) { //validate data before saving
        let message = [];

        if (commentData === '') {
            message.push('Komentāra saturs ir tukšs.')
        }

        if (currUser === null) {
            message.push('Neautorizēts lietotājs nevar pievienot komentāru.')
        }

        return message;
    }

    if (saveButton) {
        saveButton.onclick = () => {
            saveComment();
        };
    }

    function saveComment() {
        const commentData = $('#comment-block').val();
        const id = window.location.pathname.replace('/forum/','');
        const messages = validation(commentData);

        commentErrorField.html(''); //clearing error msgs
        commentErrorField.hide();

        if(messages.length !== 0) { //displaying error msgs if any
            let message = '';

            $.each(messages, function (index, error) {
                message += error + '<br />';
            });
            commentErrorField.html(message);
            commentErrorField.show();
            return;
        }

        $.ajax({ //send comment data to controller
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
                page = 0;
                pageCount.innerText = page + 1;
                commentCount++;
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(JSON.stringify(jqXHR));
                console.log("AJAX error: " + textStatus + ' : ' + errorThrown);
                alert('Error occured look into console logs')
            }
        });
    }

    function updateComment() { //updating comments
        const commentId = (this.id).replace('button-', '');
        const commentField =  $('#comment-edit-data'+commentId);
        const commentData = commentField.val();
        const commentBlock = this.parentNode.parentNode.parentNode.classList[0];
        const messages = validation(commentData);
        const errorCommentField = $('#error-comment-edit');

        errorCommentField.html('');
        errorCommentField.hide();

        if(messages.length !== 0) { //displaying errors if any
            let message = '';

            $.each(messages, function (index, error) {
                message += error + '<br />';
            });
            errorCommentField.html(message);
            errorCommentField.show();
            return;
        }

        $.ajax({ //sending data to controller
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
                loadComments(commentBlock); //reloading data
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(JSON.stringify(jqXHR));
                console.log("AJAX error: " + textStatus + ' : ' + errorThrown);
                alert('Error occured look into console logs')
            }
        });
    }

    function saveCommentPage(commentClass) { //remembering page when delete occur
        const comments = $('#comments').children();

        comments.each(function (i, comment) {
            if (comment.classList.contains(commentClass)) {
                $(`.${ comment.classList[0] }`).show();
            } else {
                $(`.${ comment.classList[0] }`).hide();
            }
        });
    }

    function onClickEditComment() { //load edit data and render fields
        const commentId = this.id;
        const commentBlock = this.parentNode.parentNode.parentNode;
        const editCommentBlock = document.createElement('div');
        const textarea = document.createElement('textarea');
        const button = document.createElement('button');
        const errorMsg = document.createElement('div');

        if (!document.getElementById('button-'+commentId)) {
            textarea.name = 'comment-edit-data'+commentId;
            textarea.id = 'comment-edit-data'+commentId;
            textarea.innerText = commentBlock.children[2].getElementsByTagName('p')[0].innerText;
            button.id = 'button-'+commentId;
            button.onclick = updateComment;
            button.classList.add('btn');
            button.classList.add('btn-success');
            button.innerText = 'Rediģēt';
            errorMsg.classList.add('alert');
            errorMsg.classList.add('alert-danger');
            errorMsg.id = 'error-comment-edit';
            errorMsg.style.display = 'none';
            editCommentBlock.classList.add('comment-edit');
            editCommentBlock.appendChild(errorMsg);
            editCommentBlock.appendChild(textarea);
            editCommentBlock.appendChild(button);
            commentBlock.appendChild(editCommentBlock);
        }
    }

    function onClickDeleteComment() { //delete comment
        let commentId = (this.id).replace('delete', '');

        $.ajax({
            method: "DELETE",
            url: `/comment/${commentId}`,
            dataType: 'html',
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            success: function() {
                loadComments(); //reloading comments
                commentCount--;
                alert('Komentārs tika izdzēsts!')
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(JSON.stringify(jqXHR));
                console.log("AJAX error: " + textStatus + ' : ' + errorThrown);
                alert('Error occured look into console logs')
            }
        });
    }

    function addDeleteFuncOption() { // adding delete functionality to all comments
        let comments = commentField.getElementsByClassName('delete');
        for (let i = 0; i < comments.length; i++) {
            let comment = comments[i];
            comment.onclick = onClickDeleteComment;
        }
    }

    function addEditFuncOption() { // adding edit functionality to all comments
        let comments = commentField.getElementsByClassName('edit');

        for (let i = 0; i < comments.length; i++) {
            let comment = comments[i];
            comment.onclick = onClickEditComment;
        }
    }

    //rendering options to comment
    function addOptions(commentData) {
        if(currUser) {
            if(currUser === commentData.user_id) {
                return (
                    '<div class="nav-item dropdown">\n' +
                    '                    <div class="comment-dropdown dropdown-toggle" id="navbarDropdowns" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">\n' +
                    '                    </div>\n' +
                    '                    <div class="dropdown-menu" aria-labelledby="navbarDropdowns">\n'+
                    '                        <a class="dropdown-item edit" id="'+ commentData.id +'">Rediģēt</a>\n' +
                    '                        <a class="dropdown-item delete" id="delete'+ commentData.id +'">Dzēst</a>\n' +
                    '                    </div>\n' +
                    '                </div>'
                );
            }
        }

        return '';
    }
    //remderomg comment with user and comment data
    function insertComment(commentData) {
        const div = document.createElement('div');
        const options = addOptions(commentData);

        div.innerHTML = ' <div class="card card-white post">\n' + options +
            '                <div class="post-heading">\n' +
            '                    <div class="float-left meta">\n' +
            '                        <div class="title h5">\n' +
            '                            <a href="#"><b>'+ getUserName(commentData.user_id) +'</b></a>\n' +
            '                            komentēja: \n' +
            '                        </div>\n' +
            '                        <h6 class="text-muted time">Pievienots: '+ new Date(commentData.created_at).toISOString().replace(/T/, ' ').replace(/\..+/, '')    +'</h6>\n' +
            '                    </div>\n' +
            '                </div> \n' +
            '                <div class="post-description"> \n' +
            '                    <p>'+ commentData.content +'</p>\n' +
            '\n' +
            '                </div>\n' +
            '            </div>';

        return div;
    }

    function getUserName(userId) { //returns user name
        let returnResult = 'Anonymous';

        users.forEach(user => {
            if (user.id === userId) {
                returnResult = user.name;
            }
        });

        return returnResult;
    }

    function loadAfterSort() { //reload after sort
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
            commentField.insertAdjacentHTML('beforeend', '<div class="card card-white post">Komentāru nav... :(</div>')
        }
    }

    function divideIntoPages() { //dividing comments into pages
        const childNodes = $('#comments').children().length;
        const maxCommentsPerPage = 10;
        let comments = 0;
        pages = Math.ceil(childNodes / maxCommentsPerPage)

        for (let i=0; i < pages; i++) {
            if (i === 0) {
                $('#comments > div').slice(comments, comments+maxCommentsPerPage).addClass(`page${i} comment`).show();
            } else {
                $('#comments > div').slice(comments, comments+maxCommentsPerPage).addClass(`page${i} comment`).hide();
            }
            comments += maxCommentsPerPage;
        }
    }

    $('.next').on('click',function(){ //moving through pages
        if(page < pages - 1) {
            $("#comments > div:visible").hide();
            $('.page' + ++page).show();
            $("html, body").animate({ scrollTop: "500" });
        }
    });

    $('.forum-arrows').on('click', function () { //adding page counter
        pageCount.innerText = page + 1;
    });

    $('.prev').on('click',function() { //moving through pages
        if(page > 0) {
            $("#comments > div:visible").hide();
            $('.page' + --page).show();
            $("html, body").animate({ scrollTop: "500" });
        }
    });

    $('#order-selector').on('change', function () { //sorts comments
       if($('#order-selector').val() === 'newest') {
           comments.sort(function (first,second) {
               return new Date(second.created_at) - new Date(first.created_at);
           });
           loadAfterSort();
       } else {
           comments.sort(function (first,second) {
               return new Date(first.created_at) - new Date(second.created_at);
           });
           loadAfterSort();
       }
    });
});
