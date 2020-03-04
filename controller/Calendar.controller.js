sap.ui.define(['sap/ui/core/mvc/Controller', 'sap/ui/unified/DateRange', 'sap/ui/core/format/DateFormat',
		'sap/ui/unified/DateTypeRange', 'sap/ui/core/library', 'sap/ui/unified/library'
	],
	function (Controller, DateRange, DateFormat, DateTypeRange, coreLibrary, unifiedLibrary) {
		"use strict";

		var xmlDoc;

		return Controller.extend("sap.ui.tmg.calendar.Calendar", {
			oFormatYyyymmdd: null,
			extraWorkingSet: null,
			nonWorkingSet: null,

			addDayToCal: function (day) {
				var holidayArray = Array.from(xmlDoc.getElementsByTagName("holiday"));
				var CalendarDayType = unifiedLibrary.CalendarDayType;
				var oCalendar = this.byId("calendar");
				var type = day.getAttribute("t");
				var calendarType;
				var holidayTooltip;

				var date = new Date("2020/" + day.getAttribute("d").replace('.', '/'));

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

					this.nonWorkingSet.add(date.getTime());
					break;
				case "2": // shortened work day
					calendarType = CalendarDayType.Type03;
					this.extraWorkingSet.add(date.getTime());
					break;
				case "3": // extra working day
					calendarType = CalendarDayType.Type04;
					this.extraWorkingSet.add(date.getTime());
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

			isWorkingDay: function (day) {
				var dayOfWeek = day.getDay();
				if (dayOfWeek === 0 || dayOfWeek === 6) {
					return this.extraWorkingSet.has(day.getTime()) === true;
				} else {
					return this.nonWorkingSet.has(day.getTime()) === false;
				}
			},

			onInit: function () {
				var CalendarType = coreLibrary.CalendarType;
				this.oFormatYyyymmdd = DateFormat.getInstance({
					pattern: "yyyy/MM/dd",
					calendarType: CalendarType.Gregorian
				});
				this.extraWorkingSet = new Set();
				this.nonWorkingSet = new Set();

				var oCalendar = this.byId("calendar");
				oCalendar.displayDate(new Date("2020/01/01"));

				// load data from xml

				var xmlhttp;
				if (window.XMLHttpRequest) {
					xmlhttp = new XMLHttpRequest();
				} else {
					xmlhttp = new window.ActiveXObject("Microsoft.XMLHTTP");
				}
				xmlhttp.open("GET", "../model/calendar.xml", false);
				xmlhttp.send();
				xmlDoc = xmlhttp.responseXML;

				Array.from(xmlDoc.getElementsByTagName("day")).forEach(day => this.addDayToCal(day));
			},

			addInterval: function () {
				var oCalendar = this.byId("calendar");

				var interval = oCalendar.getSelectedDates()[0];

				var startDate = interval.getStartDate();
				var endDate = interval.getEndDate();
				var diffDays = Math.ceil(Math.abs(endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

				var workingCount = 0;
				var curDate = new Date(startDate);
				while (curDate.getTime() <= endDate.getTime()) {
					if (this.isWorkingDay(curDate)) {
						workingCount++;
					}
					curDate.setDate(curDate.getDate() + 1);
				}

				var oFormat = sap.ui.core.format.DateFormat.getInstance({
					pattern: "MM/dd/yyyy"
				});

				const oModel = this.getView().getModel('vacation');
				oModel.setProperty('/Intervals',
					oModel.getProperty('/Intervals')
					.concat({
						"startDate": `${oFormat.format(startDate)}`,
						"endDate": `${oFormat.format(endDate)}`,
						"daysCount": `${diffDays}`,
						"workingDaysCount": `${workingCount}`
					})
					.sort((int1, int2) =>
						new Date(int1.startDate).getTime() > new Date(int2.startDate).getTime()
					)
				);

				oModel.refresh();
			}
		});

	});