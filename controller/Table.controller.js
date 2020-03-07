sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"sap/ui/core/format/DateFormat", 'sap/ui/unified/library'
], function (Controller, JSONModel, MessageToast, DateFormat, unifiedLibrary) {
	"use strict";

	return Controller.extend("sap.ui.tmg.calendar.Table", {

		onDelete: function (oEvent) {
			var path = oEvent.getParameter('listItem').getBindingContext('vacation').getPath();
			var idx = parseInt(path.substring(path.lastIndexOf('/') + 1), 10);
			var oModel = this.getOwnerComponent().getModel('vacation');
			var data = oModel.getProperty('/intervals');

			// delete info from the model
			var deletedInterval = data.splice(idx, 1)[0];
			var holidaysCount = deletedInterval.holidaysCount;
			var daysCount = deletedInterval.daysCount;
			var hadFortnight = daysCount >= 14;
			if (hadFortnight) {
				oModel.setProperty('/fortnightCount', oModel.getProperty('/fortnightCount') - 1);
			}
			oModel.setProperty('/intervals', data);
			oModel.setProperty('/count', oModel.getProperty('/count') - 1);
			oModel.setProperty('/totalLength', oModel.getProperty('/totalLength') - (daysCount - holidaysCount));
		}

	});
});