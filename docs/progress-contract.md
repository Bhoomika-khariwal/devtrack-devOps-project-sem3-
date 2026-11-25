
# DevTrack Progress and Gamification Rules

## Project Objective

Track each student's module progress, quiz performance,
experience points (XP), levels, and achievements.

## XP Reward Rules

- Module completed: 50 XP
- Quiz passed: 30 XP
- Quiz score of 80% or above: 20 bonus XP
- Practice challenge completed: 25 XP
- All four modules completed: 100 bonus XP

## Level Calculation

Every 100 XP increases the student's level by 1.

Level = floor(Total XP / 100) + 1

Examples:
- 0 XP = Level 1
- 150 XP = Level 2
- 240 XP = Level 3
- 550 XP = Level 6

## Achievement Badges

First Steps:
Unlock after completing one module.

Learning Explorer:
Unlock after completing two modules.

Quiz Champion:
Unlock after scoring at least 80% on a quiz.

XP Champion:
Unlock after reaching 500 XP.

DevOps Master:
Unlock after completing all four modules.

## Important Rules

1. New students start with 0 XP and Level 1.
2. XP rewards must not be duplicated.
3. Repeating a quiz can improve the best score.
4. A student cannot earn the same milestone reward
   repeatedly.
5. Progress belongs to the logged-in student.
6. Backend validates and saves permanent XP.
7. Dashboard displays the saved results.

## Questions to Agree With Ayush

1. What is the passing score for a module quiz?
   Proposed: 60%.

2. What counts as module completion?
   Proposed: passing the module's final quiz
   after required learning activities.

3. How is partial lesson progress calculated?

4. What API response format will the dashboard use?

5. How will the backend prevent duplicate XP?
