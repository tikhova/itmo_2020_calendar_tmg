sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"sap/ui/core/format/DateFormat"
], function (Controller, JSONModel, MessageToast, DateFormat) {
	"use strict";

	return Controller.extend("sap.ui.tmg.calendar.Table", {

		onInit: function () {
			// set explored app's demo model on this sample
			this.getView().setModel(this.initDataModel());
		},

		initDataModel: function () {
			var oModel = new JSONModel();

			oModel.loadData("../model/vacation.json");

			return oModel;
		}
	});

});