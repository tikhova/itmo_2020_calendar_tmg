sap.ui.define(['sap/ui/core/mvc/Controller', 'sap/ui/unified/DateRange', 'sap/ui/core/format/DateFormat',
		'sap/ui/unified/DateTypeRange', 'sap/ui/core/library'
	],
	function (Controller, DateRange, DateFormat, DateTypeRange, coreLibrary) {
		"use strict";

		var xmlDoc;

		return Controller.extend("sap.ui.tmg.calendar.App", {
			nonWorkingSet: new Set(),
			extraWorkingSet: new Set(),
			holidaySet: new Set(),
			i18nBundle: null,

			addInterval: function () {
				var oModel = this.getOwnerComponent().getModel('vacation');
				var oCalendar = this.byId('calendarView').byId('calendar');
				var count = oModel.getProperty('/count');
				var fortnightCount = oModel.getProperty('/fortnightCount');
				var totalLength = oModel.getProperty('/totalLength');

				// check count
				if (count >= 4) {
					alert(this.i18nBundle.getText('countError'));
					return;
				}

				var interval = oCalendar.getSelectedDates()[0];

				var startDate = interval.getStartDate();
				var endDate = interval.getEndDate();
				if (!endDate) {
					endDate = startDate;
				}
				var startTime = startDate.getTime();
				var endTime = endDate.getTime();

				// check intersection
				var intervals = oModel.getProperty('/intervals');
				var intervalsArray = Array.from(intervals);

				var hasIntersection = intervalsArray.some(interval => {
					var intStart = new Date(interval.startDate).getTime();
					var intEnd = new Date(interval.endDate).getTime();

					return (intStart >= startTime && intStart <= endTime) || (startTime >= intStart && startTime <= intEnd);
				});

				if (hasIntersection) {
					alert(this.i18nBundle.getText('intersectionError'));
					return;
				}

				var diffDays = Math.ceil(Math.abs(endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

				var workingCount = 0;
				var curDate = new Date(startDate);
				var holidayCount = 0;
				while (curDate.getTime() <= endTime) {
					if (this.isWorkingDay(curDate)) {
						workingCount++;
					}
					if (this.holidaySet.has(curDate)) {
						holidayCount++;
					}
					curDate.setDate(curDate.getDate() + 1);
				}

				// check total length
				if (totalLength + diffDays - holidayCount > 28) {
					alert(this.i18nBundle.getText('sumError'));
					return;
				}

				// check fortnight
				if (fortnightCount === 0 && count === 3 && diffDays < 14) {
					alert(this.i18nBundle.getText('fortnightError'));
					return;
				}

				// renew data
				if (diffDays >= 14) {
					fortnightCount++;
				}
				count++;
				totalLength += diffDays - holidayCount;

				var oFormat = sap.ui.core.format.DateFormat.getInstance({
					pattern: "MM/dd/yyyy"
				});

				oModel.setProperty('/count', count);
				oModel.setProperty('/totalLength', totalLength);
				oModel.setProperty('/fortnightCount', fortnightCount);

				oModel.setProperty('/intervals',
					oModel.getProperty('/intervals')
					.concat({
						"startDate": `${oFormat.format(startDate)}`,
						"endDate": `${oFormat.format(endDate)}`,
						"daysCount": `${diffDays}`,
						"workingDaysCount": `${workingCount}`,
						"holidaysCount": `${holidayCount}`
					})
					.sort((int1, int2) =>
						new Date(int1.startDate).getTime() > new Date(int2.startDate).getTime()
					)
				);
			},

			isWorkingDay: function (day, extraWorkingSet, nonWorkingSet) {
				var dayOfWeek = day.getDay();
				if (dayOfWeek === 0 || dayOfWeek === 6) {
					return this.extraWorkingSet.has(day.getTime());
				} else {
					return !this.nonWorkingSet.has(day.getTime());
				}
			},

			addDayToSet: function (day, holidayArray) {
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
						this.holidaySet.add(date.getTime());
					}
					this.nonWorkingSet.add(date.getTime());

					break;
				case "2": // shortened work day
					this.extraWorkingSet.add(date.getTime());
					break;
				case "3": // extra working day
					this.extraWorkingSet.add(date.getTime());
					break;
				}
			},

			getSpecialDaySets: function () {
				var oModel = this.getOwnerComponent().getModel('specialDays');

				// get information from xml model
				var holidays = oModel.getObject('/holidays').getElementsByTagName('holiday');
				var holidayArray = Array.from(holidays);

				var days = oModel.getObject('/days').getElementsByTagName('day');
				var dayArray = Array.from(days);

				dayArray.forEach(day => this.addDayToSet(day, holidayArray));
			},

			onInit: function () {
				this.getSpecialDaySets();
				this.i18nBundle = this.getView().getModel("i18n").getResourceBundle();
			}
		});

	});