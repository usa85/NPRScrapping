var currentURL = window.location.origin;

$(document).ready(function () {
    // Modal ready upon start
    $(".modal").modal();

    // Click function when user clicks on add/view comments
    $(".comments").on("click", function () {
        $("#save").empty();
        $("#comments").empty();
        // Saves the article id
        var thisId = $(this).attr("data-id");

        // Makes an AJAX call for the article
        $.ajax({
            method: "GET",
            url: "/articles/" + thisId
        })
            // Adds the comment information to the page
            .done(function (data) {
                $("#comments").append("<h5 class='notesArticle'>" + data.title + "</h5>");
                $("#comments").append("<input id='titleInput' name='title' placeholder='Add title'>");
                $("#comments").append("<textarea id='bodyInput' name='body' placeholder='Add comment'></textarea>");
                $("#save").append("<button data-id='" + data._id + "' id='saveComment' class='modal-close waves-effect waves-red btn-flat'>Save</button>");
                if (data.notes) {
                    $("#titleInput").val(data.notes.title);
                    $("#bodyInput").val(data.notes.body);
                }
            });
    })

    // Save the article that was clicked
    $(".saveArticle").on("click", function () {
        console.log("save button")
        var articleId = $(this).attr("data-id");
        var articleToSave = $(this).parent().parent().parent();
        $.post({
            url: currentURL + "/save",
            data: {
                articleId: articleId
            }
        })
            .done(function (data) {
                console.log(data);
                articleToSave.remove();
            })
            .fail(function (error) {
                console.log(error);
            })
    })

    // Remove the saved article from the save list
    $(".unsaveArticle").on("click", function () {
        console.log("remove save button")
        var articleId = $(this).attr("data-id");
        var articleToUnsave = $(this).parent().parent().parent();
        $.post({
            url: currentURL + "/unsave",
            data: {
                articleId: articleId
            }
        })
            .done(function (data) {
                console.log(data);
                articleToUnsave.remove();
            })
            .fail(function (error) {
                console.log(error);
            })
    })

    // Hide the article from the main page and bring it to the hide page
    $(".hideArticle").on("click", function () {
        console.log("hide button")
        var articleId = $(this).attr("data-id");
        var articleToHide = $(this).parent().parent().parent();
        $.post({
            url: currentURL + "/hide",
            data: {
                articleId: articleId
            }
        })
            .done(function (data) {
                console.log(data);
                articleToHide.remove();
            })
            .fail(function (error) {
                console.log(error);
            })
    })

    $(".unhideArticle").on("click", function () {
        var articleId = $(this).attr("data-id");
        var articleToUnhide = $(this).parent().parent().parent();
        $.post({
            url: currentURL + "/unhide",
            data: {
                articleId: articleId
            }
        })
            .done(function (data) {
                console.log(data);
                articleToUnhide.remove();
            })
            .fail(function (error) {
                console.log(error);
            })
    })

    // Save comments when clicked
    $(document).on("click", "#saveComment", function () {
        // grabs the id associated with the article from the submit button
        // var thisId = $(this).attr("data-id");
        // // runs a POST request to change the note, using what's entered in the inputs
        // console.log(thisId)
        // $.ajax({
        //     method: "POST",
        //     url: "/articles/" + thisId,
        //     data: {
        //         // captures from title input
        //         title: $("#titleInput").val(),
        //         // takes values from note textarea
        //         body: $("#bodyInput").val()
        //     }
        // })
        //     .done(function (data) {
        //         // Clears comments section
        //         $("#comments").html("Comment stored!");
        //         $("#save").empty();
        //     });
    })
});
