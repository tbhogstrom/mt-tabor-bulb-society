# Mt Tabor Bulb Society Website

**Version:** 1.0
**Date:** January 19, 2026
**Author:** Tyler Falcon
**Status:** Draft

---

## Executive Summary

The Mt Tabor Bulb Society (MTBS) website will serve as the digital heart of community building in the Mt Tabor neighborhood, centered around a shared love of bulb gardening. The platform combines informational landing pages with an open community forum where neighbors can share bulb photos, exchange knowledge, and connect—all without requiring account verification to encourage maximum participation.

**Tagline:** *Growing Community / Community Grows*

---

## Background & Context

### Organizational Foundation

The Mt Tabor Bulb Society operates on three core pillars:
1. **Community** — Fostering bulb exchanges between neighbors
2. **Conservation** — Supporting native and heirloom bulb species
3. **Education** — Experimental test plots and knowledge sharing

### 2025 Goals (from Inaugural Meeting)
- Facilitate 100 bulb exchanges or gifts
- Organize annual bulb sale
- Establish master gardener talk series
- Recruit founding members and board members
- Explore 501(c)(3) designation

### Technical Context
The existing repository (`tbhogstrom/se-portland-contracting`) will be repurposed. The current content is a contracting company website—this PRD defines the complete replacement for MTBS purposes.

**Infrastructure:** Vercel deployment with Vercel Blob storage for user-uploaded images.

---

## Product Vision

Create the primary digital gathering space for Mt Tabor's bulb gardening community—a place that feels as welcoming as a neighbor's garden fence conversation, while providing the tools needed to grow the society from founding members to a thriving neighborhood institution.

### Design Philosophy
The website should evoke:
- **Organic warmth** — Natural textures, earthy tones, botanical illustration influences
- **Neighborhood authenticity** — Not corporate or slick; handmade and personal
- **Pacific Northwest character** — Mossy greens, rain-soft grays, volcanic soil browns
- **Vintage garden society** — Nod to historical horticultural societies and seed catalogs

---

## User Personas

### 1. Curious Neighbor (New Visitor)
> "I saw a sign about this at the farmers market. What is it?"

**Needs:** Quick understanding of what MTBS is, how to get involved, low barrier to participation

### 2. Active Gardener (Engaged Member)
> "I want to share what's blooming and see what others have planted."

**Needs:** Easy photo uploads, species identification help, exchange opportunities

### 3. Master Gardener / Expert (Knowledge Contributor)
> "I can help identify that—it's a Fritillaria meleagris."

**Needs:** Ability to comment, share expertise, potentially lead talks

### 4. Organizer (Board/Admin)
> "I need to remove that spam post and update the event info."

**Needs:** Content moderation, event management, membership tracking

---

## Feature Requirements

### Phase 1: Foundation (MVP)

#### 1.1 Landing Pages

**Homepage**
- Hero section with tagline and seasonal bulb imagery
- Three pillars explanation (Community, Conservation, Education)
- Featured recent forum posts (3-5 thumbnails)
- Upcoming events preview
- Call-to-action: "Share Your Blooms" → Forum

**About Page**
- Mission statement and core values
- Brief history / founding story
- Board members / key contributors (Sylvie Falcon, Kailey Falcon, LouAnn PearTree)
- 501(c)(3) status information (pending/in progress)

**Get Involved Page**
- Ways to participate:
  - Share photos on the forum
  - Attend events / talks
  - Offer or request bulb exchanges
  - Volunteer for experimental gardens
- Membership information (if applicable)
- Contact form or email

**Events Page**
- Upcoming events list (bulb walks, talks, sales)
- Past events archive
- Calendar integration (simple, possibly embedded Google Calendar)

**Resources Page** (can be Phase 2)
- Bulb identification guides
- Growing tips for PNW climate
- Links to master gardener resources
- Future home for "Bulb Flowers of Mt Tabor" identification deck

#### 1.2 Community Forum ("The Garden Fence")

**Core Concept:** An open, low-friction space for sharing bulb photos and conversation. Inspired by neighborhood bulletin boards—anyone can post, but there's a steward keeping things tidy.

**Post Creation (No Account Required)**
- Fields:
  - Photo upload (required) — max 10MB, JPEG/PNG/HEIC
  - Display name (required) — simple text, no validation
  - Caption/description (optional) — 500 char max
  - Neighborhood (optional dropdown) — Mt Tabor, Montavilla, Richmond, Division, Hawthorne, Sellwood, Other
  - "I think this is..." species guess (optional)
  - "Looking for ID help" checkbox
- Anti-spam: Simple honeypot field, rate limiting (1 post per minute per IP)

