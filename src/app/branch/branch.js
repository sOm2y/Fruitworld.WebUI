var app;
(function (app) {
    var domain;
    (function (domain) {
        var Branch = (function () {
            function Branch(branchId, name, contactName, phone, email, fax, apt, street, line1, city, state, postCode, country, fullAddress) {
                this.branchId = branchId;
                this.name = name;
                this.contactName = contactName;
                this.phone = phone;
                this.email = email;
                this.fax = fax;
                this.apt = apt;
                this.street = street;
                this.line1 = line1;
                this.city = city;
                this.state = state;
                this.postCode = postCode;
                this.country = country;
                this.fullAddress = fullAddress;
            }
            return Branch;
        }());
        domain.Branch = Branch;
    })(domain = app.domain || (app.domain = {}));
})(app || (app = {}));
