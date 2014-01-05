(function () {
    'use strict';

    if (!('contains' in String.prototype)) {
        String.prototype.contains = function String_contains(str, startIndex) {
            return -1 !== String.prototype.indexOf.call(this, str, startIndex);
        };
    }

    window.PaginFilter = PaginFilter;

    function PaginFilter(data) {
        var self = this;

        // Filter feature:
        this.filterInput = ko.observable("");

        this.data = ko.observableArray(data);

        this.filteredData = ko.computed(function () {
            var data = this.data();
            var filter = this.filterInput().toUpperCase();

            if (filter.length < 1) {
                return data;
            }

            return _(data).filter(function (datum) {
                return _(this.filterSearchFields(datum)).some(function (field) {
                    return field.toString().toUpperCase().contains(filter);
                });
            }, this);
        }, this);

        // Pagination feature:
        this.page = ko.observable(1);
        this.maxRows = ko.observable(5);
        this.nMaxRows = ko.computed(function () {
            // Provide the maxRows' value parsed as a Number
            return +this.maxRows();
        }, this);

        this.nbPages = ko.computed(function () {
            return Math.ceil(this.filteredData().length / this.nMaxRows());
        }, this);

        this.nbPages.subscribe(function (nbPages) {
            if (this.page() > this.nbPages()) {
                if (this.nbPages() === 0) {
                    this.page(1);
                } else {
                    this.page(this.nbPages());
                }
            }
        }, this);

        this.currentPageData = ko.computed(function () {
            var maxRows = this.nMaxRows();
            var firstIndex = (this.page() - 1) * maxRows;
            var lastIndex = firstIndex + maxRows;
            return this.filteredData().slice(firstIndex, lastIndex);
        }, this);

        // Autosuggest feature
        this.datalistFeed = ko.computed(function () {
            var feed = [];

            _(this.filterSearchFields(this.data())).each(function (datum) {
                Array.prototype.push.apply(feed, _(datum).values());
            });

            return _(feed).uniq();
        }, this);

        this.enableAutosuggest = ko.observable(false);

        this.datalistSource = ko.computed(function () {
            return this.enableAutosuggest() ? 'datalist-feed' : null;
        }, this);
    }

    PaginFilter.prototype.filterSearchFields = function PaginFilter_filterSearchFields(data) {
        var searchFields = this.searchFields;
        if (!searchFields) {
            return data;
        }

        return _(data).filter(function (value, key) {
            return _(searchFields).contains(key);
        });
    };
}());
