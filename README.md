# ne-fgc

HOSTING TODOS:
- Add permissions to AWS Secrets
    - Add dev secret access to Maintainer user account
    - Add prod secret access to ec2 instance role
    - Test that loading ENV variables from secrets manager is working
- Add "DB Migration Step" to deploy script
    - Add another docker command prior to the start command
    - check the migrate command's status before starting the new app
- Get App Working
    - Ensure DB Migration Script runs & works
    - Ensure App starts and runs
    - Create an account for myself on the site

TODO: 
- Account Management Page POLISH
    - Edit Account - load current state
    - Delete Account - might already be done?
- Login forms POLISH
    - keyboard accessibility
    - input validations

FEATURES:
- Events:
    - TO user role & permissions
    - Create/Edit buttons for TO's
    - Events CARD: Display in events list
    - Event View Page
- STRETCH:
    - Detect "live" events, embed the stream for a running event

- Mobile Responsive Events Page
    - Vertical events scrolling, maybe 2 x n
- Gear Management
    - Request Rental
    - Approve Rental
    - Deny Rental
    - Mark Returned
- Photo Gallery
    - Per Event?
    - Raw Gallery?
- Repairs and Commissions Requests

