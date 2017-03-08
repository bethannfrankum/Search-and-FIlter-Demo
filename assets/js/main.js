    //var url = "http://localhost:3005/posts"
    var url = "server/entries.json"
    var isPosting = false;

    var NUMPAGE = 6;
    var currentPage = 0;

    var allEntries = [];

    $(document).ready(function () {
        $('#btnLoad').on('click', loadPosts);
        $('#btnAdd').on('click', savePost);

        $('#btnLoadMore').on('click', loadMorePosts);

        $('#main').on('click', '.btnLoadBody', loadBody);
        //$('.btnLoadBody').on('click', loadBody);

        $('#btnLoadMore').hide();
        $('.loading').hide();
    });

    function savePost(e) {
        e.preventDefault();
        var postObj = $('#frm').serialize();

        $('.loading').show()
        if (isPosting === false) {
            isPosting = true;
            $.post(url, postObj, function (result) {
                loadPosts();
                isPosting = false;
            });
        }

    }

    function loadPosts() {
        //$('#main').html(loadingHtml);
        $('.loading').show()

        $.get(url, function (result) {
            var templateHtml = $('#entry-template').html();
            var hbs = Handlebars.compile(templateHtml);
            var filteredEntries = filterEntries(result)

            var pagedEntries = pageEntries(filteredEntries);

            var obj = {
                entry: pagedEntries
            };

            allEntries = pagedEntries;

            var html = hbs(obj);

            $('.loading').hide()
            $('#main').append(html);
        });
    }

    function filterEntries(entries) {
        var phrase = $('#search-body').val();
        var category = $('#search-category').val();

        if (phrase === '' && category === '') {
            return entries;
        }


        var filteredEntries = [];

        for (var i = 0; i < entries.length; i++) {
            var entry = entries[i];
            var isMatch = false;

            //search body
            if (phrase !== '' && entry.body.indexOf(phrase) > -1) {
                isMatch = true;
            }

            if (entry.category && entry.category === category) {
                isMatch = true;
            }

            if (isMatch === true) {
                filteredEntries.push(entry);
            }
        }




        return filteredEntries;

    }

    function pageEntries(entries) {
        var pagedEntries = [];

        var start = NUMPAGE * currentPage;
        var end = start + NUMPAGE;
        pagedEntries = entries.slice(start, end);

        var totalEntries = entries.length;

        var pageCount = Math.ceil(totalEntries / NUMPAGE);

        if ((currentPage + 1) >= pageCount) {
            $('#btnLoadMore').hide();
        } else {

            $('#btnLoadMore').show()
        }

        return pagedEntries;

    }

    function loadMorePosts(e) {
        e.preventDefault();
        currentPage++;
        loadPosts();
    }

    /*
        Search and modal functionality
    */

    function loadBody() {
        var entryId = $(this).closest('.panel').data('entryid');

        var entry = searchEntries(entryId);

        //Build our template 
        var fullTemplate = $('#modal-template').html();
        var hbs = Handlebars.compile(fullTemplate);
        var compiledHTML = hbs(entry);

        //Add our compiled Template
        var modal = $('#myModal')
        modal.find('.modal-body').html(compiledHTML);

        //Trigger bootstrap modal;
        modal.modal();

    }

    function searchEntries(id) {
        for (var i = 0; i < allEntries.length; i++) {
            if (allEntries[i].id == id) {
                return allEntries[i];
            }
        }
    }