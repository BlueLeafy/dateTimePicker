document.addEventListener("DOMContentLoaded", function () {

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const daysName = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
    let currentMonth = new Date().getMonth(); // 0 - 11
    let currentYear = new Date().getFullYear();
    let selectedMonth = currentMonth;
    let selectedDate = null; // Store selected date
    let selectedTime = null; // Store selected time
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
        const { calendarDatesList } = createDays(calendarWrapper, selectedMonth, currentYear);
        populateDates(calendarDatesList, selectedMonth, currentYear);

        monthsPopupElement = monthsPopup(calendarWrapper);

        // Highlight current date on intialization
        highlightCurrentDate(calendarDatesList, currentYear, selectedMonth);
        highlightCurrentMonth();

        const calendarDays = document.getElementById("calendarDays");
        calendarDays.classList.add("open");

        calendarMonth.addEventListener("click", function () {
            if (!monthsPopupElement.classList.contains("open")) {
                document.getElementById("calendarSelectedMonth").style.display = "none";
            }

            calendarDays.classList.toggle("open");
            monthsPopupElement.classList.toggle("open");

            // Always highlight current month when pop up
            highlightCurrentMonth();
        });

        // Event listener fir currentYearArrow
        const currentYearArrow = document.getElementById("currentYear");
        currentYearArrow.addEventListener("click", function () {
            if (!monthsPopupElement.classList.contains("open")) {
                // Reset to present year
                currentYear = new Date().getFullYear();
                // Reset to present month
                selectedMonth = new Date().getMonth();
                renderCalendar(selectedMonth, currentYear); // Render calendar for current month/year

                // Remove selected-month class from all cells
                const monthCells = document.querySelectorAll(".month-cell");
                monthCells.forEach(function (monthCell) {
                    monthCell.classList.remove("selected-month");
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

        const calendarSelectedMonth = document.createElement("div");
        calendarSelectedMonth.className = "calendar-current-my";
        calendarSelectedMonth.id = "calendarSelectedMonth";
        calendarSelectedMonth.innerText = getMonthName(selectedMonth);
        calendarMonth.appendChild(calendarSelectedMonth);

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

            // Highlight current month on initial load
            if (i === currentMonth) {
                monthCell.classList.add("current-month");
            }

            monthCell.addEventListener("click", function () {
                // remove selected month on all month cells
                const monthCells = document.querySelectorAll(".month-cell");
                monthCells.forEach(function (cell) {
                    cell.classList.remove("selected-month")
                })

                // highlight seleted month
                monthCell.classList.add("selected-month");

                selectedMonth = i;

                renderCalendar(selectedMonth, currentYear);
                monthsPopup.classList.toggle("open");
                calendarDays.classList.toggle("open");

                // After clicking on a month, the calendarSelectedMonth is visible
                document.getElementById("calendarSelectedMonth").style.display = "block";


            });

            monthsContainer.appendChild(monthCell);
        }

        calendarWrapper.appendChild(monthsPopup);

        return monthsPopup;
    }

    function highlightCurrentMonth() {
        const monthCells = document.querySelectorAll(".month-cell");

        monthCells.forEach((monthCell, index) => {

            if (index === currentMonth) {
                monthCell.classList.add("current-month");
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
                selectedMonth--;
                if (selectedMonth < 0) {
                    selectedMonth = 11;
                    currentYear--;
                }
                renderCalendar(selectedMonth, currentYear);
            }
        });

        nextYear.addEventListener("click", function () {
            if (monthsPopupElement.classList.contains("open")) {
                currentYear++;
                updateYearDisplay();
            } else {
                selectedMonth++;
                if (selectedMonth > 11) {
                    selectedMonth = 0;
                    currentYear++;
                }
                renderCalendar(selectedMonth, currentYear);
            }
        });

        // Event listener to return calendarCurrentYear to current year when clickin currentYearArrow
        currentYearArrow.addEventListener("click", function () {
            if (monthsPopupElement.classList.contains("open")) {
                currentYear = new Date().getFullYear();

                const currentMonthIndex = new Date().getMonth();
                // Put back month to today
                const monthsCell = document.querySelectorAll(".month-cell");
                monthsCell.forEach(function (monthCell, index) {
                    monthCell.classList.remove("selected-month");

                    // Highlight the current month
                    if (index === currentMonthIndex) {
                        monthCell.classList.add("current-month");
                    }
                });

            } else {
                currentYear = new Date().getFullYear();
                selectedMonth = new Date().getMonth();
            }
            updateYearDisplay();
        });

        return yearControl;
    }

    function updateYearDisplay() {
        const calendarCurrentYear = document.getElementById("calendarCurrentYear");
        calendarCurrentYear.innerText = currentYear;
    }

    function renderCalendar(month, year) {
        const calendarSelectedMonth = document.getElementById("calendarSelectedMonth");
        const calendarCurrentYear = document.getElementById("calendarCurrentYear");
        calendarSelectedMonth.innerText = getMonthName(month);
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
            day.classList.remove("current-date");
        });

        const today = new Date();
        const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;

        // highlight current date
        if (isCurrentMonth) {
            dayCells.forEach((day) => {
                if (parseInt(day.innerText) === today.getDate()) {
                    day.classList.add("current-date");
                }
            });
        }

        // Event listener for date selection
        dayCells.forEach((day) => {
            day.addEventListener("click", (event) => {
                const dayNumber = parseInt(event.target.dataset.date);
                const selectedDate = new Date(year, month, dayNumber);
                const dayIndex = selectedDate.getDay();
                const dayName = daysName[dayIndex];
                const monthName = getMonthName(month);
                const formattedDate = `${dayNumber} ${dayName} ${monthName} ${year}`

                // Remove selected-date class from all cells
                dayCells.forEach((day) => {
                    day.classList.remove("selected-date");
                });

                // Add selected date class to selected element
                day.classList.add("selected-date");

                updateInputValue(formattedDate);

                console.log(formattedDate);

            })
        })
    }

    function createTime(dtPickerContent) {
        const timeContainer = document.createElement("div");
        timeContainer.className = "time-container";
        dtPickerContent.appendChild(timeContainer);

        const timeToggle = document.createElement("div");
        timeToggle.className = "time-toggle";
        timeToggle.id = "timeToggle";
        timeToggle.innerText = "Pick a time";
        timeContainer.appendChild(timeToggle);

        const timeDropdownWrapper = document.createElement("div");
        timeDropdownWrapper.className = "time-dropdown-wrapper";
        timeDropdownWrapper.id = "timeDropdownWrapper";
        timeContainer.appendChild(timeDropdownWrapper);

        const timeDropdown = document.createElement("div");
        timeDropdown.className = "time-dropdown";
        timeDropdown.id = "timeDropdown";
        timeDropdownWrapper.appendChild(timeDropdown);

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
            timeDropdownWrapper.classList.toggle("open");
            // Optionally, you can add logic to update the toggle text or other state changes
        });

        timeOptionHandler();

        return timeContainer;
    }

    function timeOptionHandler() {
        const timeOptions = document.querySelectorAll(".time-option");
        timeOptions.forEach((timeOption) => {
            timeOption.addEventListener("click", () => {
                selectedTime = timeOption.getAttribute("data-time");
                updateInputValue();
            })
        })
    }

    function formatTime(timeString) {
        const [hour, minute] = timeString.split(':').map(Number);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const formattedHour = hour % 12 || 12;
        return `${String(formattedHour).padStart(2, '0')}:${String(minute).padStart(2, '0')} ${ampm}`;
    }

    // Issue with this!!!!
    function updateInputValue(formattedDate = null, timeString = null) {

        // Use the stored date if no new date is passed
        if (formattedDate) {
            selectedDate = formattedDate;
        } else {
            formattedDate = selectedDate;
        }

        // Use the stored time if no new time is passed
        if (timeString) {
            selectedTime = timeString;
        } else {
            timeString = selectedTime;
        }

        let formattedTimeValue = timeString ? formatTime(timeString) : '';

        dtPickerInput.value = `${formattedDate}${formattedTimeValue ? ` ${formattedTimeValue}` : ''}`;
    }

    function openDtPickerhandler() {
        const input = document.getElementById("dtPickerInput");
        const dtPickerContent = document.getElementById("dtPickerContent"); // Move this line up
        const calendarWrapper = dtPickerContent.querySelector(".calendar-wrapper");
    
        input.addEventListener("click", function () {
            if (dtPickerContent.classList.contains("open")) {
                // Close picker smoothly
                calendarWrapper.style.opacity = 0;
                setTimeout(() => {
                    // Collapse the container
                    dtPickerContent.classList.remove("open");
                }, 300); // Wait for the inner transition to finish
    
                setTimeout(() => {
                    dtPickerContent.style.maxHeight = "0"; // Collapse height
                    dtPickerContent.style.visibility = "hidden"; // Finally hide visibility
                }, 600);
            } else {
                // Open picker setting display to block
                dtPickerContent.style.visibility = "visible"; // Finally make visible
                dtPickerContent.classList.add("open");
                setTimeout(() => {
                    // Expand height
                    dtPickerContent.style.maxHeight = "1000px";
                    calendarWrapper.style.opacity = 1; // Fade in inner content
                }, 10); // Small delay to allow the display change to take effect
            }
        });
    }

    // Empty input field everytime I refresh page
    window.onload = function() {
        const dtPickerInput = document.getElementById("dtPickerInput");
        dtPickerInput.value = "";
    }
    
    openDtPickerhandler();
});
