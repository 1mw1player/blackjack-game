import { Card, Suit, Value } from './Card';

export class Deck {
  cards: Card[] = [];

  constructor() {
    this.initialize();
  }

  initialize(): void {
    for (let suit in Suit) {
      for (let value in Value) {
        this.cards.push(new Card(Value[value as keyof typeof Value], Suit[suit as keyof typeof Suit]));
      }
    }

    this.shuffle();
}


  shuffle(): void {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
  }

  drawCard(): Card {
    if (!this.cards.length) {
      throw new Error('Deck is empty!');
    }

    return this.cards.pop()!;
  }
}
