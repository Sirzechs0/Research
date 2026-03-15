// =====================================
// PCSHS Authentication System
// =====================================

const Auth = {
    // Demo accounts (in production, this would be handled by a backend)
    accounts: {
        'admin': { password: 'admin123', role: 'admin', name: 'Administrator' },
        'teacher': { password: 'teacher123', role: 'staff', name: 'Teacher Account' },
        'staff': { password: 'staff123', role: 'staff', name: 'Staff Member' },
    },

    // Check if user is logged in
    isLoggedIn: function() {
        return localStorage.getItem('pcshs_user') !== null;
    },

    // Get current user data
    getCurrentUser: function() {
        const userJson = localStorage.getItem('pcshs_user');
        return userJson ? JSON.parse(userJson) : null;
    },

    // Check if current user is admin/staff
    isAdmin: function() {
        const user = this.getCurrentUser();
        return user && (user.role === 'admin' || user.role === 'staff');
    },

    // Login function
    login: function(username, password) {
        const account = this.accounts[username];
        
        if (account && account.password === password) {
            const userData = {
                username: username,
                role: account.role,
                name: account.name,
                loginTime: new Date().toISOString()
            };
            
            localStorage.setItem('pcshs_user', JSON.stringify(userData));
            return { success: true, user: userData };
        }
        
        return { success: false, error: 'Invalid username or password' };
    },

    // Logout function
    logout: function() {
        localStorage.removeItem('pcshs_user');
        window.location.href = 'index.html';
    },

    // Redirect to login if not authenticated (for protected pages)
    requireAuth: function() {
        if (!this.isLoggedIn()) {
            window.location.href = 'login.html';
            return false;
        }
        return true;
    },

    // Redirect to login if not admin (for admin-only pages)
    requireAdmin: function() {
        if (!this.isAdmin()) {
            window.location.href = 'index.html';
            return false;
        }
        return true;
    },

    // Initialize auth UI on page load
    initAuthUI: function() {
        const user = this.getCurrentUser();
        
        // Update header actions based on login status
        const headerActions = document.querySelector('.header-actions');
        if (headerActions) {
            const signupLink = headerActions.querySelector('.signup-link');
            
            if (user) {
                // User is logged in - show user menu
                if (signupLink) {
                    signupLink.innerHTML = `
                        <span style="margin-right: 0.5rem;">👤 ${user.name}</span>
                    `;
                    signupLink.href = '#';
                    signupLink.onclick = (e) => {
                        e.preventDefault();
                        this.showUserMenu();
                    };
                }
                
                // Show admin controls if user is admin
                if (this.isAdmin()) {
                    this.showAdminControls();
                }
            } else {
                // User is not logged in - show login link
                if (signupLink) {
                    signupLink.textContent = 'Login';
                    signupLink.href = 'login.html';
                }
            }
        }

        // Update mobile nav
        const mobileNav = document.getElementById('mobile-nav');
        if (mobileNav) {
            const mobileSignupLink = mobileNav.querySelector('a[href="#signup"]');
            if (mobileSignupLink) {
                if (user) {
                    mobileSignupLink.textContent = user.name;
                    mobileSignupLink.href = '#';
                    mobileSignupLink.onclick = (e) => {
                        e.preventDefault();
                        this.showUserMenu();
                    };
                } else {
                    mobileSignupLink.textContent = 'Login';
                    mobileSignupLink.href = 'login.html';
                }
            }
        }
    },

    // Show user menu dropdown
    showUserMenu: function() {
        const existingMenu = document.querySelector('.user-menu-dropdown');
        if (existingMenu) {
            existingMenu.remove();
            return;
        }

        const user = this.getCurrentUser();
        const menu = document.createElement('div');
        menu.className = 'user-menu-dropdown';
        menu.innerHTML = `
            <div class="user-menu-header">
                <strong>${user.name}</strong>
                <small>${user.role}</small>
            </div>
            <div class="user-menu-items">
                ${this.isAdmin() ? '<a href="admin.html" class="user-menu-item">Admin Panel</a>' : ''}
                <a href="settings.html" class="user-menu-item">Settings</a>
                <a href="#" class="user-menu-item" onclick="Auth.logout(); return false;">Logout</a>
            </div>
        `;

        document.body.appendChild(menu);

        // Close menu when clicking outside
        setTimeout(() => {
            document.addEventListener('click', function closeMenu(e) {
                if (!menu.contains(e.target)) {
                    menu.remove();
                    document.removeEventListener('click', closeMenu);
                }
            });
        }, 100);
    },

    // Show admin controls on pages
    showAdminControls: function() {
        const pageName = window.location.pathname.split('/').pop() || 'index.html';

        // Add admin controls based on current page
        if (pageName === 'announcements.html') {
            this.addAnnouncementAdminControls();
        } else if (pageName === 'attendance.html') {
            this.addAttendanceAdminControls();
        } else if (pageName === 'lost-found.html') {
            this.addLostFoundAdminControls();
        }

        // Add admin indicator to header
        const pageTitle = document.querySelector('.page-title');
        if (pageTitle && !document.querySelector('.admin-mode-badge')) {
            const badge = document.createElement('span');
            badge.className = 'admin-mode-badge';
            badge.textContent = 'Admin Mode';
            pageTitle.appendChild(badge);
        }
    },

    // Add announcement admin controls
    addAnnouncementAdminControls: function() {
        const pageHeader = document.querySelector('.page-header');
        if (pageHeader && !document.querySelector('.admin-action-btn')) {
            const btnContainer = document.createElement('div');
            btnContainer.style.marginTop = '1rem';
            btnContainer.innerHTML = `
                <button class="admin-action-btn" onclick="AdminPanel.showAddAnnouncementModal()">
                    ➕ Add Announcement
                </button>
            `;
            pageHeader.appendChild(btnContainer);
        }

        // Add edit/delete buttons to each announcement
        const announcementCards = document.querySelectorAll('.announcement-card');
        announcementCards.forEach((card, index) => {
            if (!card.querySelector('.admin-controls')) {
                const controls = document.createElement('div');
                controls.className = 'admin-controls';
                controls.innerHTML = `
                    <button class="admin-control-btn edit" onclick="AdminPanel.editAnnouncement(${index})" title="Edit">
                        ✏️
                    </button>
                    <button class="admin-control-btn delete" onclick="AdminPanel.deleteAnnouncement(${index})" title="Delete">
                        🗑️
                    </button>
                `;
                card.appendChild(controls);
            }
        });
    },

    // Add attendance admin controls
    addAttendanceAdminControls: function() {
        const pageHeader = document.querySelector('.page-header');
        if (pageHeader && !document.querySelector('.admin-action-btn')) {
            const btnContainer = document.createElement('div');
            btnContainer.style.marginTop = '1rem';
            btnContainer.innerHTML = `
                <button class="admin-action-btn" onclick="AdminPanel.showMarkAttendanceModal()">
                    ✓ Mark Attendance
                </button>
                <button class="admin-action-btn" onclick="AdminPanel.exportAttendance()">
                    📥 Export Data
                </button>
            `;
            pageHeader.appendChild(btnContainer);
        }

        // Make time-in cells editable on click for admins
        const timeCells = document.querySelectorAll('.attendance-table tbody td:last-child');
        timeCells.forEach(cell => {
            if (cell.textContent !== '—' && !cell.classList.contains('editable-time')) {
                cell.classList.add('editable-time');
                cell.title = 'Click to edit time';
                cell.style.cursor = 'pointer';
                cell.onclick = function() {
                    AdminPanel.editTimeIn(this);
                };
            }
        });

        // Make status badges clickable
        const statusBadges = document.querySelectorAll('.status-badge');
        statusBadges.forEach(badge => {
            if (!badge.classList.contains('clickable-status')) {
                badge.classList.add('clickable-status');
                badge.title = 'Click to toggle status';
                badge.style.cursor = 'pointer';
                badge.onclick = function() {
                    AdminPanel.toggleAttendanceStatus(this);
                };
            }
        });
    },

    // Add lost & found admin controls
    addLostFoundAdminControls: function() {
        const pageHeader = document.querySelector('.page-header');
        if (pageHeader && !document.querySelector('.admin-action-btn')) {
            const btnContainer = document.createElement('div');
            btnContainer.style.marginTop = '1rem';
            btnContainer.innerHTML = `
                <button class="admin-action-btn" onclick="AdminPanel.showAddLostFoundModal()">
                    ➕ Add Item
                </button>
            `;
            pageHeader.appendChild(btnContainer);
        }

        // Add edit/delete buttons to each item
        const lfCards = document.querySelectorAll('.lf-card');
        lfCards.forEach((card, index) => {
            if (!card.querySelector('.admin-controls')) {
                const controls = document.createElement('div');
                controls.className = 'admin-controls';
                controls.innerHTML = `
                    <button class="admin-control-btn edit" onclick="AdminPanel.editLostFoundItem(${index})" title="Edit">
                        ✏️
                    </button>
                    <button class="admin-control-btn delete" onclick="AdminPanel.deleteLostFoundItem(${index})" title="Delete">
                        🗑️
                    </button>
                    <button class="admin-control-btn resolve" onclick="AdminPanel.markAsResolved(${index})" title="Mark as Resolved">
                        ✓
                    </button>
                `;
                card.appendChild(controls);
            }
        });
    }
};

// Auto-initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    Auth.initAuthUI();
});