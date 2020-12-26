class AliveCode
{
	constructor(container)
	{
		this.width = window.innerWidth;
		this.height = window.innerHeight;

		this.fontFamily = "Lucida Console";
		this.fontSize = 16;
		this.font = {
			normal: this.getFontSize() + " " + this.fontFamily,
			italic: "italic " + this.getFontSize() + " " + this.fontFamily
		};

		this.canvas = document.createElement("canvas");
		this.canvas.width = this.width;
		this.canvas.height = this.height;

		if(container)
		{
			container.appendChild(this.canvas);
		}

		this.ctx = this.canvas.getContext("2d");
		this.ctx.font = this.font.normal;

		this.backgroundColor = "rgb(25,37,60)";
		this.lineSpace = 4;
		this.colorPalette = [];

		this.lines = [];

		this.lastTime = 0;
		this.elapsedTime = 0;
		this.timeToKey = 1000 / 10;

		this.currentLine = 0;
		this.currentToken = 0;
		this.currentChar = 0;
		this.finishedLine = false;
		this.toRedraw = true;

		this.onTokenEnd = function() {};
		this.onLineEnd = function() {};
	}

	getFontSize()
	{
		return this.fontSize.toString() + "px";
	}

	setContainer(container)
	{
		container.appendChild(this.canvas);
	}

	setFontFamily(font)
	{
		this.fontFamily = font;
		this.font = {
			normal: this.getFontSize() + " " + this.fontFamily,
			italic: "italic " + this.getFontSize() + " " + this.fontFamily
		};
	}

	setFontSize(size)
	{
		this.fontSize = size;
		this.font = {
			normal: this.getFontSize() + " " + this.fontFamily,
			italic: "italic " + this.getFontSize() + " " + this.fontFamily
		};
	}

	setVelocity(velocity)
	{
		this.timeToKey = 1000 / velocity;
	}

	start()
	{
		this.initDraw();

		this.lastTime = performance.now();
		window.requestAnimationFrame(this.loop.bind(this));
	}

	initDraw()
	{
		this.ctx.fillStyle = this.backgroundColor;
		this.ctx.fillRect(0, 0, this.width, this.height);
	}

	loop()
	{
		const currentTime = performance.now();
		const deltaTime = currentTime - this.lastTime;
		this.lastTime = currentTime;

		this.update(deltaTime);
		if(this.toRedraw)
		{
			this.redraw();
		}

		window.requestAnimationFrame(this.loop.bind(this));
	}

	update(deltaTime)
	{
		if(this.currentLine == this.lines.length)
		{
			this.toRedraw = false;
			return;
		}
		else if(this.currentToken > this.lines[this.currentLine].length)
		{
			this.finishedLine = true;
		}

		if(this.finishedLine)
		{
			this.currentLine += 1;
			this.onLineEnd();

			this.currentToken = 0;
			this.currentChar = 0;
			this.finishedLine = false;

			if(this.currentLine == this.lines.length)
			{
				this.toRedraw = false;
				return;
			}
		}

		this.elapsedTime += deltaTime;
		if(this.elapsedTime >= this.timeToKey)
		{
			this.toRedraw = true;
			this.elapsedTime = 0;
		}
		else
		{
			this.toRedraw = false;
		}
	}

	redraw()
	{
		this.clearLine(this.currentLine);
		this.drawLine(this.currentLine);
	}

	clearLine(lineId)
	{
		const lineY = this.getLinePosition(lineId + 1) - this.fontSize;

		this.ctx.fillStyle = this.backgroundColor;
		this.ctx.fillRect(0, lineY, this.width, lineY + this.fontSize);
	}

	drawLine(lineId)
	{
		const lineY = this.getLinePosition(lineId + 1);

		this.ctx.font = this.font.normal;
		this.ctx.fillStyle = this.colorPalette[0];

		const lineIdStr = (lineId + 1).toString();
		const padding = this.getLeftPadding(0) / 2 - this.ctx.measureText(lineIdStr.substr(1)).width;

		this.ctx.fillText(lineIdStr, padding, lineY);

		let lineX = 0;
		for(let i = 0; i < this.currentToken; ++i)
		{
			const token = this.lines[lineId][i];

			if(token.italic)
			{
				this.ctx.font = this.font.italic;
			}
			else
			{
				this.ctx.font = this.font.normal;
			}

			this.ctx.fillStyle = this.colorPalette[token.colorId];
			this.ctx.fillText(token.value, this.getLeftPadding(0) + lineX, lineY);
			lineX += this.ctx.measureText(token.value).width;
		}

		if(this.currentToken == this.lines[lineId].length)
		{
			this.currentToken += 1;
			this.onTokenEnd();
			return;
		}

		const token = this.lines[lineId][this.currentToken];
		if(this.currentChar + 1 >= token.value.length)
		{
			if(token.italic)
			{
				this.ctx.font = this.font.italic;
			}
			else
			{
				this.ctx.font = this.font.normal;
			}

			this.ctx.fillStyle = this.colorPalette[token.colorId];
			this.ctx.fillText(token.value, this.getLeftPadding(0) + lineX, lineY);

			lineX += this.ctx.measureText(token.value).width;
			this.drawCursor(this.getLeftPadding(0) + lineX, lineY);

			this.currentToken += 1;
			this.onTokenEnd();

			this.currentChar = 0;
			return;
		}

		this.ctx.font = this.font.normal;
		this.ctx.fillStyle = this.colorPalette[token.preColorId];
		this.ctx.fillText(token.value.substr(0, this.currentChar + 1), this.getLeftPadding(0) + lineX, lineY);

		lineX += this.ctx.measureText(token.value.substr(0, this.currentChar + 1)).width;
		this.drawCursor(this.getLeftPadding(0) + lineX, lineY);

		this.currentChar += 1;
	}

	drawCursor(posX, posY)
	{
		this.ctx.strokeStyle = "rgb(250, 250, 250)";
		this.ctx.lineWidth = 2;
		this.ctx.beginPath();
		this.ctx.moveTo(posX, posY + 4);
		this.ctx.lineTo(posX, posY + 4 - this.fontSize);
		this.ctx.stroke();
	}

	getLinePosition(line)
	{
		return (this.fontSize + this.lineSpace) + line * (this.fontSize + this.lineSpace);
	}

	getLeftPadding(tab)
	{
		return (this.fontSize * 4);
	}
};

class TextToken
{
	constructor(value, colorId, preColorId, italic)
	{
		this.value = value;
		this.colorId = colorId;
		this.preColorId = preColorId;
		this.italic = italic ? italic : false;
	}
};