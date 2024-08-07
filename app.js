document.addEventListener("DOMContentLoaded", function () {

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const daysName = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
    let currentMonth = new Date().getMonth(); // 0 - 11
    let currentYear = new Date().getFullYear();
    let monthsPopupElement;

    // Create dt picker wrapper
    function dtPickerWrapper() {
        const wrapper = document.getElementById("dtPickerWrapper");

        const dtPickerContent = document.createElement("div");
        dtPickerContent.className = "dtPicker-content";
        dtPickerContent.id = "dtPickerContent";
        wrapper.appendChild(dtPickerContent);

        return dtPickerContent;
    }

    createDtPicker();

    function createDtPicker() {
        const dtPickerContent = dtPickerWrapper();

        // CALENDAR
        const calendarWrapper = createCalendarWrapper(dtPickerContent);
        const { calendarMonth, calendarYear, calendarMonthYear } = monthYearWrapper(calendarWrapper);

        const yearsControl = yearScroller(calendarMonthYear);
        const { calendarDatesList } = createDays(calendarWrapper, currentMonth, currentYear);
        populateDates(calendarDatesList, currentMonth, currentYear);

        monthsPopupElement = monthsPopup(calendarWrapper);

        // Highlight current date on intialization
        highlightCurrentDate(calendarDatesList, currentYear, currentMonth);

        const calendarDays = document.getElementById("calendarDays");
        calendarDays.classList.add("open");

        calendarMonth.addEventListener("click", function () {
            if (!monthsPopupElement.classList.contains("open")) {
                document.getElementById("calendarCurrentMonth").style.display = "none";
            }
            calendarDays.classList.toggle("open");
            monthsPopupElement.classList.toggle("open");
        });

        // Event listener fir currentYearArrow
        const currentYearArrow = document.getElementById("currentYear");
        currentYearArrow.addEventListener("click", function () {
            if (!monthsPopupElement.classList.contains("open")) {
                // Reset to present year
                currentYear = new Date().getFullYear();
                // Reset to present month
                currentMonth = new Date().getMonth();
                renderCalendar(currentMonth, currentYear); // Render calendar for current month/year

                // Remove current-month class from all cells
                const monthCells = document.querySelectorAll(".month-cell");
                monthCells.forEach(function (monthCell) {
                    monthCell.classList.remove("current-month");
                });
            }
        });

        // TIME
        const timeContainer = createTime(dtPickerContent);
    }

    // CALENDAR
    function createCalendarWrapper(dtPickerContent) {
        const calendarWrapper = document.createElement("div");
        calendarWrapper.className = "calendar-wrapper";
        calendarWrapper.id = "calendarWrapper";
        dtPickerContent.appendChild(calendarWrapper);

        return calendarWrapper;
    }

    function monthYearWrapper(calendarWrapper) {
        const calendarMonthYear = document.createElement("div");
        calendarMonthYear.className = "calendar-month-year";
        calendarMonthYear.id = "calendarMonthYear";
        calendarWrapper.appendChild(calendarMonthYear);

        const calendarMonth = document.createElement("div");
        calendarMonth.className = "calendar-my";
        calendarMonth.id = "calendarMonth";
        calendarMonthYear.appendChild(calendarMonth);

        const calendarCurrentMonth = document.createElement("div");
        calendarCurrentMonth.className = "calendar-current-my";
        calendarCurrentMonth.id = "calendarCurrentMonth";
        calendarCurrentMonth.innerText = getMonthName(currentMonth);
        calendarMonth.appendChild(calendarCurrentMonth);

        const calendarYear = document.createElement("div");
        calendarYear.className = "calendar-my";
        calendarYear.id = "calendarYear";
        calendarMonthYear.appendChild(calendarYear);

        const calendarCurrentYear = document.createElement("div");
        calendarCurrentYear.className = "calendar-current-my";
        calendarCurrentYear.id = "calendarCurrentYear";
        calendarCurrentYear.innerText = currentYear;
        calendarYear.appendChild(calendarCurrentYear);

        return { calendarMonth, calendarYear, calendarMonthYear };
    }

    function getMonthName(monthIndex) {
        return months[monthIndex];
    }

    function monthsPopup(calendarWrapper) {
        const monthsPopup = document.createElement("div");
        monthsPopup.className = "months-popup";
        monthsPopup.id = "monthsPopup";

        const monthsContainer = document.createElement("ul");
        monthsContainer.className = "months-container";
        monthsPopup.appendChild(monthsContainer);

        for (let i = 0; i < months.length; i++) {
            const monthCell = document.createElement("li");
            monthCell.className = "month-cell";
            monthCell.innerText = months[i];

            monthCell.addEventListener("click", function () {
                currentMonth = i;

                renderCalendar(currentMonth, currentYear);
                monthsPopup.classList.toggle("open");
                calendarDays.classList.toggle("open");

                // After clicking on a month, the calendarCurrentMonth is visible
                document.getElementById("calendarCurrentMonth").style.display = "block";

                // Highlight current month
                highlightCurrentMonth(currentMonth);

            });

            monthsContainer.appendChild(monthCell);
        }

        calendarWrapper.appendChild(monthsPopup);

        return monthsPopup;
    }

    function highlightCurrentMonth(currentMonth) {
        const monthCells = document.querySelectorAll(".month-cell");

        monthCells.forEach((monthCell, index) => {
            monthCell.classList.remove("current-month");

            if (index === currentMonth) {
                monthCell.classList.add("current-month");
            } else {
                monthCell.classList.remove("current-month");
            }
        });
    }

    function yearScroller(calendarMonthYear) {
        const yearControl = document.createElement("div");
        yearControl.className = "controls-wrapper";
        yearControl.id = "yearControl";
        calendarMonthYear.appendChild(yearControl);

        const prevYear = document.createElement("a");
        prevYear.className = "arrow";
        prevYear.classList.add("prev");
        prevYear.id = "prev";
        yearControl.appendChild(prevYear);

        const currentYearArrow = document.createElement("a");
        currentYearArrow.className = "arrow";
        currentYearArrow.classList.add("currentDate");
        currentYearArrow.id = "currentYear";
        yearControl.appendChild(currentYearArrow);

        const nextYear = document.createElement("a");
        nextYear.className = "arrow";
        nextYear.classList.add("next");
        nextYear.id = "next";
        yearControl.appendChild(nextYear);

        prevYear.addEventListener("click", function () {
            if (monthsPopupElement.classList.contains("open")) {
                currentYear--;
                updateYearDisplay();
            } else {
                currentMonth--;
                if (currentMonth < 0) {
                    currentMonth = 11;
                    currentYear--;
                }
                renderCalendar(currentMonth, currentYear);
            }
        });

        nextYear.addEventListener("click", function () {
            if (monthsPopupElement.classList.contains("open")) {
                currentYear++;
                updateYearDisplay();
            } else {
                currentMonth++;
                if (currentMonth > 11) {
                    currentMonth = 0;
                    currentYear++;
                }
                renderCalendar(currentMonth, currentYear);
            }
        });

        // Event listener to return calendarCurrentYear to current year when clickin currentYearArrow
        currentYearArrow.addEventListener("click", function () {
            if (monthsPopupElement.classList.contains("open")) {
                currentYear = new Date().getFullYear();

                const currentMonthIndex = new Date().getMonth();
                // Put back month to today
                const monthsCell = document.querySelectorAll(".month-cell");
                monthsCell.forEach(function (monthCell) {
                    if (monthCell.classList.contains("current-month")) {
                        monthCell.classList.remove("current-month");
                    }
                });

                // Add the class to the current month cell
                monthsCell[currentMonthIndex].classList.add("current-month");

            } else {
                currentYear = new Date().getFullYear();
                currentMonth = new Date().getMonth();
            }
            updateYearDisplay();
        })

        return yearControl;
    }

    function updateYearDisplay() {
        const calendarCurrentYear = document.getElementById("calendarCurrentYear");
        calendarCurrentYear.innerText = currentYear;
    }

    function renderCalendar(month, year) {
        const calendarCurrentMonth = document.getElementById("calendarCurrentMonth");
        const calendarCurrentYear = document.getElementById("calendarCurrentYear");
        calendarCurrentMonth.innerText = getMonthName(month);
        calendarCurrentYear.innerText = year;

        const calendarDatesList = document.getElementById("calendarDatesList");
        calendarDatesList.innerHTML = ""; // Clear previous dates
        populateDates(calendarDatesList, month, year);
        highlightCurrentDate(calendarDatesList, year, month);
    }

    function createDays(calendarWrapper) {
        const calendarDays = document.createElement("div");
        calendarDays.className = "calendar-days";
        calendarDays.id = "calendarDays";
        calendarWrapper.appendChild(calendarDays);

        const calendarDaysHeader = document.createElement("ul");
        calendarDaysHeader.className = "calendar-days-header";
        calendarDaysHeader.id = "calendarDaysHeader";
        calendarDays.appendChild(calendarDaysHeader);


        for (let i = 0; i < daysName.length; i++) {
            const calendarDaysList = document.createElement("li");
            calendarDaysList.innerText = daysName[i];
            calendarDaysHeader.appendChild(calendarDaysList);
        }

        const calendarDates = document.createElement("div");
        calendarDates.className = "calendar-dates";
        calendarDates.id = "calendarDates";
        calendarDays.appendChild(calendarDates);

        const calendarDatesList = document.createElement("ul");
        calendarDatesList.className = "calendar-dates-list";
        calendarDatesList.id = "calendarDatesList";
        calendarDates.appendChild(calendarDatesList);

        return { calendarDatesList, calendarDays };
    }


    function getDaysInMonth(month, year) {
        return new Date(year, month + 1, 0).getDate();
    }

    function populateDates(calendarDatesList, month, year) {
        const days = getDaysInMonth(month, year);
        const firstDay = new Date(year, month, 1).getDay();
        const prevMonth = (month === 0) ? 11 : month - 1;
        const prevMonthYear = (month === 0) ? year - 1 : year;
        const daysInPrevMonth = getDaysInMonth(prevMonth, prevMonthYear);

        for (let i = firstDay - 1; i >= 0; i--) {
            const prevMonthDate = document.createElement("li");
            prevMonthDate.className = "prev-month-date";
            prevMonthDate.innerText = daysInPrevMonth - i;
            calendarDatesList.appendChild(prevMonthDate);
        }

        for (let i = 1; i <= days; i++) {
            const calendarDateLi = document.createElement("li");
            calendarDateLi.innerText = i;
            calendarDateLi.dataset.date = i;
            calendarDatesList.appendChild(calendarDateLi);
        }

        const totalCells = 42;
        const filledCells = calendarDatesList.children.length;

        const currentWeekDay = filledCells % 7;
        const datesToFill = 7 - currentWeekDay;

        for (let i = 1; i <= datesToFill; i++) {
            const nextMonthDate = document.createElement("li");
            nextMonthDate.className = "next-month-date";
            nextMonthDate.innerText = i;
            calendarDatesList.appendChild(nextMonthDate);
        }
    }

    function highlightCurrentDate(calendarDatesList, year, month) {
        const dayCells = calendarDatesList.querySelectorAll("li");
        dayCells.forEach(function (day) {
            day.addEventListener("click", function (event) {
                const dayNumber = parseInt(event.target.dataset.date);
                const clickedDate = new Date(year, month, dayNumber);
                const dayIndex = clickedDate.getDay();
                const dayName = daysName[dayIndex];

                // Remove 'selected-date' class from all other elements
                dayCells.forEach(function (cell) {
                    cell.classList.remove("selected-date");
                })

                // Add 'selected-date' class to the clicked element
                day.classList.add("selected-date");

                console.log(event.target.dataset.date, dayName);
            })
        });
    }

    function createTime(dtPickerContent) {
        const timeContainer = document.createElement("div");
        timeContainer.className = "time-container";
        dtPickerContent.appendChild(timeContainer);

        const timeToggle = document.createElement("div");
        timeToggle.className = "time-toggle";
        timeToggle.id = "timeToggle";
        timeToggle.innerText = "Time";
        timeContainer.appendChild(timeToggle);

        const timeDropdown = document.createElement("div");
        timeDropdown.className = "time-dropdown";
        timeDropdown.id = "timeDropdown";
        timeContainer.appendChild(timeDropdown);

        for (let hour = 0; hour < 24; hour++) {
            for (let minute = 0; minute < 60; minute += 30) {
                const timeOption = document.createElement("div");
                const timeString = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
                timeOption.className = "time-option";
                timeOption.setAttribute("data-time", timeString);
                timeOption.innerText = timeString;
                timeDropdown.appendChild(timeOption);
            }
        }

        timeToggle.addEventListener("click", function () {
            timeDropdown.classList.toggle("open");

            // when it opens change inenrText of the timeToggle
            if (timeDropdown.classList.contains("open")) {
                // Add the time selecte into innerText
                console.log(timeOption.dataset.time);
            }
        });

        return timeContainer;
    }

});
