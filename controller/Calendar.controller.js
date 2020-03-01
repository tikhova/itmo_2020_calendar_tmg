sap.ui.define(['sap/ui/core/mvc/Controller', 'sap/ui/unified/DateRange', 'sap/ui/core/format/DateFormat',
		'sap/ui/unified/DateTypeRange', 'sap/ui/core/library', 'sap/ui/unified/library'
	],
	function (Controller, DateRange, DateFormat, DateTypeRange, coreLibrary, unifiedLibrary) {
		"use strict";

		var CalendarType = coreLibrary.CalendarType;
		var CalendarDayType = unifiedLibrary.CalendarDayType;
		var xmlDoc;

		function addDayToCal(day) {
			var holidayArray = Array.from(xmlDoc.getElementsByTagName("holiday"));
			var oCalendar = this.byId("calendar");
			var type = day.getAttribute("t");
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
			case "3":
				calendarType = CalendarDayType.Type04;
				break;
			}

			var date = new Date("2020/" + day.getAttribute("d").replace('.', '/'));
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
		}

		return Controller.extend("sap.ui.tmg.calendar.App", {
			oFormatYyyymmdd: null,

			onInit: function () {
				this.oFormatYyyymmdd = DateFormat.getInstance({
					pattern: "yyyy/MM/dd",
					calendarType: CalendarType.Gregorian
				});

				var oCalendar = this.byId("calendar");
				oCalendar.displayDate(new Date("2020/01/01"));

				// load data from xml

				var xmlhttp;
				if (window.XMLHttpRequest) {
					xmlhttp = new XMLHttpRequest();
				} else {
					xmlhttp = new window.ActiveXObject("Microsoft.XMLHTTP");
				}
				xmlhttp.open("GET", "../calendar.xml", false);
				xmlhttp.send();
				xmlDoc = xmlhttp.responseXML;

				Array.from(xmlDoc.getElementsByTagName("day")).forEach(day => addDayToCal.call(this, day));
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