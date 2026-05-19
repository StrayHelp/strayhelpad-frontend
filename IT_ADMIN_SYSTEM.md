# IT Admin System - Implementation Guide

## Overview
A comprehensive IT Admin dashboard and login system has been created for the StrayHelp platform. This system allows IT Administrators to manage user accounts, view audit logs, and perform critical account management operations.

## Features Implemented

### 1. **Enhanced Login Page**
- **Role Selection**: Users can now select between "Super Admin" and "IT Admin" roles during login
- **Design**: Maintains the existing clean SaaS-style interface with role selector buttons
- **Location**: `src/pages/LoginPage.jsx`

### 2. **IT Admin Dashboard**
- **Statistics Cards**:
  - Total Accounts count
  - Active Accounts count
  - Suspended Accounts count
  - Recent Changes count
- **Account Status Overview**: Visual progress bars showing active vs. suspended account ratios
- **Quick Actions**: Links to account management and audit log
- **Location**: `src/pages/ITAdminDashboardPage.jsx`

### 3. **Account Management Page**
- **Features**:
  - View all system accounts in a paginated table
  - Search accounts by name or email
  - Filter accounts by status (All, Active, Suspended)
  - Pagination controls (Next/Previous)
  - View account details in a modal
  - Update account email addresses
  - Reset account passwords (generates temporary password)
  - Enable/disable (suspend/activate) accounts
  - Confirmation dialogs for sensitive operations
  - Toast notifications for success/error feedback

- **Table Columns**:
  - Name
  - Email
  - Role
  - Joined Date
  - Status (with color-coded badge)
  - Actions menu (⋯)

- **Location**: `src/pages/ITAdminAccountsPage.jsx`

### 4. **Audit Log Page**
- **Features**:
  - Timeline view of all administrative actions
  - Filter by action type
  - Search functionality
  - Detailed audit trail with:
    - Action performed
    - Account affected
    - Administrator who performed the action
    - Timestamp
    - Action details

- **Action Types Tracked**:
  - Account Suspended
  - Password Reset
  - Email Updated
  - Account Activated

- **Location**: `src/pages/ITAdminAuditLogPage.jsx`

## Components Created

### Core Components
Located in `src/components/itadmin/`:

1. **ConfirmationDialog.jsx**
   - Reusable confirmation modal for sensitive actions
   - Supports both standard and dangerous (red) actions
   - Props: title, message, confirmText, cancelText, isDangerous, onConfirm, onCancel, isLoading

2. **PasswordResetModal.jsx**
   - Displays temporary password after reset
   - One-time display warning
   - Copy to clipboard functionality
   - Props: isOpen, accountName, tempPassword, onClose

3. **AccountDetailsModal.jsx**
   - Full account information display
   - Editable email field with inline save/cancel
   - Status toggle (Active/Suspended) button
   - Account metadata (role, creation date, last login)
   - Password reset action
   - Scrollable for mobile devices

4. **StatusBadge.jsx**
   - Reusable status indicator component
   - Shows "● Active" (green) or "● Suspended" (red)
   - Configurable size (sm, md, lg)

5. **Toast.jsx**
   - Notification component
   - Types: success, error, warning, info
   - Auto-dismisses after 3 seconds
   - Customizable duration

### Layout Component
- **ITAdminLayout.jsx** (`src/components/ITAdminLayout.jsx`)
  - Similar structure to the main Layout component
  - Sidebar navigation with IT Admin specific routes:
    - Dashboard
    - Accounts
    - Audit Log
  - Professional header with search and profile menu
  - Responsive design (toggleable sidebar)
  - Logout functionality

## Service Methods

### IT Admin Service (`src/services/itAdminService.js`)

```javascript
// Account Management
fetchAccounts(page, limit, search, filters) - Get paginated account list
fetchAccountDetails(accountId) - Get full account details
updateAccountEmail(accountId, newEmail) - Update account email
resetAccountPassword(accountId) - Generate temporary password
updateAccountStatus(accountId, status) - Activate/Suspend account
fetchAccountAudit(accountId, page, limit) - Get audit trail for an account
fetchITAdminDashboard() - Get dashboard statistics
```

## Routing

New IT Admin routes added to `src/App.jsx`:

```
/it-admin/dashboard     - IT Admin Dashboard
/it-admin/accounts      - Account Management
/it-admin/audit         - Audit Log
```

Role-based access control ensures:
- Super Admin users are redirected to `/dashboard`
- IT Admin users are redirected to `/it-admin/dashboard`
- Users without authentication are redirected to `/login`

## Design & Styling

### Color Palette (Consistent with existing design)
- Primary: `#77806d` (Sage Green)
- Dark: `#66715b` (Darker Sage)
- Text: `#2c3226` (Dark Gray)
- Border: `#e2e6dc` (Light Gray)
- Background: `#f5f7f3` (Off White)
- Success: `#10b981` (Green)
- Error: `#ef4444` (Red)
- Suspended: `#fca5a5` (Light Red)

### Typography & Components
- Cards: Rounded corners (2rem), white background, subtle shadow
- Buttons: Consistent padding, hover effects, disabled states
- Tables: Grid layout with alternating hover states
- Modals: Backdrop blur, scrollable content area
- Badges: Inline color-coded status indicators

