function displayMessages(data) {
    //console.log("-------------DISPLAY MESSAGE---------------");
    $('#messages').html('');
    for (var type in data) {
        //console.log(type+": "+data[type]);
        data[type].forEach(function (message) {
            $('<div class="alert alert-' + 
            (type == 'error' ? 'danger' : type) + 
            '">' + message + '</div>').appendTo($('#messages'));
        });
    }
}

$(".productRow td:last-child a:last-child").on('click' ,function (event) {
    event.preventDefault();
    var $this = $(this);
    $.get($(this).attr('href'))
    .done(function (data) {
        $this.parents('tr').fadeOut(350, function () {
            $(this).remove();
        });
        displayMessages(data);
        //alert(data);
    })
    .fail(function (error) {
        displayMessages(error.responseJSON);
    });
    
})

$('a[href="/user/upload"]').on('click', function (event) {
    event.preventDefault();
    var $modal = $('#newModal').modal({show: false});
    var modalBody = $modal.find('.modal-body');
        modalBody.css('overflow','auto');
        modalBody.css('max-height','none');
        modalBody.css('padding','15px');
    $modal.find('.modal-body').load('/user/upload', function () {
        $modal.find('button[type="submit"]').on('click', function (event) {
            event.preventDefault();
            $.post('/user/upload', $modal.find('form').serializeArray())
            .done(function (data) {
                //console.log("/user/upload .post sikeres");
                displayMessages(data);
                $('body #mainContainer > #bodyContainer').load('/user/list', function () {
                    $modal.modal('hide');
                });
            })
            .fail(function (error) {
                $modal.modal('hide');
                displayMessages(error.responseJSON);
            });
        });
        $modal.find('button[type="reset"]').on('click', function (event) {
            event.preventDefault();
            $modal.modal('hide');
        });
        //megjel. mert eddig csak func. lettek megadva
        $modal.modal('show');
    });
});