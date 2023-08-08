import { Deck } from './Deck';
import { Player } from './Player';

export class Game {
  deck = new Deck();
  dealer = new Player(this.deck);
  player = new Player(this.deck);
  playerTurn: any;

  constructor() {
    this.startNewGame();
  }

  startNewGame(): void {
    this.player.hand = [];
    this.dealer.hand = [];

    // Initial deal
    this.player.drawCard();
    this.player.drawCard();
    this.dealer.drawCard();
    this.dealer.drawCard();
  }

  playerHit(): void {
    this.player.drawCard();
  }

  dealerHit(): void {
    while (this.dealer.calculateHandValue() <= 17) {
      this.dealer.drawCard();
    }
  }

  dealerShouldHit(): boolean {
    return this.dealer.calculateHandValue() <= 16;
  }
  
  

  determineWinner(): string {
    const playerValue = this.player.calculateHandValue();
    const dealerValue = this.dealer.calculateHandValue();

    if (playerValue > 21) {
      return 'Player busts, dealer wins!';
    } else if (dealerValue > 21) {
      return 'Dealer busts, player wins!';
    } else if (playerValue > dealerValue) {
      return 'Player wins!';
    } else if (dealerValue > playerValue) {
      return 'Dealer wins!';
    } else {
      return 'It\'s a tie!';
    }
  }
}