**Forum Feed**
- Grid or masonry layout of recent posts
- Filter by: Most Recent, Needs ID Help, Neighborhood
- Each post shows: Thumbnail, display name, neighborhood tag, timestamp, comment count
- Click to expand: Full image, all comments

**Comments (No Account Required)**
- Display name (required)
- Comment text (required) — 1000 char max
- Same anti-spam measures as posts
- Nested replies (1 level deep max)

**Image Storage**
- Vercel Blob storage for all uploaded images
- Automatic thumbnail generation (400px width for feed)
- Original preserved for detail view
- Metadata stored in simple JSON or lightweight database

#### 1.3 Moderation Tools

**Admin Access**
- Simple password-protected admin route (`/admin`)
- No complex user system in MVP; single shared admin password stored as environment variable

**Moderation Capabilities**
- View all posts with moderation status
- Delete post (soft delete — marks as hidden, preserves for review)
- Delete comment
- View deleted items log
- Simple stats: posts this week, comments this week

**Future Consideration:** Flag/report button for community members

---

### Phase 2: Growth Features

#### 2.1 Bulb Exchange Board
- "Offering" and "Seeking" listings
- Location/neighborhood
- Contact method (email, shown on request)
- Tracks toward "100 exchanges" goal

#### 2.2 Species Database
- Community-contributed bulb identification
- Photos linked to species entries
- Bloom time, growing conditions
- Foundation for "Bulb Flowers of Mt Tabor" deck

#### 2.3 Member Directory (Optional)
- Opt-in listing of active members
- Neighborhood, specialties/interests
- Requires simple account creation

#### 2.4 Event RSVP
- Simple RSVP for talks and walks
- Headcount management

