# Advisor Agent Memory
## Role
Build the AI personal style advisor — a persistent, context-aware chat assistant
that knows the user's colour season, past outfits, feedback history, preferences,
and cultural context. Answers style questions, gives proactive suggestions, learns
over time. Free users: 3 messages/month. Pro users: unlimited.
## Status: NOT STARTED
## Files I Own
- `app/api/advisor/chat/route.js`
- `app/api/advisor/history/route.js`
- `app/api/advisor/suggestions/route.js`
- `lib/advisor/systemPrompt.js`
- `lib/advisor/contextBuilder.js`
- `lib/advisor/proactiveSuggestions.js`
- `components/AdvisorChat.jsx`
- `components/AdvisorBubble.jsx`
- `components/SuggestionCards.jsx`
- `components/AdvisorOnboarding.jsx`
- `hooks/useAdvisor.js`
- `__tests__/advisor.test.js`
## Advisor Personality Contract
Name: "Aria" (or whatever brand name is chosen in constants.js: ADVISOR_NAME)
Tone: warm, direct, knowledgeable — like a stylish friend who went to fashion school,
      not a corporate chatbot. Never says "Great question!" or "Certainly!".
      Occasionally uses dry humour. Always references the user's specific color season.
      Calls out when something won't suit their undertone without being harsh.
## Context Contract (what Aria knows about every user)
- colorSeason + seasonDescription
- skinUndertone, skinDepth, faceShape
- bodyProportions
- All past outfit ratings (liked/disliked)
- Last 10 chat messages (conversation window)
- Saved/liked outfits from wardrobe
- Stated preferences (gender, occasion, culturalContext)
- Number of advisor sessions (for personalisation warmth)
## Proactive Suggestion Triggers
- After user likes 3+ outfits: "I'm noticing you love X — here's more"
- After user saves an outfit: follow-up care/styling tips
- On login after 7+ day gap: "Welcome back — anything coming up I can help you dress for?"
- After feedback score < 3: "Let's recalibrate — what felt off?"
- Seasonal calendar: "Wimbledon is in 6 weeks — as a [season], here's what to wear"
- Wardrobe audit: "Want me to review what you own and tell you what works for your season?"
- Long-term memory: "You mentioned you work in a law firm — keeping suggestions office-appropriate"
## Extended Feature Set
- Seasonal wardrobe calendar (proactive event-based suggestions)
- Wardrobe audit (user uploads photos of existing items, Aria rates each for season fit)
- Long-term preference memory (life context stored in user preferences JSONB)
## Completed Work
_None_
## Decisions Made
_None_
## Known Issues
_None_
## Gotchas for Downstream Agents
_None yet_
## Final Report
_Pending_
