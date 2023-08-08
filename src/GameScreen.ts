import * as PIXI from 'pixi.js';
import { Game } from './Game';
import { Player } from './Player';
import { Suit, Value } from './Card';

export class GameScreen {
  private game: Game;
  private app: PIXI.Application;
  private cardTextures: { [key: string]: PIXI.Texture } = {};
  private resultText: PIXI.Text;  // text object for the game result
  private static readonly CARD_WIDTH = 100;  // adjust as necessary
  private static readonly CARD_MARGIN = 1;  // adjust as necessary
  private playerCoinBalanceText: PIXI.Text;
  private playerCoinBalance: number = 1000; // Initialize the player's coin balance to 1000
  private dealerSecondCardHidden: boolean = true;
  private playerBet: number = 0;
  private playerCards: PIXI.Sprite[] = [];
  private dealerCards: PIXI.Sprite[] = [];
  private buttons: PIXI.Text[] = [];
  private coins: PIXI.Graphics[] = [];
  private hasAnimatedCards: boolean = false; // Flag to keep track of whether cards have been animated

  constructor() {
    this.game = new Game();
    this.app = new PIXI.Application({ width: 800, height: 600 });
    this.app.view.id = 'myCanvas';  // Add this line
    document.body.appendChild(this.app.view);
    this.resultText = new PIXI.Text('', { fontSize: 24, fill: 'white' });
    this.resultText.x = 50;
    this.resultText.y = 500;
    this.app.stage.addChild(this.resultText);
    // Create the text object for player's coin balance
    this.playerCoinBalanceText = new PIXI.Text(`Balance:£1000`, { fontSize: 24, fill: 'white' });
    this.playerCoinBalanceText.x = 20; // Adjust the value to position it on the left side
    this.playerCoinBalanceText.y = this.app.screen.height - 50; // Adjust the value to place it at the bottom
    this.playerCoinBalanceText.anchor.set(0, 0.5); // Set anchor to left-center
    this.app.stage.addChild(this.playerCoinBalanceText);
    this.loadAssets();
  }

  private loadAssets(): void {
    const suits = Object.values(Suit);
    const values = Object.values(Value);
    suits.forEach(suit => {
      values.forEach(value => {
        const cardName = `${value.toLowerCase()}_of_${suit.toLowerCase()}`;
        PIXI.Loader.shared.add(cardName, `assets/card/${cardName}.png`);
      });
    });
    // Add the face-down card texture
    PIXI.Loader.shared.add('facedown', 'assets/card/fixedImage.jpeg');
    // Load the background image
    PIXI.Loader.shared.add('background', 'assets/card/background.png');
    PIXI.Loader.shared.load(() => {
      this.cardTextures = this.createCardTextures();
      this.setup();
    });
  }

  private coinStack: PIXI.Graphics[] = [];
  private createCoin(x: number, y: number): void {
    const coin = new PIXI.Graphics();
    // Draw the outer circle
    coin.lineStyle(2, 0x000000); // lineStyle(width, color)
    coin.beginFill(0xFFD700); // Gold color
    coin.drawCircle(0, 0, 50); // drawCircle(x, y, radius)
    coin.endFill();
    // Draw the inner circle
    coin.lineStyle(2, 0x000000); // lineStyle(width, color)
    coin.beginFill(0xFFFFFF); // White color
    coin.drawCircle(0, 0, 40); // drawCircle(x, y, radius)
    coin.endFill();
    // Draw the center circle
    coin.lineStyle(2, 0x000000); // lineStyle(width, color)
    coin.beginFill(0xFFD700); // Gold color
    coin.drawCircle(0, 0, 30); // drawCircle(x, y, radius)
    coin.endFill();
    // Position the coin at the bottom right, slightly towards the right side
    const coinStackX = this.app.screen.width - 70; // Adjust the offset as needed
    const coinStackY = this.app.screen.height - 70; // Adjust the offset as needed
    // Position the coin
    coin.x = coinStackX;
    coin.y = coinStackY - this.coinStack.length * 10; // Stack the coins vertically
    // Add the coin to the stage
    this.app.stage.addChild(coin);
    // Add the coin to the coin stack
    this.coinStack.push(coin);
    // Scale the coin down
    const scaleDownFactor = 0.5;
    coin.scale.set(scaleDownFactor, scaleDownFactor);
  }

    private blueCoinValue: number = 10; // Value of the blue coin
    private blueCoinStack: PIXI.Graphics[] = [];

