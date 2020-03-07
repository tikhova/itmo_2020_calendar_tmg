sap.ui.define(['sap/ui/core/mvc/Controller', 'sap/ui/unified/DateRange', 'sap/ui/core/format/DateFormat',
		'sap/ui/unified/DateTypeRange', 'sap/ui/core/library', 'sap/ui/unified/library'
	],
	function (Controller, DateRange, DateFormat, DateTypeRange, coreLibrary, unifiedLibrary) {
		"use strict";

		return Controller.extend("sap.ui.tmg.calendar.Calendar", {
			oFormatYyyymmdd: null,

			addDayToCal: function (day, holidayArray, oCalendar, CalendarDayType) {
				// get information about current day
				var type = day.getAttribute("t");
				var date = new Date("2020/" + day.getAttribute("d").replace('.', '/'));

				// vars
				var calendarType;
				var holidayTooltip;

				switch (type) {
				case "1": // holiday
					var holidayId = day.getAttribute("h");
					if (holidayId) {
						calendarType = CalendarDayType.Type01;

						holidayTooltip = holidayArray.find(function (holiday) {
							return holiday.getAttribute("id") === holidayId;
						}).getAttribute("title");
					} else {
						calendarType = CalendarDayType.Type02;
					}

					break;
				case "2": // shortened work day
					calendarType = CalendarDayType.Type03;
					break;
				case "3": // extra working day
					calendarType = CalendarDayType.Type04;
					break;
				}

				if (holidayTooltip) {
					oCalendar.addSpecialDate(new DateTypeRange({
						startDate: date,
						type: calendarType,
						tooltip: holidayTooltip
					}));
				} else {
					oCalendar.addSpecialDate(new DateTypeRange({
						startDate: date,
						type: calendarType
					}));
				}
			},

			onInit: function () {
				var CalendarType = coreLibrary.CalendarType;
				this.oFormatYyyymmdd = DateFormat.getInstance({
					pattern: "yyyy/MM/dd",
					calendarType: CalendarType.Gregorian
				});

				var oCalendar = this.byId("calendar");
				oCalendar.displayDate(new Date("2020/01/01"));

				// load data from xml
				var oModel = this.getOwnerComponent().getModel('specialDays');

				var days = oModel.getObject('/days').getElementsByTagName("day");

				// get information from xml model
				var holidays = oModel.getObject('/holidays').getElementsByTagName("holiday");
				var holidayArray = Array.from(holidays);

				// get calendar information
				var CalendarDayType = unifiedLibrary.CalendarDayType;
				var oCalendar = this.byId("calendar");

				Array.from(days).forEach(day => this.addDayToCal(day, holidayArray, oCalendar, CalendarDayType));
			}
		});

	});