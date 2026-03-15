// =====================================
// PCSHS Attendance Data Management
// =====================================

const AttendanceData = {
    // Initialize or get stored attendance data
    getData: function() {
        const stored = localStorage.getItem('pcshs_attendance_data');
        if (stored) {
            return JSON.parse(stored);
        }
        
        // Return default data structure
        return this.generateDefaultData();
    },

    // Save attendance data
    saveData: function(data) {
        localStorage.setItem('pcshs_attendance_data', JSON.stringify(data));
        
        // Update history for graphs
        this.updateHistory(data);
    },

    // Generate default data structure
    generateDefaultData: function() {
        const data = {
            lastUpdated: new Date().toISOString(),
            grades: {}
        };

        // Initialize all grades
        for (let grade = 7; grade <= 12; grade++) {
            const sections = grade === 11 ? 7 : 9;
            data.grades[grade] = {
                sections: {},
                totalStudents: 0,
                presentToday: 0,
                absentToday: 0
            };

            for (let i = 0; i < sections; i++) {
                const sectionName = this.getSectionName(grade, i);
                data.grades[grade].sections[sectionName] = {
                    students: this.getStudentCount(grade),
                    present: 0,
                    absent: 0
                };
            }
        }

        return data;
    },

    // Get section name based on grade and index
    getSectionName: function(grade, index) {
        if (grade === 11) {
            return ['Cayley', 'Descartes', 'Escher', 'Euler', 'Gauss', 'Kepler', 'Mobius'][index];
        }
        return ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'][index];
    },

    // Get student count per section
    getStudentCount: function(grade) {
        // Grade 11 has 35-36 students per section, others have 40
        return grade === 11 ? 35 : 40;
    },

    // Update attendance for a section
    updateSectionAttendance: function(grade, section, present, absent) {
        const data = this.getData();
        
        if (!data.grades[grade] || !data.grades[grade].sections[section]) {
            console.error('Invalid grade or section');
            return;
        }

        data.grades[grade].sections[section].present = present;
        data.grades[grade].sections[section].absent = absent;
        
        // Recalculate grade totals
        let gradePresent = 0;
        let gradeAbsent = 0;
        let gradeTotal = 0;

        Object.values(data.grades[grade].sections).forEach(sec => {
            gradePresent += sec.present;
            gradeAbsent += sec.absent;
            gradeTotal += sec.students;
        });

        data.grades[grade].presentToday = gradePresent;
        data.grades[grade].absentToday = gradeAbsent;
        data.grades[grade].totalStudents = gradeTotal;
        
        data.lastUpdated = new Date().toISOString();
        
        this.saveData(data);
    },

    // Get school-wide statistics
    getSchoolStats: function() {
        const data = this.getData();
        let totalStudents = 0;
        let totalPresent = 0;
        let totalAbsent = 0;

        Object.values(data.grades).forEach(grade => {
            totalStudents += grade.totalStudents;
            totalPresent += grade.presentToday;
            totalAbsent += grade.absentToday;
        });

        const attendanceRate = totalStudents > 0 
            ? ((totalPresent / totalStudents) * 100).toFixed(1) 
            : 0;

        return {
            totalStudents,
            totalPresent,
            totalAbsent,
            attendanceRate
        };
    },

    // Update attendance history for graphs
    updateHistory: function(data) {
        let history = localStorage.getItem('pcshs_attendance_history');
        history = history ? JSON.parse(history) : [];

        const stats = this.getSchoolStats();
        const today = new Date().toISOString().split('T')[0];

        // Check if today's entry exists
        const todayIndex = history.findIndex(h => h.date === today);
        
        if (todayIndex >= 0) {
            history[todayIndex] = {
                date: today,
                ...stats
            };
        } else {
            history.push({
                date: today,
                ...stats
            });
        }

        // Keep only last 30 days
        if (history.length > 30) {
            history = history.slice(-30);
        }

        localStorage.setItem('pcshs_attendance_history', JSON.stringify(history));
    },

    // Get attendance history for graphs
    getHistory: function() {
        const history = localStorage.getItem('pcshs_attendance_history');
        return history ? JSON.parse(history) : [];
    },

    // Sync attendance from DOM (when page loads or changes)
    syncFromDOM: function(grade, section) {
        const activeSection = document.querySelector('.attendance-section.active');
        if (!activeSection) return;

        const rows = activeSection.querySelectorAll('.attendance-table tbody tr');
        let present = 0;
        let absent = 0;

        rows.forEach(row => {
            const badge = row.querySelector('.status-badge');
            if (badge && badge.textContent.trim() === 'Present') {
                present++;
            } else {
                absent++;
            }
        });

        this.updateSectionAttendance(grade, section, present, absent);
    },

    // Initialize sample data for demo
    initializeSampleData: function() {
        const data = this.getData();
        
        // Set random attendance for all sections
        Object.keys(data.grades).forEach(grade => {
            Object.keys(data.grades[grade].sections).forEach(section => {
                const total = data.grades[grade].sections[section].students;
                const present = Math.floor(total * (0.90 + Math.random() * 0.08)); // 90-98% attendance
                const absent = total - present;
                
                data.grades[grade].sections[section].present = present;
                data.grades[grade].sections[section].absent = absent;
            });

            // Update grade totals
            let gradePresent = 0;
            let gradeAbsent = 0;
            let gradeTotal = 0;

            Object.values(data.grades[grade].sections).forEach(sec => {
                gradePresent += sec.present;
                gradeAbsent += sec.absent;
                gradeTotal += sec.students;
            });

            data.grades[grade].presentToday = gradePresent;
            data.grades[grade].absentToday = gradeAbsent;
            data.grades[grade].totalStudents = gradeTotal;
        });

        this.saveData(data);

        // Generate 7 days of history
        this.generateSampleHistory();
    },

    // Generate sample history for the graph
    generateSampleHistory: function() {
        const history = [];
        const today = new Date();

        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];

            // Random attendance rates between 92-97%
            const totalStudents = 2360; // Total school population
            const attendanceRate = 0.92 + Math.random() * 0.05;
            const totalPresent = Math.floor(totalStudents * attendanceRate);
            const totalAbsent = totalStudents - totalPresent;

            history.push({
                date: dateStr,
                totalStudents,
                totalPresent,
                totalAbsent,
                attendanceRate: (attendanceRate * 100).toFixed(1)
            });
        }

        localStorage.setItem('pcshs_attendance_history', JSON.stringify(history));
    }
};

// Initialize on first load if no data exists
if (!localStorage.getItem('pcshs_attendance_data')) {
    AttendanceData.initializeSampleData();
}