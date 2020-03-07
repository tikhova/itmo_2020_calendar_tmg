sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/model/json/JSONModel"
], function (UIComponent, JSONModel, ResourceModel) {
	"use strict";
	return UIComponent.extend("sap.ui.tmg.calendar.Component", {
		metadata: {
			manifest: "json"
		},
		init: function () {
			// call the init function of the parent
			UIComponent.prototype.init.apply(this, arguments);
			// set locale
			sap.ui.getCore().getConfiguration().setLanguage("ru-RU");
			// set data model
			var oData = {};
			var oModel = new JSONModel(oData);
			this.setModel(oModel);
		}
	});
});