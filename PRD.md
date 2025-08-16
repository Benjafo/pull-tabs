# Product Requirements Document: Digital Pull Tab Game Simulator

## 1. Product Overview

### 1.1 Product Vision

Create an authentic digital simulation of physical pull tab lottery tickets featuring a pirate treasure theme. The application will replicate the real pull tab experience from purchase through tab removal, complete with realistic odds and predetermined winner distribution.

### 1.2 Core Objectives

- Simulate authentic pull tab mechanics and odds
- Provide engaging visual experience with animations
- Track user statistics and game progress
- Maintain game state persistence across sessions

## 2. Game Mechanics

### 2.1 Pull Tab Structure

- **Ticket Dimensions:** Digital representation of 2"x3" portrait-oriented ticket
- **Tab Configuration:** 5 tabs arranged vertically, each covering 3 symbols
- **Total Symbol Positions:** 15 (3 symbols × 5 tabs)
- **Symbols:** Skull, Treasure, Ship, Anchor, Compass, Map

### 2.2 Winning Combinations

All winning combinations require consecutive Skull-Skull-X patterns on specific winning lines:

| Prize | Pattern              | Winning Line Location                                         |
| ----- | -------------------- | ------------------------------------------------------------- |
| $100  | Skull-Skull-Skull    | Any of the 5 lines (positions 1-3, 4-6, 7-9, 10-12, or 13-15) |
| $50   | Skull-Skull-Treasure | Any of the 5 lines                                            |
| $20   | Skull-Skull-Ship     | Any of the 5 lines                                            |
| $10   | Skull-Skull-Anchor   | Any of the 5 lines                                            |
| $5    | Skull-Skull-Compass  | Any of the 5 lines                                            |
| $2    | Skull-Skull-Map      | Any of the 5 lines                                            |

### 2.3 Game Box Distribution

- **Box Size:** 500 tickets per game box
- **Ticket Cost:** $1 per ticket (simulated)
- **Total Revenue:** $500 per box
- **Total Payout:** $375 per box (75% return rate)

**Winner Distribution:**

- 1× $100 winner
- 2× $20 winners
- 5× $10 winners
- 5× $5 winners
- 48× $2 winners
- 65× $1 winners
- 375× losing tickets

**Total Winners:** 125 tickets (25% win rate)

## 3. User Experience Flow

### 3.1 Game Sequence

1. **Purchase Phase:** User clicks "Buy Ticket" button
2. **Front View:** Display ticket front with pirate theme, prize table, and winning combinations
3. **Flip Animation:** User clicks to flip ticket, revealing back with 5 unopened tabs
4. **Tab Removal:** User clicks each tab individually to reveal underlying symbols with peel animation
5. **Win Detection:** Automatic checking after each tab removal
6. **Results Display:** Show winnings and update statistics

### 3.2 Visual Design Requirements

#### 3.2.1 Ticket Front

- Pirate treasure map background design
- Rich blues and golds color scheme
- Prize table showing all winning combinations and payouts
- Decorative elements: gold coins, treasure chests, palm trees

#### 3.2.2 Ticket Back

- 5 vertically arranged perforated tabs
- Pirate theme continuation
- Clear visual indication of clickable tabs
- Hidden symbols beneath each tab

#### 3.2.3 Animations

- **Flip Animation:** Smooth 3D-style card flip from front to back
- **Tab Peel Animation:** Realistic peeling effect when removing tabs
- **Win Celebration:** Visual feedback for winning combinations
- **Symbol Reveal:** Smooth transition when uncovering symbols

## 4. User Interface Components

### 4.1 Main Game Area

- **Ticket Display:** Central focus with responsive sizing for desktop
- **Action Buttons:** Buy Ticket, Flip Ticket (context-sensitive)
- **Current Winnings:** Real-time display of accumulated winnings from current ticket

### 4.2 Game Status Panel

- **Box Progress:** Small tracker showing remaining tickets in current box (e.g., "347/500 remaining")
- **Position:** Bottom corner of screen, always visible

### 4.3 Statistics Dashboard

- **Tickets Played:** Total lifetime tickets purchased
- **Total Winnings:** Cumulative winnings across all sessions
- **Biggest Win:** Highest single ticket payout
- **Win Rate:** Percentage of winning tickets
- **Current Session:** Stats for current play session

### 4.4 Game Box Management

- **Auto-Renewal:** Automatic new box initialization when current box is depleted
- **Box History:** Track completed boxes and their performance

## 5. Technical Requirements

### 5.1 Technology Stack

- **Frontend:** React with TypeScript
- **Backend:** Express.js with TypeScript
- **Database:** PostgreSQL with Sequelize ORM
- **Authentication:** JWT (JSON Web Tokens)
- **State Management:** React Context or Redux for game state
- **Animations:** CSS animations or React Spring