    private createBlueCoin(x: number, y: number): void {
    const blueCoin = new PIXI.Graphics();
   // Draw the outer circle
    blueCoin.lineStyle(2, 0x0000FF); // Blue color
    blueCoin.beginFill(0x0eff00); // Blue color
    blueCoin.drawCircle(0, 0, 50); // drawCircle(x, y, radius)
    blueCoin.endFill();
    // Draw the inner circle
    blueCoin.lineStyle(2, 0x000000); // lineStyle(width, color)
    blueCoin.beginFill(0xFFFFFF); // White color
    blueCoin.drawCircle(0, 0, 40); // drawCircle(x, y, radius)
    blueCoin.endFill();
    // Draw the center circle
    blueCoin.lineStyle(2, 0x000000); // lineStyle(width, color)
    blueCoin.beginFill(0x0eff00); // Light blue color
    blueCoin.drawCircle(0, 0, 30); // drawCircle(x, y, radius)
    blueCoin.endFill();
    // Position the blue coin next to the gold coin stack
    const blueCoinStackX = this.app.screen.width - 140; // Adjust the offset as needed
    const blueCoinStackY = this.app.screen.height - 70; // Adjust the offset as needed
    // Position the blue coin
    blueCoin.x = blueCoinStackX;
    blueCoin.y = blueCoinStackY - this.blueCoinStack.length * 10; // Stack the blue coins vertically
    // Add the blue coin to the stage
    this.app.stage.addChild(blueCoin);
    // Add the blue coin to the blue coin stack
    this.blueCoinStack.push(blueCoin);
    // Scale the blue coin down
    const scaleDownFactor = 0.5;
    blueCoin.scale.set(scaleDownFactor, scaleDownFactor);
    // Make the blue coin stack interactive and add a click event listener
    blueCoin.interactive = true;
    blueCoin.buttonMode = true;
    blueCoin.on('pointerdown', this.handleBlueCoinClick.bind(this, blueCoin));
  }

  private handleBlueCoinClick(blueCoin: PIXI.Graphics): void {
    if (this.blueCoinStack.length > 0) {
      // Animate the blue coin moving towards the center of the canvas
      const centerX = this.app.screen.width / 2;
      const centerY = this.app.screen.height / 2;
      const ticker = new PIXI.Ticker();
      const speed = 4; // Adjust the speed of the animation as needed
      ticker.add(() => {
        if (blueCoin.x < centerX) blueCoin.x += speed;
        if (blueCoin.y < centerY) blueCoin.y += speed;
        if (blueCoin.x > centerX) blueCoin.x -= speed;
        if (blueCoin.y > centerY) blueCoin.y -= speed;
        if (Math.abs(blueCoin.x - centerX) <= speed && Math.abs(blueCoin.y - centerY) <= speed) {
          blueCoin.x = centerX;
          blueCoin.y = centerY;
          ticker.stop();
          // Decrease the player's coin balance by the blue coin value
          this.playerCoinBalance -= this.blueCoinValue;
          console.log(`handleBlueCoinClick: playerCoinBalance after decreasing: ${this.playerCoinBalance}`);
          // Update the player bet
          this.playerBet += this.blueCoinValue;
          console.log(`handleBlueCoinClick: playerBet after increasing: ${this.playerBet}`);
          // Update the player coin balance text
          this.updatePlayerCoinBalanceText();
        }
      });
      ticker.start();
    }
  }

  private setup(): void {
    // Add the cards for the player and dealer
    this.addCards(this.game.player, this.playerCards);
    this.addCards(this.game.dealer, this.dealerCards);
    // Add buttons
    this.addButton('Hit', 50, 450, () => this.game.playerHit(), 0);
    this.addButton('Pass', 150, 450, () => this.game.dealerHit(), 1);
    // Hide the second card of the dealer at the beginning of the game
    this.dealerSecondCardHidden = true;
    const dealerSecondCard = this.dealerCards[1];
    const cardTextureFaceDown = this.cardTextures['facedown'];
    dealerSecondCard.texture = cardTextureFaceDown;
    // Create the background sprite
    const backgroundTexture = PIXI.Loader.shared.resources['background'].texture;
    const backgroundImage = new PIXI.Sprite(backgroundTexture);
    // Scale the background image to cover the whole stage
    backgroundImage.width = this.app.screen.width;
    backgroundImage.height = this.app.screen.height;
    // Add the background image to the stage as the first child (to be at the bottom)
    this.app.stage.addChildAt(backgroundImage, 0);
    // Create a stack of coins
    for (let i = 0; i < 10; i++) {
      this.createCoin(this.app.screen.width / 1.6, this.app.screen.height / 1.4 - i * 10);
    }
    // Create a stack of blue coins
    for (let i = 0; i < 10; i++) {
      this.createBlueCoin(this.app.screen.width / 1.4, this.app.screen.height / 1.4 - i * 10);
    }
    // Make the coin stack interactive and add a click event listener
    this.coinStack.forEach(coin => {
      coin.interactive = true;
      coin.buttonMode = true;
      coin.on('pointerdown', this.handleCoinClick.bind(this));
    });
  }

