class BookCreationModel {
    constructor() {
        this.characters = [];
        this.style = null;
        this.userChoices = [];
        this.scenes = [];
        this.title = '';
    }

    addCharacter(name, description) {
        if (name || description) {
            this.characters.push({ name, description });
        }
    }

    getCharacters() {
        return this.characters;
    }

    setStyle(style) {
        this.style = style;
    }

    getStyle() {
        return this.style;
    }

    addUserChoice(choice) {
        if (choice) {
            this.userChoices.push(choice);
        }
    }

    getUserChoices() {
        return this.userChoices;
    }

    addScene(description) {
        if (description) {
            this.scenes.push(description);
        }
    }

    getScenes() {
        return this.scenes;
    }

    setTitle(title) {
        this.title = title;
    }

    getTitle() {
        return this.title;
    }

    clearData() {
        this.characters = [];
        this.style = null;
        this.userChoices = [];
        this.scenes = [];
        this.title = '';
    }

    toJSON() {
        return {
            characters: this.characters,
            style: this.style,
            userChoices: this.userChoices,
            scenes: this.scenes,
            title: this.title
        };
    }
}

export default BookCreationModel;
