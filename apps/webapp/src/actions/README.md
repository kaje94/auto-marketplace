# Actions

This directory is meant for Next.js server actions. Actions are responsible for handling server-side logic, such as performing server mutations and queries. They can also be used to invalidate Fetch API cache after performing mutations.

## Getting Started

To create a new action, follow these steps:

1. Create a new file in this directory with a descriptive name for your action.
2. Define your action function, which will contain the server-side logic.
3. If applicable, invalidate the relevant data after performing a mutation.
4. Export the action function so that it can be imported and used in other parts of your application.

## Usage

To use an action in your Next.js application, follow these steps:

1. Import the action function from this directory.
2. Call the action function from the client side, preferably using react-query, to perform the server-side logic.
