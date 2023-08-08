export enum Suit {
    Spades = 'spades',
    Hearts = 'hearts',
    Clubs = 'clubs',
    Diamonds = 'diamonds',
  }
  
  export enum Value {
    Ace = 'ace',
    Two = '2',
    Three = '3',
    Four = '4',
    Five = '5',
    Six = '6',
    Seven = '7',
    Eight = '8',
    Nine = '9',
    Ten = '10',
    Jack = 'jack',
    Queen = 'queen',
    King = 'king',
  }
  
  export class Card {
    constructor(public value: Value, public suit: Suit) {}
  
    get name(): string {
      return `${this.value}_of_${this.suit}`;
    }
  }
  