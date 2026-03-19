# Home Todo
## Base functionality
Basic frontend-only or backend-only app (hint: if you find partner that would do the other part, you could have fun and learn something new together)

- List tasks
- Add task
- Edit task description
- Mark task as done
- Remove task

## Database
- Make sure to use REST API
- DB storage for tasks
- Inputs are validated
- User model
- Authentication
  - I can login to see my tasks
  - Use JWT
- Authorization
  - Make sure, I can edit only my tasks and add them only to my own list

## Tests
- At least one unit test
- At least one integration test
- At least one end to end test
- Setup CI pipeline
- Setup linter

## Deploy
- Readme.md
  - Describe step by step how to deploy/run app after cloning the repo.
  - If you like, describe architecture of the app so new programer can easily understand the code base and be productive ASAP
- Deploy app
  - Deploy application so it's accessible online to anyone (look for free solutions)

## Bonus
- Tasks can have tags
- Visualize some data
  - Done vs. not done, done by day, tasks by tags, etc.
- Computer vision / OCR
  - User can upload a picture of a text == task description (only one at a time; for simplicity)
  - It gets added to their list of tasks in a text form
- Implement (whole) project using TDD
- Tasks can have due date and the app spams me
  - It can send email or use something like pushover.net, ifttt.com or similar
- Tasks can have priority
  - Priority is some kind of enum [low, normal, high]
- Filter tasks
  - By done and/or anything you’ve implemented (due date, tag, priority, …)
- Dockerize it