#### 2.5 Experimental Gardens Map
- Map of community test plots
- Right-of-way gardens (Tyler's proposal)
- Container gardens at Montavilla Farmers Market (Kailey's proposal)

---

### Phase 3: Sustainability

#### 3.1 Membership / Donations
- If 501(c)(3) approved: donation integration
- Optional paid membership tiers

#### 3.2 Merchandise Showcase
- Embroidered hats
- Coffee mugs
- Identification deck sales

#### 3.3 Newsletter Integration
- Email signup
- Weekly/monthly digest of forum highlights

---

## Technical Specifications

### Stack

| Layer | Technology | Rationale |
|-------|------------|-----------|
| Framework | Next.js 14+ (App Router) | Vercel-native, good DX, React ecosystem |
| Hosting | Vercel | Free tier sufficient for MVP, easy deployment |
| Image Storage | Vercel Blob | Simple API, pay-per-use, integrated with Vercel |
| Database | Vercel KV or simple JSON files | Lightweight for MVP; can migrate to Postgres later |
| Styling | Tailwind CSS | Rapid development, easy theming |
| Auth (Admin) | Simple password middleware | MVP simplicity; upgrade to NextAuth later |

### Data Models

```typescript
// Post
interface ForumPost {
  id: string;                    // UUID
  imageUrl: string;              // Vercel Blob URL
  thumbnailUrl: string;          // Vercel Blob URL (resized)
  displayName: string;
  caption?: string;
  neighborhood?: Neighborhood;
  speciesGuess?: string;
  needsIdHelp: boolean;
  createdAt: Date;
  isDeleted: boolean;
  deletedAt?: Date;
  deletedBy?: string;            // Admin identifier
}

// Comment
interface Comment {
  id: string;
  postId: string;
  parentCommentId?: string;      // For single-level nesting
  displayName: string;
  content: string;
  createdAt: Date;
  isDeleted: boolean;
}

// Neighborhood enum
type Neighborhood =
  | 'mt-tabor'
  | 'montavilla'
  | 'richmond'
  | 'division'
  | 'hawthorne'
  | 'sellwood'
  | 'other';
```

### API Routes

```
POST   /api/posts              Create new post (with image upload)
GET    /api/posts              List posts (paginated, filtered)
GET    /api/posts/[id]         Get single post with comments
DELETE /api/posts/[id]         Admin: soft delete post

POST   /api/posts/[id]/comments     Add comment to post
DELETE /api/comments/[id]           Admin: delete comment

POST   /api/admin/login        Validate admin password
GET    /api/admin/stats        Dashboard statistics
```

### Image Handling

```typescript
// Upload flow
1. Client sends image to /api/posts
2. Server validates file type and size
3. Image uploaded to Vercel Blob
4. Sharp (or similar) generates thumbnail
5. Both URLs stored in database
6. Response returns post with image URLs
```

### Security Considerations

- Rate limiting on all POST endpoints (1 req/min per IP for posts, 5/min for comments)
- Honeypot fields for bot detection
- Content-Security-Policy headers
- Admin routes protected by middleware checking session cookie
- No user data beyond display names (GDPR-friendly)
- Vercel Blob URLs are not guessable but are public once known

---

## Design Direction

### Color Palette

| Role | Color | Hex | Notes |
|------|-------|-----|-------|
| Primary | Volcanic Soil | `#3D2B1F` | Deep brown, Mt Tabor earth |
| Secondary | Moss Green | `#4A5D23` | PNW forest floor |
| Accent | Crocus Purple | `#7B4B94` | First spring blooms |
| Accent 2 | Daffodil Gold | `#D4A029` | Classic bulb color |
| Background | Parchment | `#F5F1E6` | Aged seed catalog |
| Text | Charcoal | `#2C2C2C` | High contrast |

### Typography

- **Headlines:** Serif with character (e.g., Fraunces, Playfair Display, or similar)
- **Body:** Clean readable sans (e.g., Source Sans Pro, Lato)
- **Accents:** Handwritten or script for quotes, callouts (sparingly)

### Visual Elements

- Botanical illustration style for icons and decorative elements
- Subtle paper/parchment textures
- Rounded corners (organic feel)
- Generous whitespace
- Photo-forward layouts (the community's images are the stars)

### Inspiration Sources

- Vintage seed catalogs (Burpee, Baker Creek)
- Victorian horticultural society publications
- Portland Audubon Society aesthetic
- Ladd's Addition rose garden signage

---

## Success Metrics

### Phase 1 (3 months post-launch)

| Metric | Target | Measurement |
|--------|--------|-------------|
| Forum posts | 50+ | Database count |
| Unique visitors | 200+/month | Vercel Analytics |
| Community engagement | 100+ comments | Database count |
| Admin actions | <5% deletion rate | Healthy community indicator |

### Phase 2 (6 months)

| Metric | Target | Measurement |
|--------|--------|-------------|
| Bulb exchanges facilitated | 50 (toward 100 goal) | Exchange board tracking |
| Event RSVPs | 20+/event | RSVP system |
| Newsletter signups | 100+ | Email list |

---

## Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Spam posts | Medium | High | Honeypot, rate limiting, active moderation |
| Low initial engagement | Medium | Medium | Promote at farmers market, yard signs, word of mouth |
| Image storage costs | Low | Medium | Vercel Blob is cheap; can add size limits if needed |
| Single admin burnout | Medium | High | Recruit 2-3 moderators early; simple tools |
| Inappropriate content | Low | High | Clear community guidelines, responsive moderation |

---

## Open Questions

1. **Membership structure** — Free forum access with paid membership for events? Or everything free and donation-supported?

2. **Species verification workflow** — How do expert IDs get "confirmed"? Badge system? Or keep it conversational?

3. **Contact method** — Contact form vs. public email? Privacy considerations.

4. **Mobile app** — Progressive Web App (PWA) sufficient, or native app later?

5. **Integration with existing community** — Any existing Facebook groups, Nextdoor presence to connect with?

---

## Implementation Roadmap

### Sprint 1 (Weeks 1-2): Foundation
- [ ] Repository setup, Vercel project configuration
- [ ] Basic Next.js structure with App Router
- [ ] Tailwind configuration with custom theme
- [ ] Homepage layout (static content)
- [ ] About page

### Sprint 2 (Weeks 3-4): Forum Core
- [ ] Vercel Blob integration
- [ ] Post creation form with image upload
- [ ] Forum feed display
- [ ] Basic post detail view

### Sprint 3 (Weeks 5-6): Interaction
- [ ] Comment system
- [ ] Filtering and search
- [ ] Rate limiting and spam protection

### Sprint 4 (Weeks 7-8): Admin & Polish
- [ ] Admin authentication
- [ ] Moderation dashboard
- [ ] Community guidelines page
- [ ] Mobile responsiveness
- [ ] Launch prep

### Post-Launch
- [ ] Monitor and iterate based on usage
- [ ] Begin Phase 2 features based on community feedback

---

## Appendix

### A. Competitive/Inspirational Analysis

**iNaturalist** — Species ID community; good model for "needs help" workflow
**GardenTags** — Social garden sharing; overly complex for our needs
**Nextdoor** — Neighborhood focus; too broad, not garden-specific
**Reddit r/gardening** — High engagement; anonymous posting works

### B. Content Needed for Launch

- [ ] Mission statement (final version)
- [ ] Board member bios and photos
- [ ] Community guidelines
- [ ] 3-5 seed posts for forum (founding members' gardens)
- [ ] Hero images for homepage
- [ ] Event calendar initial entries

### C. Related Materials (Future)

- "Bulb Flowers of Mt Tabor" identification deck
- Embroidered hats design
- Promotional signage for recruitment

---

*Document prepared for Mt Tabor Bulb Society*
*Growing Community / Community Grows*
