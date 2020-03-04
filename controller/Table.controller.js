sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"sap/ui/core/format/DateFormat"
], function (Controller, JSONModel, MessageToast, DateFormat) {
	"use strict";

	var oSorter = new sap.ui.model.Sorter("property");
	oSorter.fnCompare = function (value1, value2) {
		if (value1 < value2) return -1;
		if (value1 == value2) return 0;
		if (value1 > value2) return 1;
	};

	return Controller.extend("sap.ui.tmg.calendar.Table", {

		onInit: function () {
			this.initDataModel();

			var oTable = this.byId("table");
			var oBinding = oTable.getBinding("items");
		},

		initDataModel: function () {
			var oModel = new JSONModel();

			oModel.loadData("../model/vacation.json");

			oModel.setDefaultBindingMode(sap.ui.model.BindingMode.TwoWay);
			sap.ui.getCore().setModel(oModel, "vacation");

			return oModel;
		},

	});

});