### 5.2 Database Schema

#### 5.2.1 Users Table

```sql
id (Primary Key)
email (String, unique)
password_hash (String)
created_at (Timestamp)
last_login (Timestamp)
```

#### 5.2.2 Game Boxes Table

```sql
id (Primary Key)
total_tickets (Integer, default 500)
remaining_tickets (Integer)
winners_remaining (JSON object with prize breakdown)
created_at (Timestamp)
completed_at (Timestamp, nullable)
```

#### 5.2.3 Tickets Table

```sql
id (Primary Key)
user_id (Foreign Key to Users)
game_box_id (Foreign Key)
symbols (Array of 15 integers representing symbol positions)
winning_lines (JSON array of winning combinations)
total_payout (Decimal)
is_winner (Boolean)
created_at (Timestamp)
```

#### 5.2.4 User Statistics Table

```sql
id (Primary Key)
user_id (Foreign Key to Users, unique)
tickets_played (Integer, default 0)
total_winnings (Decimal, default 0)
biggest_win (Decimal, default 0)
sessions_played (Integer, default 0)
last_played (Timestamp)
created_at (Timestamp)
updated_at (Timestamp)
```

### 5.3 Core Algorithms

#### 5.3.1 Ticket Generation Algorithm

```typescript
function generateTicket(gameBox: GameBox): Ticket {
  // 1. Determine if ticket is winner based on remaining winners in box
  // 2. If winner, select prize level and generate appropriate symbol pattern
  // 3. If loser, generate pattern with no winning combinations
  // 4. Fill remaining positions with random symbols
  // 5. Update game box winner counts
}
```

#### 5.3.2 Win Detection Algorithm

```typescript
function checkWinningLines(symbols: Symbol[]): WinResult[] {
  const winningLines = [
    [0, 1, 2], // Tab 1
    [3, 4, 5], // Tab 2
    [6, 7, 8], // Tab 3
    [9, 10, 11], // Tab 4
    [12, 13, 14], // Tab 5
  ];

  // Check each line for Skull-Skull-X patterns
  // Return array of wins with prize amounts
}
```

### 5.4 API Endpoints

```typescript
// Authentication
POST /api/auth/register      // User registration
POST /api/auth/login         // User login
POST /api/auth/logout        // User logout
GET  /api/auth/verify        // Verify JWT token

// Game endpoints (require authentication)
POST /api/tickets/purchase   // Purchase new ticket
GET  /api/tickets/:id        // Get ticket details
POST /api/tickets/:id/reveal // Reveal tab symbols
GET  /api/stats             // Get user statistics
GET  /api/gamebox/current   // Get current game box status

// User management
GET  /api/user/profile      // Get user profile
PUT  /api/user/profile      // Update user profile
```

### 5.5 Authentication Implementation

- **JWT Storage**: Store JWT tokens in httpOnly cookies for security
- **Token Expiration**: 24-hour token expiration with refresh mechanism
- **Protected Routes**: All game-related endpoints require valid JWT
- **Middleware**: Express middleware for token validation
- **Frontend**: Automatic token refresh and redirect to login on expiration

### 5.6 User Experience Updates

- **Landing Page**: Login/Register form before accessing game
- **Guest Mode**: Optional anonymous play with limited features
- **Profile Management**: Basic user profile with email management
- **Persistent Progress**: All statistics and game progress tied to user account

## 6. Performance Requirements

- **Load Time**: Initial page load under 2 seconds
- **Animation Smoothness**: 60fps for all animations
- **Response Time**: API calls under 200ms
- **Browser Support**: Modern desktop browsers (Chrome, Firefox, Safari, Edge)

## 7. Data Persistence

- **Game State**: All game box states, ticket purchases, and user statistics persist across browser sessions
- **User Authentication**: JWT-based authentication with secure token storage
- **Backup Strategy**: Regular database backups to prevent loss of game progression

## 8. Future Enhancements (Out of Scope for MVP)

- Multiple game themes beyond pirate treasure
- Leaderboards and social features
- Mobile responsive design
- Sound effects and enhanced audio
- Different ticket price points and game variations

## 9. Development Phases

#### Phase 1: Backend Foundation

**Deliverables:**

- Express.js server setup with TypeScript
- PostgreSQL database setup with Sequelize ORM
- Database schema implementation (Users, Game Boxes, Tickets, User Statistics tables)
- JWT authentication system implementation
- Basic API endpoint structure
- User registration and login functionality
- Database connection and basic CRUD operations

**Key Features:**

