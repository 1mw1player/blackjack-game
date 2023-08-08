import { Card ,Value} from './Card';
import { Deck } from './Deck';

export class Player {
  hand: Card[] = [];

  constructor(private deck: Deck) {}

  drawCard(): void {
    this.hand.push(this.deck.drawCard());
  }

  calculateHandValue(): number {
    let value = 0;
    let hasAce = false;

    for (let card of this.hand) {
      if (card.value === Value.Ace) {
        hasAce = true;
      } else if (
        card.value === Value.King ||
        card.value === Value.Queen ||
        card.value === Value.Jack
      ) {
        value += 10;
      } else {
        value += Number(card.value);
      }
    }

    if (hasAce) {
      value += value + 11 > 21 ? 1 : 11;
    }

    return value;
  }
}

export { Card };
