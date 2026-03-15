// =====================================
// PCSHS Admin Panel Functions
// =====================================

const AdminPanel = {
    
    // ========== ANNOUNCEMENT FUNCTIONS ==========
    
    showAddAnnouncementModal: function() {
        const modal = this.createModal('Add Announcement', `
            <form id="add-announcement-form" class="admin-form">
                <div class="form-group">
                    <label>Title *</label>
                    <input type="text" name="title" required class="form-input">
                </div>
                <div class="form-group">
                    <label>Category *</label>
                    <select name="category" required class="form-input">
                        <option value="Academic">Academic</option>
                        <option value="Events">Events</option>
                        <option value="General">General</option>
                        <option value="Health">Health</option>
                        <option value="Technology">Technology</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Priority</label>
                    <select name="priority" class="form-input">
                        <option value="normal">Normal</option>
                        <option value="high">High (Important)</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Content *</label>
                    <textarea name="content" required class="form-input" rows="5"></textarea>
                </div>
                <div class="form-group">
                    <label>Posted By *</label>
                    <input type="text" name="postedBy" required class="form-input" value="${Auth.getCurrentUser().name}">
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn-primary">Post Announcement</button>
                    <button type="button" class="btn-secondary" onclick="AdminPanel.closeModal()">Cancel</button>
                </div>
            </form>
        `);

        document.getElementById('add-announcement-form').onsubmit = (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData);
            this.addAnnouncement(data);
        };
    },

    addAnnouncement: function(data) {
        const announcementsGrid = document.querySelector('.announcements-grid');
        if (!announcementsGrid) return;

        const today = new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });

        const article = document.createElement('article');
        article.className = `announcement-card ${data.priority === 'high' ? 'priority-high' : ''}`;
        article.innerHTML = `
            ${data.priority === 'high' ? '<div class="card-tag">Important</div>' : ''}
            <div class="announcement-meta">
                <span class="announcement-date">${today}</span>
                <span class="announcement-category">${data.category}</span>
            </div>
            <h3>${data.title}</h3>
            <p>${data.content}</p>
            <div class="announcement-footer">
                <span class="posted-by">Posted by: ${data.postedBy}</span>
            </div>
        `;

        announcementsGrid.insertBefore(article, announcementsGrid.firstChild);
        
        // Re-initialize admin controls
        Auth.showAdminControls();
        
        this.closeModal();
        this.showToast('Announcement posted successfully!', 'success');
    },

    editAnnouncement: function(index) {
        this.showToast('Edit feature - Coming soon!', 'info');
    },

    deleteAnnouncement: function(index) {
        if (confirm('Are you sure you want to delete this announcement?')) {
            const cards = document.querySelectorAll('.announcement-card');
            if (cards[index]) {
                cards[index].style.animation = 'fadeOut 0.3s ease';
                setTimeout(() => {
                    cards[index].remove();
                    this.showToast('Announcement deleted', 'success');
                }, 300);
            }
        }
    },

    // ========== ATTENDANCE FUNCTIONS ==========

    showMarkAttendanceModal: function() {
        const modal = this.createModal('Mark Attendance', `
            <form id="mark-attendance-form" class="admin-form">
                <div class="form-group">
                    <label>Select Section *</label>
                    <select name="section" required class="form-input" id="section-selector">
                        <option value="section-cayley">Cayley</option>
                        <option value="section-descartes">Descartes</option>
                        <option value="section-escher">Escher</option>
                        <option value="section-euler">Euler</option>
                        <option value="section-gauss">Gauss</option>
                        <option value="section-kepler">Kepler</option>
                        <option value="section-mobius">Mobius</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Quick Actions</label>
                    <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                        <button type="button" class="btn-secondary btn-sm" onclick="AdminPanel.markAllPresent()">
                            Mark All Present
                        </button>
                        <button type="button" class="btn-secondary btn-sm" onclick="AdminPanel.markAllAbsent()">
                            Mark All Absent
                        </button>
                        <button type="button" class="btn-secondary btn-sm" onclick="AdminPanel.randomizeAttendance()">
                            Randomize (Demo)
                        </button>
                    </div>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn-secondary" onclick="AdminPanel.closeModal()">Close</button>
                </div>
            </form>
        `);

        document.getElementById('section-selector').onchange = (e) => {
            // Switch to selected section
            const tabs = document.querySelectorAll('.section-tab');
            tabs.forEach(tab => {
                if (tab.getAttribute('data-section') === e.target.value) {
                    tab.click();
                }
            });
        };
    },

    toggleAttendanceStatus: function(badge) {
        const row = badge.closest('tr');
        const timeCell = row.querySelector('td:last-child');
        
        if (badge.textContent === 'Present') {
            badge.textContent = 'Absent';
            badge.className = 'status-badge absent clickable-status';
            timeCell.textContent = '—';
            this.updateSectionStats(-1);
        } else {
            badge.textContent = 'Present';
            badge.className = 'status-badge present clickable-status';
            const now = new Date();
            const time = now.toLocaleTimeString('en-US', { 
                hour: 'numeric', 
                minute: '2-digit', 
                hour12: true 
            });
            timeCell.textContent = time;
            this.updateSectionStats(1);
        }
        
        this.showToast('Attendance updated', 'success');
    },

    editTimeIn: function(cell) {
        const currentTime = cell.textContent;
        const input = document.createElement('input');
        input.type = 'time';
        input.className = 'time-input-inline';
        
        // Convert current time to 24-hour format for input
        if (currentTime && currentTime !== '—') {
            const [time, period] = currentTime.split(' ');
            let [hours, minutes] = time.split(':');
            hours = parseInt(hours);
            
            if (period === 'PM' && hours !== 12) hours += 12;
            if (period === 'AM' && hours === 12) hours = 0;
            
            input.value = `${String(hours).padStart(2, '0')}:${minutes}`;
        }
        
        input.onblur = function() {
            if (input.value) {
                const [hours, minutes] = input.value.split(':');
                let h = parseInt(hours);
                const period = h >= 12 ? 'PM' : 'AM';
                h = h % 12 || 12;
                cell.textContent = `${h}:${minutes} ${period}`;
            }
            cell.style.display = '';
            input.remove();
        };
        
        input.onkeypress = function(e) {
            if (e.key === 'Enter') {
                input.blur();
            }
        };
        
        cell.style.display = 'none';
        cell.parentElement.appendChild(input);
        input.focus();
    },

    markAllPresent: function() {
        const activeSection = document.querySelector('.attendance-section.active');
        if (!activeSection) return;

        const rows = activeSection.querySelectorAll('.attendance-table tbody tr');
        const now = new Date();
        const time = now.toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit', 
            hour12: true 
        });

        rows.forEach(row => {
            const badge = row.querySelector('.status-badge');
            const timeCell = row.querySelector('td:last-child');
            
            if (badge) {
                badge.textContent = 'Present';
                badge.className = 'status-badge present clickable-status';
            }
            if (timeCell) {
                timeCell.textContent = time;
            }
        });

        this.updateSectionStats('all');
        this.showToast('All students marked present', 'success');
    },

    markAllAbsent: function() {
        const activeSection = document.querySelector('.attendance-section.active');
        if (!activeSection) return;

        const rows = activeSection.querySelectorAll('.attendance-table tbody tr');

        rows.forEach(row => {
            const badge = row.querySelector('.status-badge');
            const timeCell = row.querySelector('td:last-child');
            
            if (badge) {
                badge.textContent = 'Absent';
                badge.className = 'status-badge absent clickable-status';
            }
            if (timeCell) {
                timeCell.textContent = '—';
            }
        });

        this.updateSectionStats(0);
        this.showToast('All students marked absent', 'success');
    },

    randomizeAttendance: function() {
        const activeSection = document.querySelector('.attendance-section.active');
        if (!activeSection) return;

        const rows = activeSection.querySelectorAll('.attendance-table tbody tr');
        
        rows.forEach(row => {
            const isPresent = Math.random() > 0.15; // 85% chance of being present
            const badge = row.querySelector('.status-badge');
            const timeCell = row.querySelector('td:last-child');
            
            if (isPresent) {
                badge.textContent = 'Present';
                badge.className = 'status-badge present clickable-status';
                
                // Random time between 7:30 and 8:00 AM
                const minutes = Math.floor(Math.random() * 30) + 30;
                const hour = minutes >= 60 ? 8 : 7;
                const min = minutes >= 60 ? minutes - 60 : minutes;
                timeCell.textContent = `${hour}:${String(min).padStart(2, '0')} AM`;
            } else {
                badge.textContent = 'Absent';
                badge.className = 'status-badge absent clickable-status';
                timeCell.textContent = '—';
            }
        });

        this.updateSectionStats('recalc');
        this.showToast('Attendance randomized (demo)', 'success');
    },

    updateSectionStats: function(change) {
        const activeSection = document.querySelector('.attendance-section.active');
        if (!activeSection) return;

        const stats = activeSection.querySelector('.section-stats');
        if (!stats) return;

        if (change === 'recalc' || change === 'all' || change === 0) {
            // Recalculate from scratch
            const rows = activeSection.querySelectorAll('.attendance-table tbody tr');
            let present = 0;
            let absent = 0;

            rows.forEach(row => {
                const badge = row.querySelector('.status-badge');
                if (badge && badge.textContent === 'Present') present++;
                else absent++;
            });

            const total = present + absent;
            
            stats.innerHTML = `
                <span class="stat-item">Present: <strong>${present}</strong></span>
                <span class="stat-item">Absent: <strong>${absent}</strong></span>
                <span class="stat-item">Total: <strong>${total}</strong></span>
            `;
        }
    },

    exportAttendance: function() {
        const activeSection = document.querySelector('.attendance-section.active');
        if (!activeSection) return;

        const sectionName = activeSection.querySelector('h3').textContent;
        const rows = activeSection.querySelectorAll('.attendance-table tbody tr');
        
        let csvContent = 'No,Student Name,Gender,Status,Time In\n';
        
        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            const rowData = Array.from(cells).map(cell => {
                const badge = cell.querySelector('.status-badge');
                return badge ? badge.textContent : cell.textContent;
            });
            csvContent += rowData.join(',') + '\n';
        });

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `attendance-${sectionName.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
        
        this.showToast('Attendance data exported', 'success');
    },

    // ========== LOST & FOUND FUNCTIONS ==========

    showAddLostFoundModal: function() {
        const modal = this.createModal('Add Lost & Found Item', `
            <form id="add-lf-form" class="admin-form">
                <div class="form-group">
                    <label>Item Type *</label>
                    <select name="type" required class="form-input">
                        <option value="lost">Lost</option>
                        <option value="found">Found</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Category *</label>
                    <select name="category" required class="form-input">
                        <option value="electronics">Electronics</option>
                        <option value="clothing">Clothing</option>
                        <option value="accessories">Accessories</option>
                        <option value="books">Books & Supplies</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Item Name *</label>
                    <input type="text" name="itemName" required class="form-input" placeholder="e.g., Black Backpack">
                </div>
                <div class="form-group">
                    <label>Description *</label>
                    <textarea name="description" required class="form-input" rows="3" placeholder="Detailed description..."></textarea>
                </div>
                <div class="form-group">
                    <label>Location *</label>
                    <input type="text" name="location" required class="form-input" placeholder="e.g., Room 301, Cafeteria">
                </div>
                <div class="form-group">
                    <label>Contact Name *</label>
                    <input type="text" name="contactName" required class="form-input">
                </div>
                <div class="form-group">
                    <label>Contact Info</label>
                    <input type="text" name="contactInfo" class="form-input" placeholder="Email or Phone">
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn-primary">Add Item</button>
                    <button type="button" class="btn-secondary" onclick="AdminPanel.closeModal()">Cancel</button>
                </div>
            </form>
        `);

        document.getElementById('add-lf-form').onsubmit = (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData);
            this.addLostFoundItem(data);
        };
    },

    addLostFoundItem: function(data) {
        const lfGrid = document.querySelector('.lf-grid');
        if (!lfGrid) return;

        const today = new Date().toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
        });

        const card = document.createElement('div');
        card.className = `lf-card ${data.type}`;
        card.setAttribute('data-category', data.category);
        card.innerHTML = `
            <div class="lf-status ${data.type}">${data.type === 'lost' ? 'Lost' : 'Found'}</div>
            <div class="lf-header">
                <h3>${data.itemName}</h3>
                <span class="lf-category">${data.category}</span>
            </div>
            <p class="lf-description">${data.description}</p>
            <div class="lf-meta">
                <div class="lf-meta-item">
                    <strong>Location:</strong> ${data.location}
                </div>
                <div class="lf-meta-item">
                    <strong>Date:</strong> ${today}
                </div>
                <div class="lf-meta-item">
                    <strong>Contact:</strong> ${data.contactName}
                    ${data.contactInfo ? ` (${data.contactInfo})` : ''}
                </div>
            </div>
        `;

        lfGrid.insertBefore(card, lfGrid.firstChild);
        
        // Re-initialize admin controls
        Auth.showAdminControls();
        
        this.closeModal();
        this.showToast('Item added successfully!', 'success');
    },

    editLostFoundItem: function(index) {
        this.showToast('Edit feature - Coming soon!', 'info');
    },

    deleteLostFoundItem: function(index) {
        if (confirm('Are you sure you want to delete this item?')) {
            const cards = document.querySelectorAll('.lf-card');
            if (cards[index]) {
                cards[index].style.animation = 'fadeOut 0.3s ease';
                setTimeout(() => {
                    cards[index].remove();
                    this.showToast('Item deleted', 'success');
                }, 300);
            }
        }
    },

    markAsResolved: function(index) {
        const cards = document.querySelectorAll('.lf-card');
        if (cards[index]) {
            cards[index].style.opacity = '0.5';
            cards[index].style.filter = 'grayscale(1)';
            const status = cards[index].querySelector('.lf-status');
            if (status) {
                status.textContent = 'Resolved';
                status.className = 'lf-status resolved';
            }
            this.showToast('Marked as resolved', 'success');
        }
    },

    // ========== UTILITY FUNCTIONS ==========

    createModal: function(title, content) {
        // Remove existing modal if any
        const existingModal = document.querySelector('.admin-modal-overlay');
        if (existingModal) existingModal.remove();

        const overlay = document.createElement('div');
        overlay.className = 'admin-modal-overlay';
        overlay.innerHTML = `
            <div class="admin-modal">
                <div class="admin-modal-header">
                    <h3>${title}</h3>
                    <button class="modal-close" onclick="AdminPanel.closeModal()">✕</button>
                </div>
                <div class="admin-modal-content">
                    ${content}
                </div>
            </div>
        `;

        document.body.appendChild(overlay);
        
        // Close on overlay click
        overlay.onclick = (e) => {
            if (e.target === overlay) {
                this.closeModal();
            }
        };

        return overlay;
    },

    closeModal: function() {
        const modal = document.querySelector('.admin-modal-overlay');
        if (modal) {
            modal.style.animation = 'fadeOut 0.2s ease';
            setTimeout(() => modal.remove(), 200);
        }
    },

    showToast: function(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `admin-toast ${type}`;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
};