  private resetPlayerBet(): void {
    this.playerBet = 0;
  }

  private handleCoinClick(): void {
    if (this.coinStack.length > 0) {
      // Take the top coin from the stack
      const coin = this.coinStack.pop();
      if (coin) {
        // Animate the coin moving towards the center of the canvas
        const centerX = this.app.screen.width / 2.3;
        const centerY = this.app.screen.height / 2.3;
        const ticker = new PIXI.Ticker();
        const speed = 4; // Adjust the speed of the animation as needed
        ticker.add(() => {
          if (coin.x < centerX) coin.x += speed;
          if (coin.y < centerY) coin.y += speed;
          if (coin.x > centerX) coin.x -= speed;
          if (coin.y > centerY) coin.y -= speed;
          if (Math.abs(coin.x - centerX) <= speed && Math.abs(coin.y - centerY) <= speed) {
            coin.x = centerX;
            coin.y = centerY;
            ticker.stop();
            // Decrease the player's coin balance by 5
            this.playerCoinBalance -= 5;
            console.log(`handleCoinClick: playerCoinBalance after decreasing: ${this.playerCoinBalance}`);
            // Update the player bet
            this.playerBet += 5;
            console.log(`handleCoinClick: playerBet after increasing: ${this.playerBet}`);
            // Update the player coin balance text
            this.updatePlayerCoinBalanceText();
          }
        });
        ticker.start();
      }
    }
  }

  private updatePlayerCoinBalanceText(): void {
    this.playerCoinBalanceText.text = `Balance £: ${this.playerCoinBalance}`;
  }

  private createCardTextures(): { [key: string]: PIXI.Texture } {
    const cardTextures: { [key: string]: PIXI.Texture } = {};
    const suits = Object.values(Suit);
    const values = Object.values(Value);
    suits.forEach(suit => {
      values.forEach(value => {
        const cardName = `${value.toLowerCase()}_of_${suit.toLowerCase()}`;
        cardTextures[cardName] = PIXI.Loader.shared.resources[cardName].texture;
      });
    });
    // Add the face-down card texture
    cardTextures['facedown'] = PIXI.Loader.shared.resources['facedown'].texture;
    return cardTextures;
  }

  private addCards(player: Player, cardSprites: PIXI.Sprite[]): void {
    const numCards = player.hand.length;
    const totalWidth = numCards * GameScreen.CARD_WIDTH + (numCards - 1) * GameScreen.CARD_MARGIN;
    const startX = (this.app.screen.width - totalWidth) / 2;
    for (let i = 0; i < numCards; i++) {
      const cardTexture = this.cardTextures[player.hand[i].name];
      const card = new PIXI.Sprite(cardTexture);
      card.x = startX + i * (GameScreen.CARD_WIDTH + GameScreen.CARD_MARGIN);
      let targetY: number;
      if (player === this.game.dealer) {
        targetY = 93; // Dealer cards at the top middle
      } else {
        targetY = this.app.screen.height - 138 - GameScreen.CARD_WIDTH; // Player cards at the bottom middle
      }
      if (!this.hasAnimatedCards) {
        card.y = -100; // Initial position above the screen if not animated yet
      } else {
        card.y = targetY; // If already animated, set the final position directly
      }
      card.scale.set(0.15, 0.15); // Adjust the scale as necessary
      this.app.stage.addChild(card);
      // Animate the card's appearance only if not animated yet
      if (!this.hasAnimatedCards) {
        PIXI.Ticker.shared.add((delta: number) => {
          if (card.y < targetY) {
            card.y += delta * 5; // Adjust the speed of the animation as necessary
          } else {
            // Remove the ticker when the card reaches its target position
            PIXI.Ticker.shared.remove(delta => card.y += delta * 5);
            this.hasAnimatedCards = true; // Set the flag to true after the initial animation
          }
        });
      }
      cardSprites.push(card);
    }
  }

  private addButton(text: string, x: number, y: number, callback: () => void, index: number): void {
    let button: PIXI.Text;
    if (this.buttons.length > index) {
      // If the button already exists, just update its callback
      button = this.buttons[index];
      button.off('pointerdown');
    } else {
      // If the button doesn't exist, create it
      button = new PIXI.Text(text, { fontSize: 24, fill: 'white' });
      button.x = x;
      button.y = y;
      button.interactive = true;
      button.buttonMode = true;
      this.app.stage.addChild(button);
      this.buttons.push(button);
    }
    button.on('pointerdown', () => {
      callback();
      if (this.game.dealerShouldHit()) {
        this.game.dealerHit();
      }
      this.updateGame(); // update the game state after the callback
      this.updateResult(); // update the game result after the callback
    });
  }

