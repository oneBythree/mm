    $('#listshow a.item').on('click', function(event) {
        $('#listshow a.item').removeClass('active');
        $(this).addClass('active');
        var curele = $(this).nextAll('ul');
        var thisList1 = $(this).parents('.sub1');
        $('.sub1').not(thisList1).slideUp();
        if (curele !== null) {
            if (curele.is(':hidden')) {
                curele.slideDown();
            } else {
                curele.slideUp();
            };
        };
        sessionStorage.removeItem("silderLevel");
        var level = $(this).attr('data-level');
        console.log(level);
        sessionStorage.setItem('silderLevel', level);
    });

    $(document).ready(function() {
        var level = sessionStorage.getItem('silderLevel');
        var thisEl = $("[data-level=" + level + "]");
        $('.sub1').hide();
        $('#list a').removeClass('active');
        thisEl.addClass('active');
        $("[data-level=" + level + "]").parents('.sub1,.sub2').slideDown();
        if (thisEl.next().hasClass('sub2') || thisEl.next().hasClass('sub1')) {
            thisEl.next().slideDown();
        }

       $('body').on('click', '.iframeLink', function() {
            var url = $(this).attr('data-url');
            window.parent.window.frames['iFrame1'].frameElement.src = url;
        })

    })