## Security Features

1. **Confirmation Dialogs**
   - Required for sensitive operations (password reset, account suspension)
   - Clearly labeled dangerous operations in red
   - Loading state during operation

2. **Temporary Password Display**
   - Displayed only once
   - Copy-to-clipboard functionality
   - Clear warning about changing on first login

3. **Session Management**
   - Secure logout with token cleanup
   - Local storage management for admin info and role
   - Role-based access control at route level

4. **Audit Trail**
   - All administrative actions logged
   - Timeline view with details
   - Searchable and filterable

## Translations

Added translations for IT Admin features in `src/utils/translations.js`:

### Supported Languages
- English (en)
- Filipino (fil)
- Spanish (es)

### New Translation Keys
- `pageITAdminDashboard`
- `navAccounts`
- `navAuditLog`
- `role` (for login page role selector)
- Account management specific terms
- Status descriptions
- Confirmation messages

## How to Use

### For Users with IT Admin Role

1. **Login**
   - Navigate to login page
   - Select "IT Admin" from role selector
   - Enter credentials
   - Redirected to IT Admin Dashboard

2. **Dashboard**
   - View account statistics
   - See account status overview
   - Access quick action links

3. **Manage Accounts**
   - Search and filter accounts
   - Click row action menu (⋯) to view details
   - Update email addresses
   - Reset passwords (generates temporary password)
   - Suspend or activate accounts
   - All sensitive operations require confirmation

4. **View Audit Log**
   - See timeline of all administrative actions
   - Filter by action type
   - Search by account or action details

### Navigation

The IT Admin sidebar provides quick access to:
- Dashboard (home icon)
- Accounts (users icon)
- Audit Log (report icon)

Sidebar can be toggled to collapse/expand for more screen space.

## API Endpoints Expected

The system expects the following backend API endpoints:

```
GET  /api/it-admin/dashboard
GET  /api/it-admin/accounts?page=1&limit=10&search=&status=
GET  /api/it-admin/accounts/:id
PUT  /api/it-admin/accounts/:id/email
POST /api/it-admin/accounts/:id/reset-password
PUT  /api/it-admin/accounts/:id/status
GET  /api/it-admin/accounts/:id/audit?page=1&limit=20
```

## Customization Options

### Adding More Account Fields
1. Update `AccountDetailsModal.jsx` to show additional fields
2. Modify the API service to fetch new data
3. Update translations for new field labels

### Changing Colors
Edit `src/utils/colors.js` or update Tailwind classes in components

### Adjusting Pagination
Modify `limit` state in `ITAdminAccountsPage.jsx` (default: 10 items per page)

### Adding More Actions
Extend the confirmation dialog type system in `ITAdminAccountsPage.jsx`

## Performance Considerations

- **Lazy Loading**: Account list is paginated to avoid loading all accounts at once
- **Search Debouncing**: Consider adding debouncing to search input for better performance
- **Caching**: Current implementation fetches fresh data on each action (consider caching if needed)
- **Modal Performance**: Details modal loads on demand to keep initial render fast

## Future Enhancements

1. **Bulk Actions**
   - Select multiple accounts for batch operations
   - Bulk email updates or status changes

2. **Advanced Filtering**
   - Date range filters for created/last login
   - Role-based filtering
   - Custom filter combinations

3. **Reporting**
   - Generate audit reports
   - Export account lists to CSV
   - Activity statistics graphs

4. **Notifications**
   - Email notifications for sensitive actions
   - Admin activity alerts
   - Dashboard notifications

5. **Account Grouping**
   - Create account groups/teams
   - Manage group permissions
   - Batch operations on groups

## Troubleshooting

### Accounts Not Displaying
- Check if API endpoint `/api/it-admin/accounts` is working
- Verify authentication token is being sent
- Check browser console for API errors

### Modal Not Opening
- Ensure component state is properly initialized
- Check if parent component is passing required props
- Verify isOpen prop is being set to true

### Styling Issues
- Clear browser cache and rebuild
- Verify Tailwind CSS is properly configured
- Check for conflicting CSS classes

## Files Created/Modified

### New Files Created
- `/src/pages/ITAdminDashboardPage.jsx`
- `/src/pages/ITAdminAccountsPage.jsx`
- `/src/pages/ITAdminAuditLogPage.jsx`
- `/src/components/ITAdminLayout.jsx`
- `/src/components/itadmin/ConfirmationDialog.jsx`
- `/src/components/itadmin/Toast.jsx`
- `/src/components/itadmin/PasswordResetModal.jsx`
- `/src/components/itadmin/AccountDetailsModal.jsx`
- `/src/components/itadmin/StatusBadge.jsx`
- `/src/services/itAdminService.js`

### Files Modified
- `/src/pages/LoginPage.jsx` - Added role selector
- `/src/App.jsx` - Added IT Admin routes and role-based access control
- `/src/utils/translations.js` - Added IT Admin translations

---

**Version**: 1.0  
**Last Updated**: May 2026  
**Status**: Ready for Integration with Backend API
