You are designing a high-fidelity UI mockup (no backend, no real authentication) for a B2B customer portal onboarding system.

Important:
This is NOT a normal signup/login website.

This is an approval-gated portal.
Users must request access and wait for manual approval before they can use the dashboard.

Your task is ONLY to create the full UI/UX flow and all screens, including states and transitions.

Design style:
Professional SaaS vendor portal (similar seriousness as a banking, supplier, or wholesale ordering portal).
Clean layout, generous whitespace, clear typography hierarchy, neutral color palette, strong readability, accessible contrast.
Avoid playful, social media, or startup landing-page aesthetics.
No glassmorphism, no neon gradients, no marketing hero sections.

Create the following screens in order and connect them as a user journey:

---

1. LOGIN PAGE

---

Elements:
• Logo area
• Page title: "Customer Portal"
• Email input
• Password input
• Remember me checkbox
• Primary button: "Log in"

Below the form include:
• Link: "Request Access"
• Link: "Forgot password?"

UX behaviors (visual only, no backend):
If user tries to log in with a non-approved account, show inline message:
"Your account is awaiting approval. You will gain access once our team verifies your request."

Validation examples:
• empty email
• invalid email format
• incorrect password

Do NOT show "user does not exist".

---

2. REQUEST ACCESS PAGE

---

Title:
"Request Customer Portal Access"

Intro text:
"This portal is restricted to verified customers. Submit your details and our team will activate your account."

Fields:
• Full Name
• Company / Business Name
• Work Email
• Phone Number
• Create Password
• Confirm Password
• Terms agreement checkbox

Primary button:
"Submit Access Request"

Important behavior:
Submitting does NOT log the user in.
Instead it transitions to the Pending Approval screen.

---

3. ACCESS REQUEST SUBMITTED (SUCCESS STATE)

---

Immediately after form submission show a confirmation transition and redirect to the waiting screen.

---

4. PENDING APPROVAL PAGE (CRITICAL SCREEN)

---

This is the core of the product.

Layout:
Centered card or panel with a success illustration/icon.

Headline:
"Your access request has been received"

Body text:
"Our team is reviewing your details. Once approved, your portal access will automatically unlock."

Status panel:
Account Status: Pending Review

Add reassurance text:
"This usually takes a few hours during business days."

Include:
• support email
• "You may close this page. We will notify you."

Simulate behavior (mock only):
After ~10–15 seconds automatically transition to Approved state screen.

---

5. APPROVED STATE

---

The same page visually updates:

Status changes to:
Account Status: Approved

Show a success message:
"Your account has been approved. Redirecting to your dashboard…"

After 2 seconds transition to dashboard.

No login form again.

---

6. DASHBOARD (LOCKED DEMO)

---

Simple placeholder dashboard showing the user now has access.

Include:
Sidebar navigation:
• Dashboard
• Quotes
• Orders
• Account

Main panel:
Welcome message:
"Welcome to the Customer Portal"

Show a small onboarding info box explaining what users can do in the portal.

---

## ADDITIONAL UX DETAILS

Also design:
• Loading states
• Button disabled states
• Field error messages
• Form success confirmation
• Responsive mobile layout

Microcopy tone:
Professional, reassuring, and clear. Avoid technical terms like authentication, API, session, or database.

Goal:
Produce a complete clickable mockup of a manual-approval customer onboarding portal demonstrating the full lifecycle:
Visitor → Access Request → Pending → Approved → Dashboard
