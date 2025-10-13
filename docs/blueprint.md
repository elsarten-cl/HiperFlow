# **App Name**: CRM HiperFlow

## Core Features:

- Contact Management: Create, read, update, and delete contact information with teamId scoping, linking contacts to companies and deals. Inbound webhook processing via Make/n8n.
- Company Management: Manage company profiles, associating them with contacts and deals.  Trigger webhooks for contact creation and deal updates, enabling automated workflows.
- Deal Pipeline: Visualize sales pipelines using a Kanban interface, track deal progress across stages. Enforce security rules and HMAC signatures for webhook payloads to ensure data integrity and authenticity.
- Activity Logging: Log all customer interactions, linking activities to contacts and deals.
- Unified Inbox: A centralized messaging hub to manage conversations across multiple channels (Meta, WhatsApp).  Utilize Firebase Authentication and App Check to secure the application and its users.
- AI-Assisted Automation: Tool to schedule social media posts with Gemini-powered content generation, contact enrichment via Gemini and Make/n8n integrations.
- Webhook Integration: Bi-directional API layer for Make/n8n to ingest data (leads, webhooks, messages) and automate actions (publishing posts, updating pipelines, sending notifications). Outbound webhooks enable the CRM to send real-time updates to external systems.

## Style Guidelines:

- Primary color: Electric green (#11E44F) to reflect energy, growth, and action, especially for calls to action.
- Background color: Deep charcoal (#0A0A0A) providing a sleek, modern feel that enhances the vibrancy of the primary color and supports comfortable readability.
- Accent color: Forest green (#0FAF3A) for interactive elements or states, creating subtle but noticeable highlights and transitions. Apply subtle primary color opacities on the dark background for shadows.
- Branding font: 'Stentiga' (sans-serif). Used in headers, titles, logotypes, and hero sections.
- Body font: 'Inter' (sans-serif) for primary body copy and forms for excellent readability across all UI elements.
- Secondary headers: 'Space Grotesk' (sans-serif) for technical or subheader elements.
- Code Font: 'Source Code Pro' (monospace) is included to display technical information.
- Use minimalistic iconography in white or electric green to maintain a clean and modern aesthetic.
- Employ a card-based layout with a clear visual hierarchy and generous spacing to improve usability and readability.
- Implement smooth transitions (0.2–0.3s) on buttons and interactive elements to enhance user experience.