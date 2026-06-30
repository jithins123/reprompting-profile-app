export type Option = { id: string; label: string };
export type Question = { id: string; title: string; options: Option[] };

export const questions: Question[] = [
  {
    id: "q1",
    title: "A new opportunity appears that could significantly change your life. What happens first?",
    options: [
      { id: "understand", label: "I want to understand it before deciding." },
      { id: "start", label: "I feel excited and want to get started." },
      { id: "ready", label: "I wonder whether I'm truly ready." },
      { id: "others", label: "I think about how it could affect the people around me." },
      { id: "other", label: "✍️ Something else..." }
    ]
  },
  {
    id: "q2",
    title: "Something important doesn't go as planned. What's your first response?",
    options: [
      { id: "analyse", label: "I analyse what happened so I can learn from it." },
      { id: "forward", label: "I immediately start looking for another way forward." },
      { id: "mistake", label: "I wonder whether I made a mistake." },
      { id: "space", label: "I give myself some space before deciding what to do next." },
      { id: "other", label: "✍️ Something else..." }
    ]
  },
  {
    id: "q3",
    title: "Someone unexpectedly compliments you. What's your first internal reaction?",
    options: [
      { id: "accept", label: "I genuinely accept it." },
      { id: "minimise", label: "I explain why it wasn't really a big deal." },
      { id: "doubt", label: "I wonder if they really mean it." },
      { id: "grow", label: "I feel inspired to keep growing." },
      { id: "other", label: "✍️ Something else..." }
    ]
  },
  {
    id: "q4",
    title: "You wake up with an entire day free and nothing planned. What usually happens?",
    options: [
      { id: "plan", label: "I naturally create a plan." },
      { id: "flow", label: "I see where the day takes me." },
      { id: "meaning", label: "I look for something meaningful to work on." },
      { id: "recharge", label: "I intentionally slow down and recharge." },
      { id: "other", label: "✍️ Something else..." }
    ]
  },
  {
    id: "q5",
    title: "When life feels uncertain, what usually helps you move forward?",
    options: [
      { id: "understanding", label: "Understanding the situation better." },
      { id: "small-step", label: "Taking the first small step." },
      { id: "time", label: "Giving myself more time." },
      { id: "talk", label: "Talking it through with someone I trust." },
      { id: "other", label: "✍️ Something else..." }
    ]
  },
  {
    id: "q6",
    title: "You've been thinking about starting something important — a business, project, or major life change. What usually happens next?",
    options: [
      { id: "research", label: "I start researching and gathering more information." },
      { id: "action", label: "I create a plan and begin taking action." },
      { id: "fade", label: "I keep thinking about it until the momentum fades." },
      { id: "trusted", label: "I discuss it with people I trust before deciding." },
      { id: "other", label: "✍️ Something else..." }
    ]
  },
  {
    id: "q7",
    title: "Someone publicly disagrees with you. What's your first internal reaction?",
    options: [
      { id: "curious", label: "I become curious about their perspective." },
      { id: "explain", label: "I feel the need to explain my position." },
      { id: "question", label: "I wonder whether they're right." },
      { id: "reflect", label: "I stay calm and reflect before responding." },
      { id: "other", label: "✍️ Something else..." }
    ]
  },
  {
    id: "q8",
    title: "When you walk into a room full of people you don't know, what do you notice first?",
    options: [
      { id: "approachable", label: "The people who seem approachable." },
      { id: "known", label: "Whether I know anyone already." },
      { id: "perceived", label: "How I might be coming across." },
      { id: "atmosphere", label: "The overall atmosphere in the room." },
      { id: "other", label: "✍️ Something else..." }
    ]
  },
  {
    id: "q9",
    title: "If you could improve one aspect of how your mind responds to challenges, what would you choose?",
    options: [
      { id: "trust", label: "Trust myself more." },
      { id: "overthinking", label: "Spend less time overthinking." },
      { id: "consistent", label: "Take more consistent action." },
      { id: "calm", label: "Stay calmer under pressure." },
      { id: "other", label: "✍️ Something else..." }
    ]
  },
  {
    id: "q10",
    title: "When you look back at the last 12 months, where do you feel you held yourself back the most?",
    options: [
      { id: "waited", label: "I waited longer than I needed to act." },
      { id: "doubted", label: "I doubted myself when part of me already knew." },
      { id: "busy", label: "I stayed busy while avoiding the real move." },
      { id: "adapted", label: "I adapted to others instead of choosing clearly for myself." },
      { id: "other", label: "✍️ Something else..." }
    ]
  },
  {
    id: "q11",
    title: "What does this pattern feel like it has started to cost you?",
    options: [
      { id: "time", label: "Time I can't get back." },
      { id: "confidence", label: "Confidence in my own decisions." },
      { id: "opportunity", label: "Opportunities, money, or momentum." },
      { id: "energy", label: "Energy that could be going into my next chapter." },
      { id: "other", label: "✍️ Something else..." }
    ]
  },
  {
    id: "q12",
    title: "If this pattern kept running quietly for another year, what would feel hardest to accept?",
    options: [
      { id: "same-place", label: "Still being in the same place." },
      { id: "more-in-me", label: "Knowing I had more in me." },
      { id: "passed", label: "Watching important opportunities pass." },
      { id: "power", label: "Feeling disconnected from my own power." },
      { id: "other", label: "✍️ Something else..." }
    ]
  },
  {
    id: "q13",
    title: "Imagine we're having this conversation again one year from today. What would make you feel this year had been truly worthwhile?",
    options: [
      { id: "acted", label: "I'd have finally acted on something that's been important to me." },
      { id: "peace", label: "I'd feel more confident and more at peace with myself." },
      { id: "relationships", label: "I'd have built stronger and more meaningful relationships." },
      { id: "new-version", label: "I'd know I'd become a different version of myself, even if I couldn't fully explain how." },
      { id: "other", label: "✍️ Something else..." }
    ]
  },
  {
    id: "q14",
    title: "As you've answered these questions, which statement best describes your approach?",
    options: [
      { id: "usual", label: "I've been choosing the answers that reflect what I usually do." },
      { id: "accurate", label: "I've been thinking carefully because I want the most accurate result." },
      { id: "depends", label: "My answer depends on the situation, so some questions were difficult." },
      { id: "best-stress", label: "I noticed my answers changed depending on whether I imagined myself at my best or under stress." },
      { id: "other", label: "✍️ Something else..." }
    ]
  }
];
