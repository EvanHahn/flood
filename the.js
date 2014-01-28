var COLORS = ['red', 'orange', 'yellow', 'green', 'blue', 'violet'];

function Square(game) {
	this.game = game;
	this.controlled = false;
	this.color = _.sample(COLORS);
	ko.track(this);
}

Square.prototype.flood = function flood() {
	this.game.flood(this.color);
};

function Game(options) {

	_.extend(this, {
		size: 14,
		moveCount: 0,
		expected: 25,
		colors: 6,
		rows: []
	}, options);

	this.reset();

	ko.track(this);

}

Game.prototype.reset = function reset() {

	this.moveCount = 0;

	this.rows.length = 0;
	for (var i = 0; i < this.size; i ++) {
		var row = [];
		for (var j = 0; j < this.size; j ++) {
			row.push(new Square(this));
		}
		this.rows.push(row);
	}

	this.rows[0][0].controlled = true;
	this.updateControlled();

};

Game.prototype.updateControlled = function updateControlled() {

	for (var i = 0; i < this.size; i ++) {
		for (var j = 0; j < this.size; j ++) {

			if (this.rows[i][j].controlled) {

				var color = this.rows[i][j].color;

				if (i > 0) {
					var up = this.rows[i - 1][j];
					if (up.color == color)
						up.controlled = true;
				}

				if (i < (this.size - 1)) {
					var down = this.rows[i + 1][j];
					if (down.color == color)
						down.controlled = true;
				}

				if (j > 0) {
					var left = this.rows[i][j - 1];
					if (left.color == color)
						left.controlled = true;
				}

				if (j < (this.size - 1)) {
					var right = this.rows[i][j + 1];
					if (right.color == color)
						right.controlled = true;
				}

			}

		}
	}

};

Game.prototype.flood = function flood(color) {

	this.moveCount ++;

	this.rows[0][0].color = color;

	var queue = [];
	for (var i = 0; i < this.size; i ++) {
		for (var j = 0; j < this.size; j ++) {
			if (this.rows[i][j].controlled) {
				this.rows[i][j].color = color;
			}
		}
	}

	this.updateControlled();

	if (this.hasWon()) {
		alert('You win!');
	}

};

Game.prototype.hasWon = function hasWon() {
	var color = this.rows[0][0].color;
	for (var i = 0; i < this.size; i ++) {
		for (var j = 0; j < this.size; j ++) {
			if (this.rows[i][j].color != color) {
				return false;
			}
		}
	}
	return true;
};

ko.applyBindings(new Game);
