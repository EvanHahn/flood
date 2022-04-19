var COLORS = ['red', 'orange', 'yellow', 'green', 'blue', 'violet'];

function Square(game) {
	this.game = game;
	this.reset();
	ko.track(this);
}

Square.prototype.reset = function reset() {
	this.controlled = false;
	this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
};

Square.prototype.flood = function flood() {
	this.game.flood(this.color);
};

function Game() {

	this.size = 14;
	this.moveCount = 0;
	this.expected = 25;

	this.rows = [];
	for (var i = 0; i < this.size; i++) {
		var row = [];
		for (var j = 0; j < this.size; j++) {
			row.push(new Square(this));
		}
		this.rows.push(row);
	}

	this.reset();

	ko.track(this);

}

Game.prototype.reset = function reset() {

	this.moveCount = 0;

	for (var i = 0; i < this.size; i++) {
		for (var j = 0; j < this.size; j++) {
			this.rows[i][j].reset();
		}
	}

	this.rows[0][0].controlled = true;
	this.updateControlled();

};

Game.prototype.getNeighbors = function getNeighbors(i, j) {
	var color = this.rows[i][j].color;
	var neighbors = [];

	if (i > 0) {
		var up = this.rows[i - 1][j];
		if (up.color == color && !up.controlled) {
			up.controlled = true;
			neighbors.push([i - 1, j]);
		}
	}

	if (i < (this.size - 1)) {
		var down = this.rows[i + 1][j];
		if (down.color == color && !down.controlled) {
			down.controlled = true;
			neighbors.push([i + 1, j]);
		}
	}

	if (j > 0) {
		var left = this.rows[i][j - 1];
		if (left.color == color && !left.controlled) {
			left.controlled = true;
			neighbors.push([i, j - 1]);
		}
	}

	if (j < (this.size - 1)) {
		var right = this.rows[i][j + 1];
		if (right.color == color && !right.controlled) {
			right.controlled = true;
			neighbors.push([i, j + 1]);
		}
	}

	return neighbors;
}

Game.prototype.updateControlled = function updateControlled() {
	var queue = [];
	for (var i = 0; i < this.size; i++) {
		for (var j = 0; j < this.size; j++) {
			if (this.rows[i][j].controlled) {
				var neighbors = this.getNeighbors(i, j);
				for (var n = 0; n < neighbors.length; n++) {
					queue.push(neighbors[n]);
				}
			}
		}
	}

	while (queue.length > 0) {
		var cur = queue.shift();
		var i = cur[0];
		var j = cur[1];
		var neighbors = this.getNeighbors(i, j);
		for (var n = 0; n < neighbors.length; n++) {
			queue.push(neighbors[n]);
		}
	}
};

Game.prototype.flood = function flood(color) {

	if (this.rows[0][0].color == color)
		return;

	this.moveCount++;

	this.rows[0][0].color = color;

	for (var i = 0; i < this.size; i++) {
		for (var j = 0; j < this.size; j++) {
			if (this.rows[i][j].controlled) {
				this.rows[i][j].color = color;
			}
		}
	}

	this.updateControlled();

	if (this.hasWon()) {
		var me = this;
		setTimeout(function () {
			if (me.moveCount <= me.expected)
				me.expected--;
			me.reset();
		}, 2000);
	}

};

Game.prototype.hasWon = function hasWon() {
	var firstColor = this.rows[0][0].color;
	for (var i = 0; i < this.size; i++) {
		for (var j = 0; j < this.size; j++) {
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