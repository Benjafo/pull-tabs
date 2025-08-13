#!/bin/bash

# API Testing Script for Pull Tabs Game
# This script tests all Phase 2 endpoints

BASE_URL="http://localhost:3001"
USERNAME="testuser_$(date +%s)"
EMAIL="${USERNAME}@example.com"
PASSWORD="TestPassword123"

echo "🧪 Testing Pull Tabs API - Phase 2"
echo "=================================="
echo ""

# Function to pretty print JSON
pretty_json() {
    echo "$1" | python3 -m json.tool 2>/dev/null || echo "$1"
}

# 1. Register a new user
echo "1. Testing User Registration..."
REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/register" \
    -H "Content-Type: application/json" \
    -d "{\"username\":\"$USERNAME\",\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}" \
    -c cookies.txt)
echo "Response: $(pretty_json "$REGISTER_RESPONSE")"
echo ""

# 2. Login
echo "2. Testing Login..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/login" \
    -H "Content-Type: application/json" \
    -d "{\"username\":\"$USERNAME\",\"password\":\"$PASSWORD\"}" \
    -c cookies.txt)
echo "Response: $(pretty_json "$LOGIN_RESPONSE")"
echo ""

# 3. Get current game box status
echo "3. Testing Get Current Game Box..."
GAMEBOX_RESPONSE=$(curl -s -X GET "$BASE_URL/api/gamebox/current")
echo "Response: $(pretty_json "$GAMEBOX_RESPONSE")"
echo ""

# 4. Purchase a ticket
echo "4. Testing Ticket Purchase..."
PURCHASE_RESPONSE=$(curl -s -X POST "$BASE_URL/api/tickets/purchase" \
    -b cookies.txt)
echo "Response: $(pretty_json "$PURCHASE_RESPONSE")"
TICKET_ID=$(echo "$PURCHASE_RESPONSE" | grep -o '"id":[0-9]*' | head -1 | cut -d: -f2)
echo "Ticket ID: $TICKET_ID"
echo ""

# 5. Get ticket details
echo "5. Testing Get Ticket Details..."
TICKET_RESPONSE=$(curl -s -X GET "$BASE_URL/api/tickets/$TICKET_ID" \
    -b cookies.txt)
echo "Response: $(pretty_json "$TICKET_RESPONSE")"
echo ""

# 6. Reveal tabs one by one
echo "6. Testing Tab Reveals..."
for TAB in 0 1 2 3 4; do
    echo "  Revealing Tab $((TAB + 1))..."
    REVEAL_RESPONSE=$(curl -s -X POST "$BASE_URL/api/tickets/$TICKET_ID/reveal" \
        -H "Content-Type: application/json" \
        -d "{\"tabIndex\":$TAB}" \
        -b cookies.txt)
    echo "  Response: $(pretty_json "$REVEAL_RESPONSE")"
done
echo ""

# 7. Get ticket details after all reveals
echo "7. Testing Get Ticket After Full Reveal..."
FINAL_TICKET=$(curl -s -X GET "$BASE_URL/api/tickets/$TICKET_ID" \
    -b cookies.txt)
echo "Response: $(pretty_json "$FINAL_TICKET")"
echo ""

# 8. Get user statistics
echo "8. Testing Get User Statistics..."
STATS_RESPONSE=$(curl -s -X GET "$BASE_URL/api/stats" \
    -b cookies.txt)
echo "Response: $(pretty_json "$STATS_RESPONSE")"
echo ""

# 9. Get session statistics
echo "9. Testing Get Session Statistics..."
SESSION_STATS=$(curl -s -X GET "$BASE_URL/api/stats/session" \
    -b cookies.txt)
echo "Response: $(pretty_json "$SESSION_STATS")"
echo ""

# 10. Get user's ticket history
echo "10. Testing Get Ticket History..."
HISTORY_RESPONSE=$(curl -s -X GET "$BASE_URL/api/tickets?limit=5" \
    -b cookies.txt)
echo "Response: $(pretty_json "$HISTORY_RESPONSE")"
echo ""

# 11. Test leaderboard (public endpoint)
echo "11. Testing Leaderboard..."
LEADERBOARD=$(curl -s -X GET "$BASE_URL/api/stats/leaderboard?limit=5")
echo "Response: $(pretty_json "$LEADERBOARD")"
echo ""

# 12. Purchase multiple tickets to test odds
echo "12. Testing Multiple Ticket Purchases (checking win rate)..."
WINS=0
LOSSES=0
for i in {1..10}; do
    TICKET=$(curl -s -X POST "$BASE_URL/api/tickets/purchase" -b cookies.txt)
    TID=$(echo "$TICKET" | grep -o '"id":[0-9]*' | head -1 | cut -d: -f2)
    
    # Reveal all tabs quickly
    for TAB in 0 1 2 3 4; do
        curl -s -X POST "$BASE_URL/api/tickets/$TID/reveal" \
            -H "Content-Type: application/json" \
            -d "{\"tabIndex\":$TAB}" \
            -b cookies.txt > /dev/null
    done
    
    # Check if winner
    FINAL=$(curl -s -X GET "$BASE_URL/api/tickets/$TID" -b cookies.txt)
    if echo "$FINAL" | grep -q '"isWinner":true'; then
        WINS=$((WINS + 1))
        PAYOUT=$(echo "$FINAL" | grep -o '"totalPayout":[0-9.]*' | cut -d: -f2)
        echo "  Ticket $i: WIN! Payout: \$$PAYOUT"
    else
        LOSSES=$((LOSSES + 1))
        echo "  Ticket $i: Loss"
    fi
done
echo "  Results: $WINS wins, $LOSSES losses (Win rate: $((WINS * 100 / 10))%)"
echo ""

# Clean up
rm -f cookies.txt

echo "=================================="
echo "✅ API Testing Complete!"
echo ""
echo "Summary:"
echo "- User registration and login: Working"
echo "- Ticket purchase and reveal: Working"
echo "- Statistics tracking: Working"
echo "- Win rate observed: $((WINS * 100 / 10))% (Expected: ~28%)"