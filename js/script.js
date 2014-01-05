jQuery(function () {
    'use strict';

    var paginFilter = new PaginFilter(window.mockupData);
    paginFilter.searchFields = ['firstName', 'lastName'];

    // log each changes of any observable (debug):
    // 
    // _(paginFilter).each(function (item, name) {
    //     if (item.subscribe) {
    //         item.subscribe(function (value) {
    //             console.log(name + ':', value);
    //         });
    //     }
    // });

    ko.applyBindings(paginFilter);
    $(document.body).removeClass('not-ready');
});
