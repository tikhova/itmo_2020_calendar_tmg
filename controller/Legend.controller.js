sap.ui.define([
	'sap/ui/core/mvc/Controller',
	'sap/ui/unified/CalendarLegendItem',
	'sap/ui/unified/DateTypeRange',
	'sap/ui/unified/library'
], function (Controller, CalendarLegendItem, DateTypeRange, unifiedLibrary) {
	"use strict";

	return Controller.extend("sap.ui.tmg.calendar.Legend", {

		onInit: function () {
			var oLeg = this.byId("legend");

			oLeg.addItem(new CalendarLegendItem({
				type: "Type01",
				text: "{i18n>holidayDate}"
			}));

			oLeg.addItem(new CalendarLegendItem({
				type: "Type02",
				text: "{i18n>extraNonWorkingDate}"
			}));

			oLeg.addItem(new CalendarLegendItem({
				type: "Type03",
				text: "{i18n>shortenedWorkingDate}"
			}));

			oLeg.addItem(new CalendarLegendItem({
				type: "Type04",
				text: "{i18n>extraWorkingDate}"
			}));
		}
	});

});