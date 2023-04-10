const fs = require('fs');

class Book {
  constructor() {
    this.pages = [];
    this.index = {};
  }

  addPage(pageNumber, filename) {
    const content = fs.readFileSync(filename, 'utf-8');
    const page = new Page(pageNumber, content);
    this.pages.push(page);
  }

  buildIndex() {
    for (const page of this.pages) {
      const words = page.getWords();
      for (const word of words) {
        if (!this.index[word]) {
          this.index[word] = [page.pageNumber];
        } else if (!this.index[word].includes(page.pageNumber)) {
          this.index[word].push(page.pageNumber);
        }
      }
    }
  }

  printIndex() {
    const sortedWords = Object.keys(this.index).sort();
    const indexText = sortedWords
      .map((word) => `${word}: ${this.index[word].join(', ')}`)
      .join('\n');
    fs.writeFileSync('index.txt', indexText);
  }
}

class Page {
  constructor(pageNumber, content) {
    this.pageNumber = pageNumber;
    this.content = content;
    this.words = this.extractWords(content);
  }

  extractWords(content) {
    // Use regular expressions to split content into words
    const words = content.match(/[a-zA-Z]+/g);
    return words ? words.map((word) => word.toLowerCase()) : [];
  }

  getWords() {
    return this.content.trim().split(/\s+/);
  }
}

// Usage example
const book = new Book();
book.addPage(1, 'page1.txt');
book.addPage(2, 'page2.txt');
book.addPage(3, 'page3.txt');
book.buildIndex();
book.printIndex();