- User registration/login with password hashing
- JWT token generation and validation
- Database models and relationships
- Basic error handling and validation
- Environment configuration setup

---

#### Phase 2: Game Logic Engine

**Deliverables:**

- Core game box management system
- Ticket generation algorithm with predetermined odds
- Win detection algorithm for Skull-Skull-X patterns
- Game state management
- Statistics tracking system

**Key Features:**

- Initialize game boxes with 500 tickets and winner distribution
- Generate tickets based on remaining winners in box
- Implement winning line detection (positions 1-3, 4-6, 7-9, 10-12, 13-15)
- Real-time statistics updates
- Game box auto-renewal when depleted

**API Endpoints to Implement:**

- `POST /api/tickets/purchase` - Purchase new ticket
- `GET /api/tickets/:id` - Get ticket details
- `POST /api/tickets/:id/reveal` - Reveal tab symbols
- `GET /api/stats` - Get user statistics
- `GET /api/gamebox/current` - Get current game box status

---

#### Phase 3: Frontend Core Structure

**Deliverables:**

- React application setup with TypeScript
- Authentication system (login/register components)
- Protected route implementation
- Basic layout and navigation
- State management setup (Context API or Redux)
- API integration layer

**Key Components:**

- Login/Register forms with validation
- Protected route wrapper
- Main game layout structure
- Authentication context/state management
- API service layer for backend communication
- Basic error handling and loading states

---

#### Phase 4: Game Interface Implementation

**Deliverables:**

- Pull tab ticket component (front and back views)
- Interactive tab system
- Game flow implementation
- Statistics dashboard
- Game status panel

**Key Features:**

- Ticket front view with pirate theme and prize table
- Ticket back view with 5 clickable tabs
- Tab reveal functionality
- Win detection and display
- Real-time statistics updates
- Game box progress tracker
- Buy ticket functionality

**Components to Build:**

- `TicketComponent` (front/back views)
- `TabComponent` (individual clickable tabs)
- `StatsDashboard` (user statistics)
- `GameStatusPanel` (box progress)
- `PurchaseButton` (buy new ticket)

---

#### Phase 5: Visual Design and Animations

**Deliverables:**

- Pirate treasure theme implementation
- Smooth animations for all interactions
- Responsive design for desktop
- Visual feedback for wins/losses
- Symbol graphics and styling

**Key Features:**

- 3D flip animation for ticket front-to-back transition
- Tab peel animation with realistic effects
- Symbol reveal animations
- Win celebration effects
- Rich pirate theme with blues and golds
- Treasure map background designs
- Decorative elements (coins, chests, palm trees)

**Animation Libraries:**

- CSS animations or React Spring
- Smooth 60fps performance
- Mobile-friendly touch interactions (future-proofing)

---

#### Phase 6: Integration and Polish

**Deliverables:**

- Full system integration testing
- Performance optimization
- Bug fixes and edge case handling
- User experience refinements
- Production deployment preparation

**Key Tasks:**

- End-to-end testing of game flow
- API error handling improvements
- Frontend/backend integration testing
- Performance optimization (load times, animations)
- Security testing (JWT, input validation)
- Cross-browser compatibility testing
- Production environment setup

---

#### Phase 7: Testing and Deployment

**Deliverables:**

- Comprehensive testing suite
- Production deployment
- Documentation
- Performance monitoring setup

**Key Tasks:**

- Unit tests for critical game logic
- Integration tests for API endpoints
- Frontend component testing
- Database backup strategy implementation
- Production deployment configuration
- Basic monitoring and logging setup

## Development Notes

---

#### Priority Order

1. **Start with Phase 1** - Backend foundation is critical for all other phases
2. **Complete Phase 2** before moving to frontend - Game logic must be solid
3. **Phases 3-4** can have some overlap once backend APIs are stable
4. **Phase 5** should only begin after core functionality is working
5. **Phases 6-7** are final integration and deployment

#### Key Implementation Guidelines

- **Database First:** Ensure database schema and relationships are correct before building APIs
- **API Testing:** Test each endpoint thoroughly before frontend integration
- **Incremental Development:** Build and test each component before moving to the next
- **Security Focus:** Implement proper authentication and input validation from the start
- **Performance Consideration:** Keep animations smooth and API responses fast

#### Success Criteria for Each Phase

- **Phase 1:** User can register, login, and receive JWT tokens
- **Phase 2:** Backend can generate tickets with correct odds and detect wins
- **Phase 3:** User can login and access protected game interface
- **Phase 4:** User can purchase tickets, flip them, and reveal tabs
- **Phase 5:** All interactions have smooth animations and proper theming
- **Phase 6:** Complete game flow works end-to-end without issues
- **Phase 7:** Application is deployed and ready for users
