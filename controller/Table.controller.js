sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"sap/ui/core/format/DateFormat"
], function (Controller, JSONModel, MessageToast, DateFormat) {
	"use strict";

	return Controller.extend("sap.ui.tmg.calendar.Table", {

		onInit: function () {
			var oModel = this.initDataModel();
			oModel.setDefaultBindingMode(sap.ui.model.BindingMode.TwoWay);
			sap.ui.getCore().setModel(oModel, "vacation");
		},

		initDataModel: function () {
			var oModel = new JSONModel();

			oModel.loadData("../model/vacation.json");

			return oModel;
		}
	});

});