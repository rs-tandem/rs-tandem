# Day ..whatever

FINALLY! Finished working with the header!! After hundreds of comments in the pull request it was successfully merged into develop. My first small contribution to the project.
Initilally I made the navigation from the HOME button using window.history.pushState and PopStateEvent. During PR review, I was persistantly asked to use functionality which was already provided by vanilla-routing. After flipping through library documentation, I refactored the navigation logic and used standard API. This also helped me to eliminate circular dependency between routes → layout → header → routes.
Starting from today, I am moving on to the next task - Страница выбора темы с заданиями #15!
