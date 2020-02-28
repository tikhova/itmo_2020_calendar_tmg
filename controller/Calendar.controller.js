sap.ui.define(['sap/ui/core/mvc/Controller', 'sap/ui/unified/DateRange', 'sap/ui/core/format/DateFormat',
		'sap/ui/unified/DateTypeRange', 'sap/ui/core/library', 'sap/ui/unified/library'
	],
	function (Controller, DateRange, DateFormat, DateTypeRange, coreLibrary, unifiedLibrary) {
		"use strict";

		var CalendarType = coreLibrary.CalendarType;
		var CalendarDayType = unifiedLibrary.CalendarDayType;

		return Controller.extend("sap.ui.tmg.calendar.App", {
			oFormatYyyymmdd: null,

			onInit: function () {
				this.oFormatYyyymmdd = DateFormat.getInstance({
					pattern: "yyyy-MM-dd",
					calendarType: CalendarType.Gregorian
				});

				var oCalendar = this.byId("calendar");

				oCalendar.addSpecialDate(new DateTypeRange({
					startDate: new Date("November 25, 2020"),
					type: CalendarDayType.Type01,
					tooltip: "Мой день рождения"
				}));
			},

			handleCalendarSelect: function (oEvent) {
				var oCalendar = oEvent.getSource();

				this._updateText(oCalendar);
			},

			_updateText: function (oCalendar) {
				var oText = this.byId("selectedDate"),
					aSelectedDates = oCalendar.getSelectedDates(),
					oDate = aSelectedDates[0].getStartDate();

				oText.setText(this.oFormatYyyymmdd.format(oDate));
			},

			handleSelectToday: function () {
				var oCalendar = this.byId("calendar");

				oCalendar.removeAllSelectedDates();
				oCalendar.addSelectedDate(new DateRange({
					startDate: new Date()
				}));
				this._updateText(oCalendar);
			}
		});

	});