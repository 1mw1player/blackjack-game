
# Blackjack Game using PIXI.JS and TypeScript

## Overview

This project is an implementation of the classic Blackjack game using PIXI.JS and TypeScript. The aim is to beat the dealer by getting a card count as close to 21 as possible, without going over.

## Setup

### Prerequisites

1. Ensure that you have [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed on your system.

### Installation

1. Clone the repository:
```
git clone <repository-url>
```
2. Navigate to the project directory:
```
cd Test
```
3. Install the required dependencies:
```
npm install
```

## Running the Game Locally

1. Start the development server:
```
npm start
```
2. Open your browser and navigate to `http://localhost:8080` (or the specified port) to play the game.

## Building the Project

To build the project for production, run:
```
npm run build
```
This will create optimized bundles in the `dist` directory.

## Testing

*Note*: This section is relevant only if the testing framework (like Jest) is set up for the project.

To run the test suite, execute:
```
npm test
```

## Gameplay

1. Begin by selecting your wager using the provided chips.
2. Press "Play" to start the game.
3. Two cards will be dealt to you, and two to the dealer, with one of the dealer's cards being face down.
4. Decide to "Hit" for another card or "Stand" based on your current card total.
5. If you go over 21 after hitting, you lose the round.
6. If you choose to stand, the dealer will reveal its hidden card and continue to take cards until its total is higher than yours or it goes over 21.
7. If the dealer goes over 21, you win the round.

## Deployment

To deploy the game, use platforms like [Netlify](https://www.netlify.com/), [Vercel](https://vercel.com/), or any other of your choice. Ensure to point the deployment directory to `dist`.
