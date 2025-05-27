# Edora - Moderator Role & UI Improvements (changes4.md) May 27

## Backend Changes

- **User Model:**
  - Added a `role` field to the `User` model (`user`, `moderator`, `admin`).
- **Registration:**
  - Allow setting the `role` during registration (for dev/admin use only).
- **/auth/me Endpoint:**
  - Now returns the user's `role` in the response.
- **Moderator Permissions:**
  - Added a `require_moderator` dependency to restrict deleting posts and channels to moderators/admins.
  - Updated `/posts/{post_id}` and `/channels/{channel_id}` DELETE endpoints to require moderator/admin.
- **Database Migration:**
  - Alembic migration to add the `role` column to the `user` table.

## Frontend Changes

- **User Role State:**
  - Store the user's role in app state after login and on page load.
- **Moderator UI:**
  - Show delete buttons for channels and posts only if the user is a moderator or admin.
  - Pass `userRole` as a prop to relevant components.
- **Channel Delete Button:**
  - Moved to the bottom right of the channel card, styled with a red gradient and soft edges.
  - Added a dynamic hover/focus effect (gradient intensifies, shadow, scale up).
- **Post Delete Button:**
  - Shown in the post detail view header for moderators/admins.
- **General:**
  - All delete actions prompt for confirmation and update the UI on success.

# Changes to Upload UI (Recent Improvements)

- Upload form now has no background box—just floating fields and header.
- Inputs use floating labels with extra space for clarity.
- Submit button is large, rounded, and modern, with a blue gradient and smooth hover effect.
- Edora purple-blue color scheme throughout.
- Upload icon/logo removed for a cleaner look.

**Summary:**
- Edora now supports moderator/admin accounts with the ability to delete channels and posts, and the UI clearly reflects these permissions with modern, dynamic buttons. 