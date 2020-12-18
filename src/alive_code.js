class AliveCode
{
	constructor(container)
	{
		this.width = window.innerWidth;
		this.height = window.innerHeight;
		this.fontNormal = "16px 'Inconsolata'";
		this.fontItalic = "italic 16px 'Inconsolata'";

		this.canvas = document.createElement("canvas");
		this.canvas.width = this.width;
		this.canvas.height = this.height;
		container.appendChild(this.canvas);

		this.ctx = this.canvas.getContext("2d");
		this.ctx.font = "16px 'Inconsolata'";

		this.bgColor = "rgb(25,37,60)";
		this.fontSize = 16;
		this.lineSpace = 4;
		this.fontColor = [
			"rgb(64,76,100)",
			"rgb(200,200,200)",
			"rgb(236,116,84)",
			"rgb(34,154,138)", // string
			"rgb(175,110,175)",
		];

		this.lines = [
			[
				new TextToken("var", 4, 1, true),
				new TextToken(" message", 1, 1),
				new TextToken(" =", 2, 2),
				new TextToken(" \"Hello World!\"", 3, 3),
				new TextToken(";", 1, 1)
			],
			[
				new TextToken("// Good bye World!", 0, true)
			]
		];

		this.lastTime = 0;
		this.elapsedTime = 0;
		this.timeToKey = 1000 / 10;

		this.currentLine = 0;
		this.currentToken = 0;
		this.currentChar = 0;
		this.finishedLine = false;
		this.toRedraw = true;
	}

	start()
	{
		this.draw();

		this.lastTime = performance.now();
		window.requestAnimationFrame(this.loop.bind(this));
	}

	draw()
	{
		this.ctx.fillStyle = this.bgColor;
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

		this.ctx.fillStyle = this.bgColor;
		this.ctx.fillRect(0, lineY, this.width, lineY + this.fontSize);
	}

	drawLine(lineId)
	{
		const lineY = this.getLinePosition(lineId + 1);

		this.ctx.font = this.fontNormal;
		this.ctx.fillStyle = this.fontColor[0];
		this.ctx.fillText((lineId + 1).toString(), this.getLeftPadding(0) / 2, lineY);

		let lineX = 0;
		for(let i = 0; i < this.currentToken; ++i)
		{
			const token = this.lines[lineId][i];

			if(token.italic)
			{
				this.ctx.font = this.fontItalic;
			}
			else
			{
				this.ctx.font = this.fontNormal;
			}

			this.ctx.fillStyle = this.fontColor[token.colorId];
			this.ctx.fillText(token.value, this.getLeftPadding(0) + lineX, lineY);
			lineX += this.ctx.measureText(token.value).width;
		}

		if(this.currentToken == this.lines[lineId].length)
		{
			this.currentToken += 1;
			return;
		}

		const token = this.lines[lineId][this.currentToken];
		if(this.currentChar + 1 >= token.value.length)
		{
			if(token.italic)
			{
				this.ctx.font = this.fontItalic;
			}
			else
			{
				this.ctx.font = this.fontNormal;
			}

			this.ctx.fillStyle = this.fontColor[token.colorId];
			this.ctx.fillText(token.value, this.getLeftPadding(0) + lineX, lineY);

			lineX += this.ctx.measureText(token.value).width;
			this.drawCursor(this.getLeftPadding(0) + lineX, lineY);

			this.currentToken += 1;
			this.currentChar = 0;
			return;
		}

		this.ctx.font = this.fontNormal;
		this.ctx.fillStyle = this.fontColor[token.preColorId];
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