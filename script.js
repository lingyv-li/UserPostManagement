/**
 * Fake data
 * @returns {[*,*]} An array of data.
 */
function getData() {
    return [
        {
            title: "Aenean iaculis in dui sit",
            img: "img/banner-1.jpg",
            content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sed euismod est, eget molestie nisi.\
                Curabitur vel mi non magna venenatis bibendum sed ac leo. Donec convallis eros quis nibh rhoncus auctor.\
                Vestibulum volutpat imperdiet mollis. Etiam varius ex quis ante convallis mollis. Maecenas at felis non\
                justo lacinia venenatis. Praesent augue ante, gravida a rutrum sit amet, semper sit amet ante. Curabitur\
                efficitur purus sem, eget mollis lectus venenatis vel. Sed eu nibh hendrerit, blandit ipsum ut, pulvinar\
                arcu. Mauris sem arcu, vulputate vitae porta egestas, sagittis venenatis justo. Nam ac feugiat erat.\
                Nulla ut imperdiet nisi, a aliquet.",
            publishedAt: new Date(2017, 3, 14),
            publisher: "Larry"
        },
        {
            title: "Pellentesque ac cursus purus",
            img: "img/banner-2.jpg",
            content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sed euismod est, eget molestie nisi.\
                Curabitur vel mi non magna venenatis bibendum sed ac leo. Donec convallis eros quis nibh rhoncus auctor.\
                Vestibulum volutpat imperdiet mollis. Etiam varius ex quis ante convallis mollis. Maecenas at felis non\
                justo lacinia venenatis. Praesent augue ante, gravida a rutrum sit amet, semper sit amet ante. Curabitur\
                efficitur purus sem, eget mollis lectus venenatis vel. Sed eu nibh hendrerit, blandit ipsum ut, pulvinar\
                arcu. Mauris sem arcu, vulputate vitae porta egestas, sagittis venenatis justo. Nam ac feugiat erat.\
                Nulla ut imperdiet nisi, a aliquet.",
            publishedAt: new Date(2017, 3, 14),
            publisher: "Larry"
        }
    ];
}

String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

/**
 * Replace all occurrence in form "{{x}}" where x is an attribute of data
 * @param template Template string
 * @param data
 * @returns {String} The replaced string
 */
function templateReplacer(template, data) {
    for (var name in data) {
        if (data.hasOwnProperty(name)) {
            if (data[name] instanceof Date) {
                template = template.replaceAll("{{" + name + "}}", data[name].toDateString());
            } else if (typeof data[name] === "string" && data[name].length > 100) {
                template = template.replaceAll("{{" + name + "}}", data[name].substring(0, 100) + "<a name='expand' data-item-id='{{i}}'>...</a>");
            } else {
                template = template.replaceAll("{{" + name + "}}", data[name]);
            }
        }
    }
    return template;
}

/**
 * Index page
 */
ListPage = {
    _itemTemplate: null,
    _data: null,
    data: function () {
        if (this._data === null) {
            this._data = getData();
        }
        return this._data;
    },
    getItemTemplate: function () {
        if (this._itemTemplate === null) {
            this._itemTemplate = document.getElementById("item-template").innerHTML;
        }
        return this._itemTemplate;
    },
    init: function () {
        this.populateItems();
        var closeButtons = document.getElementsByClassName("close");
        for (var i = 0; i < closeButtons.length; i++) {
            closeButtons[i].onclick = this.dismissDeleteConfirm;
        }
    },
    populateItems: function () {
        var data = this.data();
        var listParent = document.getElementById("item-list");
        for (var i = 0; i < data.length; i++) {
            var str = templateReplacer(this.getItemTemplate(), data[i]);
            str = str.replaceAll("{{i}}", i.toString());
            var newItem = document.createElement("div");
            newItem.className = "item";
            newItem.id = "item-" + i.toString();
            newItem.innerHTML = str;
            newItem = listParent.appendChild(newItem);
            var buttons = newItem.getElementsByTagName("button");
            buttons["delete"].onclick = this.onDeleteClick;
        }
    },
    reloadItems: function () {
        document.getElementById("item-list").innerHTML = "";
        this.populateItems();
    },
    onDeleteClick: function (e) {
        var modal = document.getElementById("delete-confirm");
        modal.classList.remove("hidden");
        var id = e.srcElement.dataset["itemId"];
        document.getElementById("confirm").onclick = (function () {
            ListPage.confirmDelete(id)
        });
        document.getElementById("modal-post-name").textContent = ListPage.data()[id].title;

    },
    dismissDeleteConfirm: function () {
        document.getElementById("delete-confirm").classList.add("hidden");
    },
    confirmDelete: function (id) {
        console.log("delete confirmed");
        ListPage.dismissDeleteConfirm();
        ListPage.data().splice(id, 1);
        ListPage.reloadItems();
    }
};


/**
 * Edit and add page
 */
EditPage = {
    _data: null,
    data: function () {
        if (this._data === null) {
            this._data = getData();
        }
        return this._data;
    },
    init: function () {
        document.getElementById("post-form").onsubmit = this.onSubmit;
        this.inflateForm(this.getId());
    },
    inflateForm: function (id) {
        if (id === null) {
            return;
        }
        var data = this.data()[id];
        var form = document.forms["post-form"];
        form["title"].value = data.title;
        form["content"].value = data.content;
        form["img"].value = data.img;
        form["publisher"].value = data.publisher;
    },
    /**
     * Get id from query string
     * @returns {Number} The id. Null if id is not found.
     */
    getId: function () {
        // Modified based on this stack overflow thread: http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
        var url = window.location.href;
        var regex = new RegExp("[?&]" + "id" + "(=([^&#]*)|&|#|$)");
        var results = regex.exec(url);
        if (!results) return null;
        return parseInt(decodeURIComponent(results[2].replace(/\+/g, " ")));
    },
    onSubmit: function () {
        var form = document.forms["post-form"];
        var data = {};
        data["title"] = form["title"].value;
        data["content"] = form["content"].value;
        data["img"] = form["img"].value;
        data["publisher"] = form["publisher"].value;
        data["publishedAt"] = new Date();
        alert(JSON.stringify(data));
        window.location.href = "index.html";
        return false;
    }
};