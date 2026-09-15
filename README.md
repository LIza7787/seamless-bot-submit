# OxynHost Launchpad

Create a modern, sleek, minimalist, and ultra-fast landing page for a next-gen cloud hosting platform named "OxynHost".

Design & Aesthetic Guidelines:

- Theme: Ultra-clean Dark Mode (background `#0B0F17` with subtle deep cyan/blue blur effects `#06B6D4` and `#3B82F6`).

- Visual Style: Minimalist tech SaaS, smooth glassmorphism, glowing micro-borders, sharp high-contrast typography using Tailwind CSS and Lucide icons.

- Responsive: Perfectly adapted for desktop, tablet, and mobile displays.

Page Structure:

1. Header / Navbar:

   - Logo: "⚡ OxynHost" with a subtle cyan glow.

   - Nav items: "Services", "Domain Check", "Pricing", "AI Diagnostics", "Docs".

   - Right Action Buttons: "Log In" (ghost button) and "Deploy Now" (Primary glowing accent button).

2. Hero Section (Split Layout):

   - Left side:

     - Badge: "⚡ NVMe KVM Powered Infrastructure".

     - Main Title: "High-Performance Cloud Hosting with Zero Setup Complexity".

     - Subtitle: "Deploy your websites and applications in seconds with automated Anti-DDoS protection, 99.99% uptime, and smart AI server diagnostics."

     - Domain Search Widget (Glassmorphism Card):

       - Input field: "Search domain (e.g. project.oxyn)..."

       - Action button: "Check Availability".

       - Underneath pricing pills: ".com £8.99/yr", ".io £24.99/yr", ".dev £10.99/yr", ".uk £4.99/yr".

   - Right side:

     - A stylized minimalist Dashboard / Terminal preview card.

     - Live metrics pills: "Status: Operational 🟢", "Deploy speed: 1.2s ⚡", "DDoS Shield: Active 🛡️".

     - A small animated code snippet showing a fast git-push deployment to server.

3. Trust & Stats Bar:

   - Floating dark strip with soft borders containing 4 key metrics:

     1. "99.99%" Uptime SLA

     2. "< 8ms" Global Latency

     3. "120K+" Active Projects Hosted

     4. "24/7/365" Expert Support

4. Key Features Grid (3 Columns):

   - Section Header: "Built on Enterprise-Grade Hardware".

   - Card 1: "KVM Virtualization" — Enterprise-grade hardware VPS for general purpose computing with automated backups.

   - Card 2: "Robust Anti-DDoS" — Continuous real-time traffic filtering with automatic mitigation.

   - Card 3: "Oxyn AI Diagnostics" — Built-in AI log analyzer for zero-downtime server performance optimization.

5. Interactive Pricing Section (Updated Tariffs):

   - Title: "Affordable & Transparent Infrastructure".

   - Subtitle: "High performance enterprise hardware without hidden fees."

   - Toggle Switch: Interactive switcher between "Monthly" and "Yearly (Save 20%)".

   - 3 Pricing Cards:

     - Plan 1: "Website Hosting" — Starting from £1.99/mo (Managed by Plesk, high performance, DDoS protected, perfect for personal and commercial sites).

     - Plan 2 (POPULAR / HIGHLIGHTED): "Virtual Servers (VPS)" — Starting from £2.99/mo (KVM based, enterprise-grade hardware, automated backups, full root control).

     - Plan 3: "Dedicated Servers" — Starting from £29.99/mo (High performance bare-metal servers managed by TenantOS control panel for extreme demands).

   - Each card has a "Order Now" button that opens the Purchase Modal.

6. Order Modal & Telegram Integration (Secure via Supabase Edge Function):

   - Clicking "Order Now" on any plan opens an interactive Order Modal.

   - Form Fields:

     - Selected Plan (Pre-filled dropdown: Website Hosting, Virtual Servers, or Dedicated Servers).

     - Customer Name.

     - Contact Detail (Email or Telegram username).

     - Math Captcha (e.g., dynamic "What is 4 + 3?" validation).

   - Submission Logic:

     - Validate captcha locally. If incorrect, show an error toast.

     - Set up a secure Supabase Edge Function named "send-telegram-order" to handle sending notifications to Telegram so secrets remain hidden.

     - Form payload dispatches message format:

       "🚀 New OxynHost Order!

       • Plan: {selectedPlan}

       • Name: {customerName}

       • Contact: {customerContact}"

     - Show a success toast notification "Order sent successfully! We will contact you shortly." and close modal.

7. Call to Action Banner & Footer:

   - CTA Container: "Ready to migrate to OxynHost?" with button "Get Started Now".

   - Clean 4-column Footer with copyright "© 2026 OxynHost Inc. All rights reserved." and social icons (GitHub, Telegram, Twitter).

Interactivity Requirements:

- Domain search button shows a dynamic toast notification "Domain is available!".

- Pricing toggle switch dynamically recalculates monthly vs yearly prices.

- All interactive elements have smooth scale/hover animations.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/d342d404-1228-4155-b748-a557fbf96f94).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