  private updateGame(): void {
    // Remove the cards and coins from the stage
    this.playerCards.forEach(card => this.app.stage.removeChild(card));
    this.dealerCards.forEach(card => this.app.stage.removeChild(card));
    this.coins.forEach(coin => this.app.stage.removeChild(coin));
    // Clear the cards and coins arrays
    this.playerCards = [];
    this.dealerCards = [];
    this.coins = [];
    // Add the cards for the player and dealer
    this.addCards(this.game.player, this.playerCards);
    this.addCards(this.game.dealer, this.dealerCards);
    // Update the buttons
    this.addButton('Hit', 50, 450, () => this.game.playerHit(), 0);
    this.addButton('Pass', 150, 450, () => this.game.dealerHit(), 1);
    // If the game has ended, reveal the dealer's second card
    if (this.game.determineWinner() !== '') {
      const dealerSecondCard = this.dealerCards[1];
      dealerSecondCard.texture = this.cardTextures[this.game.dealer.hand[1].name];
      this.dealerSecondCardHidden = false;
    }
    // Hide the second card of the dealer at the beginning of the game
    else if (this.dealerSecondCardHidden) {
      const dealerSecondCard = this.dealerCards[1];
      const cardTextureFaceDown = this.cardTextures['facedown'];
      dealerSecondCard.texture = cardTextureFaceDown;
    }
  }

  private restart(): void {
    // Clear the coin stack at the beginning of each round
    this.coinStack.forEach(coin => this.app.stage.removeChild(coin));
    this.coinStack = [];
    // Clear the blue coin stack at the beginning of each round
    this.blueCoinStack.forEach(blueCoin => this.app.stage.removeChild(blueCoin));
    this.blueCoinStack = [];
    // Flip the dealer's face-down card back to face-down
    const dealerSecondCard = this.dealerCards[1];
    dealerSecondCard.texture = this.cardTextures['facedown'];
    // Clear the game
    this.game = new Game();
    // Remove all cards, buttons, and coins from the stage
    this.playerCards.forEach(card => this.app.stage.removeChild(card));
    this.dealerCards.forEach(card => this.app.stage.removeChild(card));
    this.buttons.forEach(button => this.app.stage.removeChild(button));
    // Clear the arrays
    this.playerCards = [];
    this.dealerCards = [];
    this.buttons = [];
    // Clear the result text
    this.resultText.text = '';
    // Setup the game again
    this.setup();
  }
  
  private updateResult(): void {
    const result = this.game.determineWinner();
    // If the game has ended
    if (result !== '') {
      setTimeout(() => {
        // Update the player's balance based on the game result
        if (result === 'Player wins!' || result === 'Dealer busts, player wins!') {
          this.playerCoinBalance += this.playerBet * 2; // Player wins or dealer went bust, balance increased by the bet amount
          console.log(`updateResult: playerCoinBalance after winning: ${this.playerCoinBalance}`);
        } else if (result === 'Dealer wins!' || result === 'Player busts, dealer wins!') {
          // Player loses, no need to update the balance since it was already decreased when betting
        }
        // Reset the player bet
        this.resetPlayerBet();
        console.log(`updateResult: playerBet after resetting: ${this.playerBet}`);
        // Update the player coin balance text
        this.updatePlayerCoinBalanceText();
        // Show the game result
        this.resultText.text = result;
        // Show additional message for "Player wins" or "Dealer wins"
        if (result === 'Player wins!' || result === 'Dealer wins!') {
          const winMessage = result === 'Player wins!' ? 'Player wins!' : 'Dealer wins!';
          const winText = new PIXI.Text(winMessage, { fontSize: 24, fill: 'white' });
          winText.x = 50;
          winText.y = 250; // Adjust the value to position the message on the screen
          this.app.stage.addChild(winText);
        }
        // Restart the game
        this.restart();
      }, 2000);
    } else {
      // Game is still ongoing, reveal the face-down card of the dealer after player's turn
      if (this.dealerSecondCardHidden && !this.game.playerTurn) {
        const dealerSecondCard = this.dealerCards[1];
        dealerSecondCard.texture = this.cardTextures[this.game.dealer.hand[1].name];
        this.dealerSecondCardHidden = false;
      }
    }
  }
}  