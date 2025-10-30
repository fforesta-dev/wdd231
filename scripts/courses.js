document.addEventListener('DOMContentLoaded', function () {
    const courseContainer = document.getElementById('course-container');
    const creditCount = document.getElementById('credit-count');
    const filterButtons = document.querySelectorAll('.filter-btn');

    let currentFilter = 'all';

    function renderCourses(coursesToRender) {
        courseContainer.innerHTML = '';

        coursesToRender.forEach(course => {
            const courseCard = document.createElement('div');
            courseCard.className = `course-card ${course.subject.toLowerCase()}${course.completed ? ' completed' : ''}`;
            courseCard.textContent = `${course.subject} ${course.number}`;
            courseContainer.appendChild(courseCard);
        });

        const totalCredits = coursesToRender.reduce((total, course) => total + course.credits, 0);
        creditCount.textContent = totalCredits;
    }

    function filterCourses(filter) {
        let filteredCourses;

        switch (filter) {
            case 'cse':
                filteredCourses = courses.filter(course => course.subject === 'CSE');
                break;
            case 'wdd':
                filteredCourses = courses.filter(course => course.subject === 'WDD');
                break;
            default:
                filteredCourses = courses;
        }

        renderCourses(filteredCourses);
    }

    filterButtons.forEach(button => {
        button.addEventListener('click', function () {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            currentFilter = this.id;
            filterCourses(currentFilter);
        });
    });

    renderCourses(courses);
});