var COLORS = ['red', 'orange', 'yellow', 'green', 'blue', 'violet'];

function Square(game) {
	this.game = game;
	this.reset();
	ko.track(this);
}

Square.prototype.reset = function reset() {
	this.controlled = false;
	this.color = _.sample(COLORS);
};

Square.prototype.flood = function flood() {
	this.game.flood(this.color);
};

function Game() {

	this.size = 14;
	this.moveCount = 0;
	this.expected = 25;

	this.rows = [];
	for (var i = 0; i < this.size; i ++) {
		var row = [];
		for (var j = 0; j < this.size; j ++) {
			row.push(new Square(this));
		}
		this.rows.push(row);
	}

	this.reset();

	ko.track(this);

}

Game.prototype.reset = function reset() {

	this.moveCount = 0;

	for (var i = 0; i < this.size; i ++) {
		for (var j = 0; j < this.size; j ++) {
			this.rows[i][j].reset();
		}
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

	if (this.rows[0][0].color == color)
		return;

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
		var me = this;
		setTimeout(function() {
			if (me.moveCount <= me.expected)
				me.expected --;
			me.reset();
		}, 2000);
	}

};

Game.prototype.hasWon = function hasWon() {
	var firstColor = this.rows[0][0].color;
	for (var i = 0; i < this.size; i ++) {
		for (var j = 0; j < this.size; j ++) {
			if (this.rows[i][j].color != firstColor) {
				return false;
			}
		}
	}
	return true;
};

Game.prototype.askAboutReset = function askAboutReset() {
	var go;
	if ((this.moveCount) && (!this.hasWon()))
		go = confirm('Are you sure you want to reset?');
	else
		go = true;
	if (go)
		this.reset();
};

ko.applyBindings(new Game);