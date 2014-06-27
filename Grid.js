var StringBuilder = function () {
    this.stringArray = [];
    this.append = function (str) {
        this.stringArray.push(str);
    }
    this.clear = function () {
        this.stringArray.length = 0;
    }
    this.toString = function () {
        return this.stringArray.join("");
    }
}

var Grid = function (para) {

    //initialize the grid variables
    var me = this;
    this.$parent = $(para.parent);
    this.fields = para.fields;
    this.checkbox = para.checkbox;
    this.data;
    this.stringBuilder = new StringBuilder();

    //append the table header -- start
    this.stringBuilder.append("<div class='headerDiv' style='width:");
    this.stringBuilder.append(para.width + 17);
    this.stringBuilder.append("px;'><table class='gridviewHeader' style='width: ");
    this.stringBuilder.append(para.width);
    this.stringBuilder.append("px;'><tr>");

    for (var i in me.checkbox) {

        this.stringBuilder.append("<th style='");
        this.stringBuilder.append(me.checkbox.titleStyle);
        if (me.checkbox.selectAll) {
            this.stringBuilder.append("'><input type='checkbox' /></th>");
        } else {
            this.stringBuilder.append("'></th>");
        }
        break;
    }
    for (var j = 0, field; field = me.fields[j]; j++) {
        this.stringBuilder.append("<th style='");
        this.stringBuilder.append(field.titleStyle);
        this.stringBuilder.append("'>");
        this.stringBuilder.append(field.title);
        this.stringBuilder.append("</th>");
    } 
    this.stringBuilder.append("</tr></table></div>");
    this.stringBuilder.append("<div class='bodyDiv' style='height: 200px; width: ");
    this.stringBuilder.append(para.width + 17);
    this.stringBuilder.append("px;'><table class='gridview' style='width: ");
    this.stringBuilder.append(para.width);
    this.stringBuilder.append("px;'>");
    this.stringBuilder.append("</table></div>"); 
    me.$parent.html(this.stringBuilder.toString());
    this.stringBuilder.clear();
    //append the table header -- End
     
    //get the table body element
    this.$table = me.$parent.find("table.gridview");

    //register the check box click event
    this.$headerCheckbox = undefined;
    me.$headerCheckbox = me.$parent.find("table.gridviewHeader tr th:first-child").find(':checkbox');
    me.$headerCheckbox.click(function () {
        var ischecked = me.$headerCheckbox.is(':checked');
        me.$table.find("tr td:first-child").each(function () {
            $(this).find(":checkbox").prop('checked', ischecked);
        });
    });

    //function
    this.setData = function (data) {
        me.allData = data;
        me.bindData(data);
    }


    this.bindData = function (data) {

        me.data = data;
        me.$table.find("tr:gt(0)").remove(); 
        var headerCheck = me.$headerCheckbox.is(":checked");

        for (var i = 0, item; item = data[i]; i++) {
            this.stringBuilder.append("<tr>");

            for (var p in me.checkbox) {
                this.stringBuilder.append("<td style='");
                this.stringBuilder.append(me.checkbox.style);
                this.stringBuilder.append("'>");
                this.stringBuilder.append("<input type='checkbox' ");
                this.stringBuilder.append(headerCheck ? "checked='checked'" : "");
                this.stringBuilder.append(" />");
                this.stringBuilder.append("</td>");
                break;
            }

            for (var j = 0, field; field = me.fields[j]; j++) {
                this.stringBuilder.append("<td style='");
                this.stringBuilder.append(field.style);
                this.stringBuilder.append("'>");
                this.stringBuilder.append(item[field.name]);
                this.stringBuilder.append("</td>");
            } 
            this.stringBuilder.append("</tr>"); 
        }

        me.$table.html(this.stringBuilder.toString());
        this.stringBuilder.clear();
        if (me.$table.height() > me.$table.parent().height()) { 
            me.$table.find("tr:last td").css("border-bottom", "0px solid gray");
        }
    }

    this.getSelectdData = function () {
        var checkbox = me.checkbox;

        var result = [];
        var data = me.data;

        var i = 0;
        me.$table.find("tr td:first-child").each(function () {
            var ischecked = $(this).find(":checkbox")[0].checked;
            if (ischecked) {
                result.push(data[i]);
            }
            i = i + 1;
        });
        return result;
    }

    this.filter = function (criteria) {
        var dataFiltered = [];

        for (var i = 0, record; record = me.allData[i]; i++) {
            for (var p in criteria) {
                if (record[p] == criteria[p] || criteria[p] == "All") {
                    dataFiltered.push(record);
                }
            }
            
        }
        me.bindData(dataFiltered);
    }
}
