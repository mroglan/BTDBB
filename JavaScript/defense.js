let canvas, ctx, w, h, gameArea, infoDiv;
let animation1, animation2;
let oldTime = 0;
let trackSelected = 0;
let imageLoadCount = 0;
let image1, image2, image3, image4, image5, image6, image7, image8, image9, image10, image11, image12, image13, image14, image15, image16, image17, image18;
let event1, event2, event3, event4, event5, event6, event7, event8, event9, event10, event11, event12;
let mousePos;
let endPointsArray = []; 
let enemyArray = [], activeEnemyArray = [];
let barbarianSpriteSheet, barbarianSpriteArray = [];
let barbarian2Sprite, barbarian2SpriteArray = [];
let barbarian3Sprite, barb3SpriteArray = [], barb4SpriteArray = [], barb5SpriteArray = [];
let barbArcherSprite, barbArcherSpriteArray = [];
let barbArcher2Sprite, barbArcher2SpriteArray = [], barbArcher3SpriteArray = [];
let skeleImage;
let fastBarbImage;
let fastBarb2Sprite, fastBarb2SpriteArray = [];
let romanHead, romanSprite, romanSpriteArray = [], romanSoldierCost = 250;
let archerHead, archerSprite, archerSpriteArray = [], archerCost = 500;
let calvaryHead, calvarySprite, calvarySpriteArray = [], calvaryCost = 600;
let sniperHead, sniperSprite, sniperSpriteArray = [], sniperCost = 1000;
let generalImage, generalHead, generalCost = 2000;
let medicImage, medicHead, medicCost = 2000;
let riflemanHead, riflemanSprite, riflemanSpriteArray = [], riflemanCost = 2500;
let wizardHead, wizardSprite, wizardSpriteArray = [], wizardCost = 3500;
let cannonImage, cannonCost = 800;
let shipImage, shipCost = 900;
let waveNum = 0;
let playerHealth = 100, playerMoney = 500;
let pageNum = 1;
let enemySpawnCounter = 0;
let waterRectanglesArray = [], waterCirclesArray = [];
let itemNumSelected = 0, troopSelected = -1;
let beginNextWave = false, waveCounter = 0;
let drawPlacement = false;
let troopArray = [];
let hoverText = '';
let arrowImage, arrowArray = [], cannonballImage, explosionImage, explosionArray = [], flamingArrow, flameImage, bulletImage, fireBall;
let fastForward = false;
let sound1;

//hello world

class SideFireball {
	
	constructor(troop, x, y, angle, speed, damage) {
		this.troop = troop;
		this.x = x;
		this.y = y;
		this.angle = angle;
		this.speed = speed;
		this.damage = damage;
		this.speedX = 0;
		this.speedY = 0;
		this.width = .02 * h * 640 / 480;
		this.height = .02 * h;
		this.hitArray = [];
	}
	
	calcTrajectory() {
		this.speedX = this.speed * Math.cos(this.angle);
		this.speedY = this.speed * Math.sin(this.angle);
	}
	
	draw() {
		ctx.save();
		this.x += this.speedX;
		this.y += this.speedY;
		
		ctx.translate(this.x + this.width/2, this.y + this.height/2);
		
		ctx.rotate(this.angle + Math.PI);
		
		ctx.drawImage(fireBall, 0, 0, 640, 480, -this.width/2, -this.height/2, this.width, this.height);
		
		ctx.restore();
	}
	
	testForCollision(index) {
		for(let i = 0; i < activeEnemyArray.length; i++) {
			let enemy = activeEnemyArray[i];
			let alreadyHit = false;
			for(let j = 0; j < this.hitArray.length; j++) {
				if(this.hitArray[j] === enemy) {
					alreadyHit = true;
				}
			}
			if(!alreadyHit && this.x + this.width/2 > enemy.x && this.x + this.width/2 < enemy.x + enemy.width && this.y + this.height/2 > enemy.y && this.y + this.height/2 < enemy.y + enemy.height) {
				this.hitArray.push(enemy);
				enemy.health -= this.damage;
				enemy.onFire = true;
				this.troop.strikes++;
				//sound1.play();
				if(this.stun) {
					enemy.stunned = true;
					enemy.stunTime = 60;
					enemy.stunnedCount = 0;
				}
				if(this.teleport) {
					enemy.x = endPointsArray[enemy.endPointCount - 1].x;
					enemy.y = endPointsArray[enemy.endPointCount - 1].y;
				}
				break;
			}
			if(this.hitArray.length > 7) {
				arrowArray.splice(index, 1);
			}
		}
	}
	
	testForExit(index) {
		if(this.x > w || this.x + this.width < 0 || this.y > h || this.y + this.height < 0) {
			arrowArray.splice(index, 1);
		}
	}
}

class Fireball {
	
	constructor(troop, targetNum, speed, x, y, damage, stun, teleport) {
		this.troop = troop;
		this.target = activeEnemyArray[targetNum];
		this.speed = speed;
		this.x = x;
		this.y = y;
		this.speedX = 0;
		this.speedY = 0;
		this.angle = 0;
		this.targetArray = activeEnemyArray;
		this.height = .02 * h;
		this.width = .02 * h * 640 / 480;
		this.hitArray = [];
		this.damage = damage;
		this.stun = stun;
		this.teleport = teleport;
	}
	
	calcTrajectory() {
		this.angle = Math.atan2(this.target.y + this.target.height/2 - this.y - this.height/2, this.target.x + this.target.width/2 - this.x - this.width/2);
		this.speedX = this.speed * Math.cos(this.angle);
		this.speedY = this.speed * Math.sin(this.angle);
	}
	
	draw() {
		ctx.save();
		this.x += this.speedX;
		this.y += this.speedY;
		
		ctx.translate(this.x + this.width/2, this.y + this.height/2);
		
		ctx.rotate(this.angle + Math.PI);
		
		ctx.drawImage(fireBall, 0, 0, 640, 480, -this.width/2, -this.height/2, this.width, this.height);
		
		ctx.restore();
	}
	
	testForCollision(index) {
		for(let i = 0; i < activeEnemyArray.length; i++) {
			let enemy = activeEnemyArray[i];
			let alreadyHit = false;
			for(let j = 0; j < this.hitArray.length; j++) {
				if(this.hitArray[j] === enemy) {
					alreadyHit = true;
				}
			}
			if(!alreadyHit && this.x + this.width/2 > enemy.x && this.x + this.width/2 < enemy.x + enemy.width && this.y + this.height/2 > enemy.y && this.y + this.height/2 < enemy.y + enemy.height) {
				this.hitArray.push(enemy);
				enemy.health -= this.damage;
				enemy.onFire = true;
				this.troop.strikes++;
				//sound1.play();
				if(this.stun) {
					enemy.stunned = true;
					enemy.stunTime = 60;
					enemy.stunnedCount = 0;
				}
				if(this.teleport) {
					enemy.x = endPointsArray[enemy.endPointCount - 1].x;
					enemy.y = endPointsArray[enemy.endPointCount - 1].y;
				}
				break;
			}
			if(this.hitArray.length > 7) {
				arrowArray.splice(index, 1);
			}
		}
	}
	
	testForExit(index) {
		if(this.x > w || this.x + this.width < 0 || this.y > h || this.y + this.height < 0) {
			arrowArray.splice(index, 1);
		}
	}
}

class Wizard {
	
	constructor(x, y, width, height, radius) {
		this.type = 'wizard';
		this.x = x;
		this.y = y;
		this.baseX = x;
		this.baseY = y;
		this.width = width;
		this.height = height;
		this.radius = radius;
		this.health = 200;
		this.maxHealth = 200;
		this.damage = 4;
		this.responseTime = 100;
		this.responseCount = 100;
		this.spriteCount = 0;
		this.levelA = 1;
		this.itemACost = 0;
		this.canAffordA = true;
		this.levelB = 1;
		this.itemBCost = 0;
		this.canAffordB = true;
		this.angle = 0;
		this.strikes = 0;
		this.spotStealth = false;
		this.target = -1;
		this.cost = wizardCost;
		this.stun = false;
		this.teleport = false;
		this.tripleShot = false;
	}
	
	draw() {
		this.responseCount++;
		ctx.save();
		
		ctx.translate(this.x + this.width/2, this.y + this.height/2);
		ctx.rotate(this.angle);
		
		let count = Math.round(this.spriteCount);
		if(!wizardSpriteArray[count]) {
			count = 0;
			this.spriteCount = 0;
			this.x = this.baseX;
			this.y = this.baseY;
			this.angle = 0;
			this.responseCount = 0;
			if(this.checkIfStillInRange()) {
				let fireball = new Fireball(this, this.target, 5, this.x, this.y, this.damage, this.stun, this.teleport);
				arrowArray.push(fireball);
				fireball.calcTrajectory();
				if(this.tripleShot) {
					let fireball2 = new SideFireball(this, this.x, this.y, fireball.angle + Math.PI/10, 5, this.damage);
					arrowArray.push(fireball2);
					fireball2.calcTrajectory();
					let fireball3 = new SideFireball(this, this.x, this.y, fireball.angle - Math.PI/10, 5, this.damage);
					arrowArray.push(fireball3);
					fireball3.calcTrajectory();
				}
			}
			else {
				this.responseCount = this.responseTime;
			}
		}
		
		if(this.levelA === 4 || this.levelB === 4) {
			ctx.drawImage(image11, 0, 0, 447, 424, -.01 * w, -.01 * w - this.height/2, .01 * w, .01 * w);
		}
		else if(this.levelA === 5 || this.levelB === 5) {
			ctx.drawImage(image11, 0, 0, 447, 424, -.01 * w, -.01 * w - this.height/2, .01 * w, .01 * w);
			ctx.drawImage(image11, 0, 0, 447, 424, 0, -.01 * w - this.height/2, .01 * w, .01 * w);
		}
		
		ctx.drawImage(wizardSprite, wizardSpriteArray[count].x, wizardSpriteArray[count].y, wizardSpriteArray[count].width, wizardSpriteArray[count].height,
		-this.width/2, -this.height/2, this.width, this.height);
		
		ctx.restore();
	}
	
	checkIfStillInRange() {
		if(!activeEnemyArray[this.target]) return false;
		let selected = activeEnemyArray[this.target];
		if(Math.sqrt(Math.pow(selected.x + selected.width/2 - this.baseX - this.width/2, 2) + Math.pow(selected.y + selected.height/2 - this.baseY - this.height/2, 2)) <= 1.2 * this.radius) {
			return true;
		}
		return false;
	}
	
	locateEnemy() {
		ctx.save();
		
		if(this.spriteCount === 0 && this.responseCount >= this.responseTime) {
			this.target = -1;
			for(let i = 0; i < activeEnemyArray.length; i++) {
				let enemy = activeEnemyArray[i];
				//console.log(Math.sqrt(Math.pow(enemy.x - this.baseX - .02 * w, 2) + Math.pow(enemy.y - this.baseY - .02 * w, 2)));
				if(Math.sqrt(Math.pow(enemy.x + enemy.width/2 - this.baseX - this.width/2, 2) + Math.pow(enemy.y + enemy.height/2 - this.baseY - this.height/2, 2)) <= this.radius) {
					if(!enemy.camo) {
						this.target = i;
						this.angle = Math.atan2(enemy.y + enemy.height/2 - this.baseY - .02 * w, enemy.x + enemy.width/2 - this.baseX - .02 * w);
						this.spriteCount+= .2;
						break;
					}
					else if(enemy.camo && this.spotStealth) {
						this.target = i;
						this.angle = Math.atan2(enemy.y + enemy.height/2 - this.baseY - .02 * w, enemy.x + enemy.width/2 - this.baseX - .02 * w);
						this.spriteCount+= .2;
						break;
					}
				}
			}
		}
		
		else if(this.spriteCount > 0) {
			this.spriteCount += .2;
		}
		
		ctx.restore();
	}
	
	registerUpgradeA(level) {
		if(level === 2) {
			this.radius *= 1.3;
		}
		else if(level === 3) {
			this.radius *= 1.3;
		}
		else if(level === 4) {
			this.stun = true;
		}
		else if(level === 5) {
			this.teleport = true;
		}
	}
	
	registerUpgradeB(level) {
		if(level === 2) {
			this.responseTime -= 20;
		}
		else if(level === 3) {
			this.damage += 3;
		}
		else if(level === 4) {
			this.responseTime = 30;
		}
		else if(level === 5) {
			this.tripleShot = true;
		}
	}
}

class Bullet {
	
	constructor(troop, targetNum, speed, x, y, pierce, damage, slowEnemy) {
		this.troop = troop;
		this.target = activeEnemyArray[targetNum];
		this.speed = speed;
		this.x = x;
		this.y = y;
		this.speedX = 0;
		this.speedY = 0;
		this.angle = 0;
		this.targetArray = activeEnemyArray;
		this.width = .0025 * w;
		this.height = (484 * .0025 * w)/50;
		this.pierce = pierce;
		this.hitArray = [];
		this.damage = damage;
		this.slowEnemy = slowEnemy;
	}
	
	calcTrajectory() {
		this.angle = Math.atan2(this.target.y + this.target.height/2 - this.y - this.height/2, this.target.x + this.target.width/2 - this.x - this.width/2);
		this.speedX = this.speed * Math.cos(this.angle);
		this.speedY = this.speed * Math.sin(this.angle);
	}
	
	draw() {
		ctx.save();
		this.x += this.speedX;
		this.y += this.speedY;
		
		ctx.translate(this.x + this.width/2, this.y + this.height/2);
		
		ctx.rotate(this.angle + Math.PI/2);
		
		ctx.drawImage(bulletImage, 0, 0, 104, 489, -this.width/2, -this.height/2, this.width, this.height);
		
		ctx.restore();
	}
	
	testForCollision(index) {
		
		for(let i = 0; i < activeEnemyArray.length; i++) {
			let enemy = activeEnemyArray[i];
			let alreadyHit = false;
			for(let j = 0; j < this.hitArray.length; j++) {
				if(this.hitArray[j] === enemy) {
					alreadyHit = true;
				}
			}
			if(!alreadyHit && this.x > enemy.x && this.x < enemy.x + enemy.width && this.y > enemy.y && this.y < enemy.y + enemy.height) {
				console.log("hello");
				this.hitArray.push(enemy);
				if(this.slowEnemy) {
					enemy.slowDown = true;
					enemy.slowCount = 0;
				}
				enemy.health -= this.damage;
				if(!this.pierce) {
					arrowArray.splice(index, 1);
				}
				this.troop.strikes++;
				//sound1.play();
				break;
			}
			if(this.hitArray.length > 7) {
				arrowArray.splice(index, 1);
			}
		}
	}
	
	testForExit(index) {
		if(this.x > w || this.x + this.width < 0 || this.y > h || this.y + this.height < 0) {
			arrowArray.splice(index, 1);
		}
	}
}

class Rifleman {
	
	constructor(x, y, width, height, radius) {
		this.type = 'rifleman';
		this.x = x;
		this.y = y;
		this.baseX = x;
		this.baseY = y;
		this.width = width; 
		this.height = height;
		this.radius = radius;
		this.health = 150;
		this.maxHealth = 150;
		this.damage = 3;
		this.responseTime = 50;
		this.responseCount = 50;
		this.spriteCount = 0;
		this.levelA = 1;
		this.itemACost = 0;
		this.canAffordA = true;
		this.levelB = 1;
		this.itemBCost = 0;
		this.canAffordB = true;
		this.angle = 0;
		this.strikes = 0;
		this.spotStealth = false;
		this.target = -1;
		this.pierce = false;
		this.cost = riflemanCost;
		this.slowDownEnemy = false;
	}
	
	draw() {
		this.responseCount++;
		ctx.save();
		
		ctx.translate(this.x + this.width/2, this.y + this.height/2);
		ctx.rotate(this.angle);
		
		let count = Math.round(this.spriteCount);
		if(!riflemanSpriteArray[count]) {
			count = 0;
			this.spriteCount = 0;
			this.x = this.baseX;
			this.y = this.baseY;
			this.angle = 0;
			this.responseCount = 0;
			if(this.checkIfStillInRange()) {
				let bullet = new Bullet(this, this.target, 7, this.x, this.y, this.pierce, this.damage, this.slowDownEnemy);
				arrowArray.push(bullet);
				bullet.calcTrajectory();
			}
			else {
				this.responseCount = this.responseTime;
			}
		}
		
		if(this.levelA === 4 || this.levelB === 4) {
			ctx.drawImage(image11, 0, 0, 447, 424, -.01 * w, -.01 * w - this.height/2, .01 * w, .01 * w);
		}
		else if(this.levelA === 5 || this.levelB === 5) {
			ctx.drawImage(image11, 0, 0, 447, 424, -.01 * w, -.01 * w - this.height/2, .01 * w, .01 * w);
			ctx.drawImage(image11, 0, 0, 447, 424, 0, -.01 * w - this.height/2, .01 * w, .01 * w);
		}
		
		ctx.drawImage(riflemanSprite, riflemanSpriteArray[count].x, riflemanSpriteArray[count].y, riflemanSpriteArray[count].width, riflemanSpriteArray[count].height,
		-this.width/2, -this.height/2, this.width, this.height);
		
		ctx.restore();
	}
	
	checkIfStillInRange() {
		if(!activeEnemyArray[this.target]) return false;
		let selected = activeEnemyArray[this.target];
		if(Math.sqrt(Math.pow(selected.x + selected.width/2 - this.baseX - this.width/2, 2) + Math.pow(selected.y + selected.height/2 - this.baseY - this.height/2, 2)) <= 1.2 * this.radius) {
			return true;
		}
		return false;
	}
	
	locateEnemy() {
		ctx.save();
		
		if(this.spriteCount === 0 && this.responseCount >= this.responseTime) {
			this.target = -1;
			for(let i = 0; i < activeEnemyArray.length; i++) {
				let enemy = activeEnemyArray[i];
				//console.log(Math.sqrt(Math.pow(enemy.x - this.baseX - .02 * w, 2) + Math.pow(enemy.y - this.baseY - .02 * w, 2)));
				if(Math.sqrt(Math.pow(enemy.x + enemy.width/2 - this.baseX - this.width/2, 2) + Math.pow(enemy.y + enemy.height/2 - this.baseY - this.height/2, 2)) <= this.radius) {
					if(!enemy.camo) {
						this.target = i;
						this.angle = Math.atan2(enemy.y + enemy.height/2 - this.baseY - .015 * w, enemy.x + enemy.width/2 - this.baseX - 1.267 * .015 * w) + Math.PI;
						this.spriteCount+= .2;
						break;
					}
					else if(enemy.camo && this.spotStealth) {
						this.target = i;
						this.angle = Math.atan2(enemy.y + enemy.height/2 - this.baseY - .015 * w, enemy.x + enemy.width/2 - this.baseX - 1.267 * .015 * w) + Math.PI;
						this.spriteCount+= .2;
						break;
					}
				}
			}
		}
		
		else if(this.spriteCount > 0) {
			this.spriteCount += .2;
		}
		
		ctx.restore();
	}
	
	registerUpgradeA(level) {
		if(level === 2) {
			this.radius *= 1.3;
		}
		else if(level === 3) {
			this.radius *= 1.2;
		}
		else if(level === 4) {
			this.responseTime -= 20;
		}
		else if(level === 5) {
			this.responseTime = 0;
		}
	}
	
	registerUpgradeB(level) {
		if(level === 2) {
			this.damage += 3;
		}
		else if(level === 3) {
			this.pierce = true;
		}
		else if(level === 4) {
			this.damage += 3;
		}
		else if(level === 5) {
			this.slowDownEnemy = true;
		}
	}
}

class Medic {
	
	constructor(x, y, width, height, radius) {
		this.type = 'medic';
		this.x = x;
		this.y = y;
		this.baseX = x;
		this.baseY = y;
		this.width = width;
		this.height = height;
		this.radius = radius;
		this.health = 50;
		this.maxHealth = 50;
		this.levelA = 1;
		this.itemACost = 0;
		this.canAffordA = true;
		this.levelB = 1;
		this.itemBCost = 0;
		this.canAffordB = true;
		this.cost = medicCost;
		this.supportedTroops = [];
		this.troopArrayLength = troopArray.length;
		this.strikes = 0;
		this.responseCount = 500;
		this.responseTime = 500;
		this.spriteCount = 0;
		this.circleRadius = 0;
		this.damage = 0;
	}
	
	draw() {
		ctx.save();
		
		if(this.levelA === 4 || this.levelB === 4) {
			ctx.drawImage(image11, 0, 0, 447, 424, -.01 * w, -.01 * w - this.height/2, .01 * w, .01 * w);
		}
		else if(this.levelA === 5 || this.levelB === 5) {
			ctx.drawImage(image11, 0, 0, 447, 424, -.01 * w, -.01 * w - this.height/2, .01 * w, .01 * w);
			ctx.drawImage(image11, 0, 0, 447, 424, 0, -.01 * w - this.height/2, .01 * w, .01 * w);
		}
		
		ctx.drawImage(medicImage, 0, 0, 380, 512, this.x, this.y, this.width, this.height);
		
		if(beginNextWave && this.drawCircle && this.circleRadius < this.radius) {
			ctx.fillStyle = 'gold';
			ctx.globalAlpha = .3;
			ctx.beginPath();
			ctx.arc(this.x + this.width/2, this.y + this.height/2, this.circleRadius, 0, 2 * Math.PI);
			ctx.fill();
			ctx.closePath();
			this.circleRadius++;
		}
		else {
			this.drawCircle = false;
			this.circleRadius = 0;
		}
		
		ctx.restore();
	}
	
	locateEnemy() {
		this.responseCount++;
		if(troopArray.length != this.troopArrayLength) {
			for(let i = 0; i < troopArray.length; i++) {
				let troop = troopArray[i];
				let applyHealth = true;
				for(let j = 0; j < this.supportedTroops.length; j++) {
					let troop2 = this.supportedTroops[j];
					if(troop2 === troop) {
						applyHealth = false;
						break;
					}
				}
				//if(troop.type === 'medic') applyHealth = false;
				if(applyHealth && Math.sqrt(Math.pow(troop.x + troop.width/2 - this.x - this.width/2, 2) + Math.pow(troop.y + troop.height/2 - this.y - this.height/2, 2)) < this.radius) {
					troop.withMedic = true;
					this.supportedTroops.push(troop);
				}
			}
			this.troopArrayLength = troopArray.length;
		}
		
		if(this.responseCount >= this.responseTime) {
			this.applyHealth();
			this.drawCircle = true;
			this.responseCount = 0;
		}
	}
	
	applyHealth() {
		this.supportedTroops.forEach(function(troop) {
			if(troop.health < troop.maxHealth && beginNextWave) troop.health++;
		});
	}
	
	registerUpgradeA(level) {
		if(level === 2) {
			this.radius *= 1.5;
		}
		else if(level === 3) {
			this.radius += 1.3;
		}
	}
	
	registerUpgradeB(level) {
		if(level === 2) {
			this.responseTime -= 100;
		}
		else if(level === 3) {
			this.responseTime -= 150;
		}
	}
}

class General {
	
	constructor(x, y, width, height, radius) {
		this.type = 'general';
		this.x = x;
		this.y = y;
		this.baseX = x;
		this.baseY = y;
		this.width = width;
		this.height = height;
		this.radius = radius;
		this.health = 150;
		this.maxHealth = 150;
		this.levelA = 1;
		this.itemACost = 0;
		this.canAffordA = true;
		this.levelB = 1;
		this.itemBCost = 0;
		this.canAffordB = true;
		this.cost = generalCost;
		this.supportedTroops = [];
		this.troopArrayLength = troopArray.length;
		this.strikes = 0;
		this.damage = 0;
	}
	
	draw() {
		ctx.save();
		
		if(this.levelA === 4 || this.levelB === 4) {
			ctx.drawImage(image11, 0, 0, 447, 424, -.01 * w, -.01 * w - this.height/2, .01 * w, .01 * w);
		}
		else if(this.levelA === 5 || this.levelB === 5) {
			ctx.drawImage(image11, 0, 0, 447, 424, -.01 * w, -.01 * w - this.height/2, .01 * w, .01 * w);
			ctx.drawImage(image11, 0, 0, 447, 424, 0, -.01 * w - this.height/2, .01 * w, .01 * w);
		}
		
		ctx.drawImage(generalImage, 0, 0, 432, 720, this.x, this.y, this.width, this.height);
		
		ctx.restore();
	}
	
	locateEnemy() {
		if(this.troopArrayLength != troopArray.length) {
			for(let i = 0; i < troopArray.length; i++) {
				let troop = troopArray[i];
				let applyUpgrade = true;
				for(let j = 0; j < this.supportedTroops.length; j++) {
					let troop2 = this.supportedTroops[j];
					if(troop2 === troop) {
						applyUpgrade = false;
						break;
					}
				}
				if(troop.type === 'general') applyUpgrade = false;
				if(applyUpgrade && Math.sqrt(Math.pow(troop.x + troop.width/2 - this.x - this.width/2, 2) + Math.pow(troop.y + troop.height/2 - this.y - this.height/2, 2)) < this.radius) {
					troop.withGeneral = true;
					this.registerUpgrades(troop);
					this.supportedTroops.push(troop);
				}
			}
			this.troopArrayLength = troopArray.length;
		}
	}
	
	registerUpgrades(troop) {
		//troop.responseTime *= .8;
		
		if(this.levelB >= 2) {
			troop.spotStealth = true;
		}
		if(this.levelB === 3) {
			troop.responseTime -= 15;
		}
		else if(this.levelB === 4) {
			troop.responseTime -= 35;
		}
	}
	
	registerUpgradeB(level) {
		this.supportedTroops.forEach(function(troop) {
			if(level === 3) troop.responseTime -= 15;
			else if(level === 4) troop.responseTime -= 20;
			else if(level === 2) troop.spotStealth = true;
		});
	}
	
	registerUpgradeA(level) {
		if(level === 2) {
			this.radius *= 1.3;
		}
		else if(level === 3) {
			this.radius *= 1.4;
		}
		else if(level === 4) {
			this.createLegions();
		}
	}
	
	createLegions() {
		for(let i = 0; i < troopArray.length; i++) {
			let troop = troopArray[i];
			if(troop.type === 'romanSoldier' && Math.sqrt(Math.pow(troop.x + troop.width/2 - this.x - this.width/2, 2) + Math.pow(troop.y + troop.height/2 - this.y - this.height/2, 2)) < this.radius) {
				troop.radius = .05 * w * 1.3 * 1.3;
				troop.spotStealth = true;
				troop.responseTime = 10;
				troop.damage = 5;
				troop.levelA = 5;
				troop.levelB = 5;
			}
		}
	}
}

class FlamingArrow {
	
	constructor(troop, targetNum, speed, x, y, pierce, damage) {
		this.troop = troop;
		this.target = activeEnemyArray[targetNum];
		this.speed = speed;
		this.x = x;
		this.y = y;
		this.pierce = pierce;
		this.damage = damage;
		this.angle = 0;
		this.speedX = 0;
		this.speedY = 0;
		this.targetArray = activeEnemyArray;
		this.width = .015 * w;
		this.height = (324 * .005 * w)/115;
		this.pierce = pierce;
		this.hitArray = [];
		this.damage = damage;
	}
	
	calcTrajectory() {
		this.angle = Math.atan2(this.target.y + this.target.height/2 - this.y - this.height/2, this.target.x + this.target.width/2 - this.x - this.width/2);
		this.speedX = this.speed * Math.cos(this.angle);
		this.speedY = this.speed * Math.sin(this.angle);
	}
	
	draw() {
		ctx.save();
		this.x += this.speedX;
		this.y += this.speedY;
		
		ctx.translate(this.x + this.width/2, this.y + this.height/2);
		
		ctx.rotate(this.angle + Math.PI/2);
		
		ctx.drawImage(flamingArrow, 0, 0, 115, 324, -this.width/2, -this.height/2, this.width, this.height);
		
		ctx.restore();
	}
	
	testForCollision(index) {
		
		for(let i = 0; i < activeEnemyArray.length; i++) {
			let enemy = activeEnemyArray[i];
			let alreadyHit = false;
			for(let j = 0; j < this.hitArray.length; j++) {
				if(this.hitArray[j] === i) {
					alreadyHit = true;
				}
			}
			if(!alreadyHit && this.x > enemy.x && this.x < enemy.x + enemy.width && this.y > enemy.y && this.y < enemy.y + enemy.height) {
				this.hitArray.push(i);
				enemy.health -= this.damage;
				if(!this.pierce) {
					arrowArray.splice(index, 1);
				}
				this.troop.strikes++;
				//sound1.play();
				enemy.onFire = true;
				enemy.flameCount = 0;
				break;
			}
		}
	}
	
	testForExit(index) {
		if(this.x > w || this.x + this.width < 0 || this.y > h || this.y + this.height < 0) {
			arrowArray.splice(index, 1);
		}
	}
}

class Sniper {
	
	constructor(x, y, width, height, radius) {
		this.type = 'sniper';
		this.x = x;
		this.y = y;
		this.baseX = x;
		this.baseY = y;
		this.width = width;
		this.height = height;
		this.radius = radius;
		this.health = 50;
		this.maxHealth = 50;
		this.damage = 5;
		this.spriteCount = 0;
		this.responseTime = 150;
		this.levelA = 1;
		this.itemACost = 0;
		this.canAffordA = true;
		this.levelB = 1;
		this.itemBCost = 0;
		this.canAffordB = true;
		this.angle = 0;
		this.responseCount = 150;
		this.strikes = 0;
		this.spotStealth = false;
		this.target = -1;
		this.cost = sniperCost;
		this.flamingArrows = false;
		this.doubleShot = false;
	}
	
	draw() {
		this.responseCount++;
		ctx.save();
		
		ctx.translate(this.x + this.width/2, this.y + this.height/2);
		ctx.rotate(this.angle);
		
		let count = Math.round(this.spriteCount);
		if(!archerSpriteArray[count]) {
			count = 0;
			this.spriteCount = 0;
			this.x = this.baseX;
			this.y = this.baseY;
			this.angle = 0;
			this.responseCount = 0;
			if(this.checkIfStillInRange()) {
				if(!this.flamingArrows) {
					let arrow = new Arrow(this, this.target, 10, this.x, this.y, this.pierce, this.damage);
					arrowArray.push(arrow);
					arrow.calcTrajectory();
					if(this.doubleShot) {
						let arrow2 = new SideArrow(this, this.x, this.y, arrow.angle + Math.PI/10, 10, this.pierce, this.damage);
						arrowArray.push(arrow2);
						arrow2.calcTrajectory();
					}
				}
				else {
					let arrow = new FlamingArrow(this, this.target, 10, this.x, this.y, this.pierce, this.damage);
					arrowArray.push(arrow);
					arrow.calcTrajectory();
				}
			}
			else {
				this.responseCount = this.responseTime;
			}
		}
		
		if(this.levelA === 4 || this.levelB === 4) {
			ctx.drawImage(image11, 0, 0, 447, 424, -.01 * w, -.01 * w - this.height/2, .01 * w, .01 * w);
		}
		else if(this.levelA === 5 || this.levelB === 5) {
			ctx.drawImage(image11, 0, 0, 447, 424, -.01 * w, -.01 * w - this.height/2, .01 * w, .01 * w);
			ctx.drawImage(image11, 0, 0, 447, 424, 0, -.01 * w - this.height/2, .01 * w, .01 * w);
		}	
		
		ctx.drawImage(sniperSprite, sniperSpriteArray[count].x, sniperSpriteArray[count].y, sniperSpriteArray[count].width, sniperSpriteArray[count].height,
		-this.width/2, -this.height/2, this.width, this.height);
		
		ctx.restore();
	}
	
	checkIfStillInRange() {
		if(!activeEnemyArray[this.target]) return false;
		let selected = activeEnemyArray[this.target];
		if(Math.sqrt(Math.pow(selected.x + selected.width/2 - this.baseX - this.width/2, 2) + Math.pow(selected.y + selected.height/2 - this.baseY - this.height/2, 2)) <= 1.2 * this.radius) {
			return true;
		}
		return false;
	}
	
	locateEnemy() {
		ctx.save();
		
		if(this.spriteCount === 0 && this.responseCount >= this.responseTime) {
			this.target = -1;
			for(let i = 0; i < activeEnemyArray.length; i++) {
				let enemy = activeEnemyArray[i];
				//console.log(Math.sqrt(Math.pow(enemy.x - this.baseX - .02 * w, 2) + Math.pow(enemy.y - this.baseY - .02 * w, 2)));
				if(Math.sqrt(Math.pow(enemy.x + enemy.width/2 - this.baseX - this.width/2, 2) + Math.pow(enemy.y + enemy.height/2 - this.baseY - this.height/2, 2)) <= this.radius) {
					if(!enemy.camo) {
						this.target = i;
						this.angle = Math.atan2(enemy.y + enemy.height/2 - this.baseY - .015 * w, enemy.x + enemy.width/2 - this.baseX - 740/400 * .015 * w) + Math.PI;
						this.spriteCount+= .1;
						break;
					}
					else if(enemy.camo && this.spotStealth) {
						this.target = i;
						this.angle = Math.atan2(enemy.y + enemy.height/2 - this.baseY - .015 * w, enemy.x + enemy.width/2 - this.baseX - 740/400 * .015 * w) + Math.PI;
						this.spriteCount+= .1;
						break;
					}
				}
			}
		}
		
		else if(this.spriteCount > 0) {
			this.spriteCount += .1;
		}
		
		ctx.restore();
	}
	
	registerUpgradeA(level) {
		if(level === 2) {
			this.radius *= 1.3;
		}
		else if(level === 3) {
			this.radius *= 1.3;
		}
		else if(level === 4) {
			this.spotStealth = true;
		}
		else if(level === 5) {
			this.flamingArrows = true;
		}
	}
	
	registerUpgradeB(level) {
		if(level === 2) {
			this.responseTime -= 75;
		}
		else if(level === 3) {
			this.responseTime -= 70;
		}
		else if(level === 4) {
			this.damage = 8;
		}
		else if(level === 5) {
			this.doubleShot = true;
		}
	}
}

class Ship {
	
	constructor(x, y, width, height, radius) {
		this.type = 'ship';
		this.x = x;
		this.y = y;
		this.baseX = x;
		this.baseY = y;
		this.width = width;
		this.height = height;
		this.radius = radius;
		this.health = 400;
		this.maxHealth = 400;
		this.damage = 2;
		this.responseTime = 100;
		this.levelA = 1;
		this.itemACost = 0;
		this.canAffordA = true;
		this.levelB = 1;
		this.itemBCost = 0;
		this.canAffordB = true;
		this.angle = 0;
		this.responseCount = 100;
		this.strikes = 0;
		this.spotStealth = false;
		this.target = -1;
		this.cost = shipCost;
		this.spriteCount = 0;
		this.pierce = false;
		this.shotType = 'arrow';
		this.damageRadius = .02 * w;
	}
	
	draw() {
		this.responseCount++;
		ctx.save();
		
		ctx.translate(this.x + this.width/2, this.y + this.height/2);
		ctx.rotate(this.angle);
		
		if(this.spriteCount >= 2.4) {
			this.spriteCount = 0;
			this.responseCount = 0;
			if(this.checkIfStillInRange()) {
				if(this.shotType === 'arrow') {
					let arrow = new Arrow(this, this.target, 7, this.x + this.width/2, this.y + this.height/2, this.pierce, this.damage);
					arrowArray.push(arrow);
					arrow.calcTrajectory();
				}
				else if(this.shotType === 'cannonball') {
					let cannonball = new CannonBall(this, this.target, 5, this.x + this.width/2, this.y + this.height/2, this.damage, this.damageRadius);
					arrowArray.push(cannonball);
					cannonball.calcTrajectory();
				}
			}
			else {
				this.responseCount = this.responseTime;
			}
		}
		
		if(this.levelA === 4 || this.levelB === 4) {
			ctx.drawImage(image11, 0, 0, 447, 424, -.01 * w, -.01 * w - this.height/2, .01 * w, .01 * w);
		}
		else if(this.levelA === 5 || this.levelB === 5) {
			ctx.drawImage(image11, 0, 0, 447, 424, -.01 * w, -.01 * w - this.height/2, .01 * w, .01 * w);
			ctx.drawImage(image11, 0, 0, 447, 424, 0, -.01 * w - this.height/2, .01 * w, .01 * w);
		}
		
		ctx.drawImage(shipImage, 0, 0, 1125, 1125, -this.width/2, -this.height/2, this.width, this.height);
		
		ctx.restore();
	}
	
	checkIfStillInRange() {
		if(!activeEnemyArray[this.target]) return false;
		let selected = activeEnemyArray[this.target];
		if(Math.sqrt(Math.pow(selected.x + selected.width/2 - this.baseX - this.width/2, 2) + Math.pow(selected.y + selected.height/2 - this.baseY - this.height/2, 2)) <= 1.2 * this.radius) {
			return true;
		}
		return false;
	}
	
	locateEnemy() {
		ctx.save();
		
		if(this.spriteCount === 0 && this.responseCount >= this.responseTime) {
			this.target = -1;
			for(let i = 0; i < activeEnemyArray.length; i++) {
				let enemy = activeEnemyArray[i];
				//console.log(Math.sqrt(Math.pow(enemy.x - this.baseX - .02 * w, 2) + Math.pow(enemy.y - this.baseY - .02 * w, 2)));
				if(Math.sqrt(Math.pow(enemy.x + enemy.width/2 - this.baseX - this.width/2, 2) + Math.pow(enemy.y + enemy.height/2 - this.baseY - this.height/2, 2)) <= this.radius) {
					if(!enemy.camo) {
						this.target = i;
						this.angle = Math.atan2(enemy.y + enemy.height/2 - this.baseY - .03 * w, enemy.x + enemy.width/2 - this.baseX - .03 * w) - Math.PI/2;
						this.spriteCount+= .2;
						break;
					}
					else if(enemy.camo && this.spotStealth) {
						this.target = i;
						this.angle = Math.atan2(enemy.y + enemy.height/2 - this.baseY - .03 * w, enemy.x + enemy.width/2 - this.baseX - .03 * w) - Math.PI/2;
						this.spriteCount+= .2;
						break;
					}
				}
			}
		}
		
		else if(this.spriteCount > 0) {
			this.spriteCount += .2;
		}
		
		ctx.restore();
	}
	
	registerUpgradeA(level) {
		if(level === 2) {
			this.radius *= 1.4;
		}
		else if(level === 3) {
			this.radius *= 1.4;
		}
		else if(level === 4) {
			this.responseTime -= 70;
		}
		else if(level === 5) {
			this.responseTime -= 25;
		}
	}
	
	registerUpgradeB(level) {
		if(level === 2) {
			this.spotStealth = true;
		}
		else if(level === 3) {
			this.pierce = true;
		}
		else if(level === 4) {
			this.shotType = 'cannonball';
			this.damage = 4;
		}
		else if(level === 5) {
			this.damageRadius *= 2.5;
		}
	}
}

class SideCannonBall {
	
	constructor(troop, x, y, angle, speed, damage, expRadius) {
		this.troop = troop;
		this.x = x;
		this.y = y;
		this.angle = angle;
		this.speed = speed;
		this.damage = damage;
		this.expRadius = expRadius;
		this.speedX = 0;
		this.speedY = 0;
		this.width = .02 * w;
		this.height = .02 * w;
	}
	
	calcTrajectory() {
		this.speedX = this.speed * Math.cos(this.angle);
		this.speedY = this.speed * Math.sin(this.angle);
	}
	
	draw() {
		ctx.save();
		this.x += this.speedX;
		this.y += this.speedY;
		ctx.drawImage(cannonballImage, 0, 0, 600, 600, this.x, this.y, this.width, this.height);
		ctx.restore();
	}
	
	testForCollision(index) {
		for(let i = 0; i < activeEnemyArray.length; i++) {
			let enemy = activeEnemyArray[i];
			if(this.x + this.width/2 > enemy.x && this.x + this.width/2 < enemy.x + enemy.width && this.y + this.height/2 > enemy.y && this.y + this.height/2 < enemy.y + enemy.height) {
				let explosion = new Explosion(this.x + this.width/2, this.y + this.height/2, this.expRadius, 0);
				explosionArray.push(explosion);
				for(let j = 0; j < activeEnemyArray.length; j++) {
					let enemy2 = activeEnemyArray[j];
					if(Math.sqrt(Math.pow(enemy2.x + enemy2.width/2 - explosion.x, 2) + Math.pow(enemy2.y + enemy2.height/2 - explosion.y, 2)) <=  1.5 * explosion.radius) {
						enemy2.health -= this.damage;
						this.troop.strikes++;
					}
				}
				arrowArray.splice(index, 1);
				//sound1.play();
				break;
			}
		}
	}
	
	testForExit(index) {
		if(this.x > w || this.x + this.width < 0 || this.y > h || this.y + this.height < 0) {
			arrowArray.splice(index, 1);
		}
	}
}

class Explosion {
	
	constructor(x, y, radius, count) {
		this.width = 2 * radius;
		this.height = 2 * radius;
		this.x = x;
		this.y = y;
		this.radius = radius;
		this.count = count;
	}
	
	draw() {
		this.count++;
		
		ctx.drawImage(explosionImage, 0, 0, 1024, 850, this.x - this.radius, this.y - this.radius, this.width, this.height);
	}
}

class CannonBall {
	
	constructor(troop, targetNum, speed, x, y, damage, expRadius) {
		this.troop = troop;
		this.target = activeEnemyArray[targetNum];
		this.speed = speed;
		this.x = x;
		this.y = y;
		this.speedX = 0;
		this.speedY = 0;
		this.damage = damage;
		this.expRadius = expRadius;
		this.width = .02 * w;
		this.height = .02 * w;
	}
	
	calcTrajectory() {
		this.angle = Math.atan2(this.target.y + this.target.height/2 - this.y - this.height/2, this.target.x + this.target.width/2 - this.x - this.width/2);
		this.speedX = this.speed * Math.cos(this.angle);
		this.speedY = this.speed * Math.sin(this.angle);
	}
	
	draw() {
		ctx.save();
		this.x += this.speedX;
		this.y += this.speedY;
		
		ctx.drawImage(cannonballImage, 0, 0, 600, 600, this.x, this.y, this.width, this.height);
		
		ctx.restore();
	}
	
	testForCollision(index) {
		for(let i = 0; i < activeEnemyArray.length; i++) {
			let enemy = activeEnemyArray[i];
			if(this.x + this.width/2 > enemy.x && this.x + this.width/2 < enemy.x + enemy.width && this.y + this.height/2 > enemy.y && this.y + this.height/2 < enemy.y + enemy.height) {
				let explosion = new Explosion(this.x + this.width/2, this.y + this.height/2, this.expRadius, 0);
				explosionArray.push(explosion);
				for(let j = 0; j < activeEnemyArray.length; j++) {
					let enemy2 = activeEnemyArray[j];
					if(Math.sqrt(Math.pow(enemy2.x + enemy2.width/2 - explosion.x, 2) + Math.pow(enemy2.y + enemy2.height/2 - explosion.y, 2)) <=  1.5 * explosion.radius) {
						enemy2.health -= this.damage;
						this.troop.strikes++;
					}
				}
				arrowArray.splice(index, 1);
				//sound1.play();
				break;
			}
		}
	}
	
	testForExit(index) {
		if(this.x > w || this.x + this.width < 0 || this.y > h || this.y + this.height < 0) {
			arrowArray.splice(index, 1);
		}
	}
}

class Cannon {
	
	constructor(x, y, width, height, radius) {
		this.type = 'cannon';
		this.baseX = x;
		this.baseY = y;
		this.x = x;
		this.y = y;
		this.width= width;
		this.height = height;
		this.radius = radius;
		this.health = 250;
		this.maxHealth = 250;
		this.damage = 2;
		this.responseTime = 170;
		this.levelA = 1;
		this.itemACost = 0;
		this.canAffordA = true;
		this.levelB = 1;
		this.itemBCost = 0;
		this.canAffordB = true;
		this.angle = 0;
		this.responseCount = 170;
		this.strikes = 0;
		this.spotStealth = false;
		this.target = -1;
		this.cost = cannonCost;
		this.doubleShot = false;
		this.tripleShot = false;
		this.spriteCount = 0;
		this.damageRadius = .02 * w;
	}
	
	draw() {
		this.responseCount++;
		ctx.save();
		
		ctx.translate(this.x + this.width/2, this.y + this.height/2);
		ctx.rotate(this.angle);
		
		if(this.spriteCount >= 2.4) {
			this.spriteCount = 0;
			this.responseCount = 0;
			if(this.checkIfStillInRange()) {
				let cannonball = new CannonBall(this, this.target, 5, this.x, this.y, this.damage, this.damageRadius);
				arrowArray.push(cannonball);
				cannonball.calcTrajectory();
				if(this.doubleShot) {
					let sidecannonball = new SideCannonBall(this, this.x, this.y, cannonball.angle + Math.PI/5, 5, this.damage, this.damageRadius);
					arrowArray.push(sidecannonball);
					sidecannonball.calcTrajectory();
				}
				else if(this.tripleShot) {
					let sidecannonball = new SideCannonBall(this, this.x, this.y, cannonball.angle + Math.PI/5, 5, this.damage, this.damageRadius);
					arrowArray.push(sidecannonball);
					sidecannonball.calcTrajectory();
					let sidecannonball2 = new SideCannonBall(this, this.x, this.y, cannonball.angle - Math.PI/5, 5, this.damage, this.damageRadius);
					arrowArray.push(sidecannonball2);
					sidecannonball2.calcTrajectory();
				}
			}
			else {
				this.responseCount = this.responseTime;
			}
		}
		
		if(this.levelA === 4 || this.levelB === 4) {
			ctx.drawImage(image11, 0, 0, 447, 424, -.01 * w, -.01 * w - this.height/2, .01 * w, .01 * w);
		}
		else if(this.levelA === 5 || this.levelB === 5) {
			ctx.drawImage(image11, 0, 0, 447, 424, -.01 * w, -.01 * w - this.height/2, .01 * w, .01 * w);
			ctx.drawImage(image11, 0, 0, 447, 424, 0, -.01 * w - this.height/2, .01 * w, .01 * w);
		}
		
		ctx.drawImage(cannonImage, 0, 0, 62, 52, -this.width/2, -this.height/2, this.width, this.height);
		
		ctx.restore();
	}
	
	checkIfStillInRange() {
		if(!activeEnemyArray[this.target]) return false;
		let selected = activeEnemyArray[this.target];
		if(Math.sqrt(Math.pow(selected.x + selected.width/2 - this.baseX - this.width/2, 2) + Math.pow(selected.y + selected.height/2 - this.baseY - this.height/2, 2)) <= 1.2 * this.radius) {
			return true;
		}
		return false;
	}
	
	locateEnemy() {
		ctx.save();
		
		if(this.spriteCount === 0 && this.responseCount >= this.responseTime) {
			this.target = -1;
			for(let i = 0; i < activeEnemyArray.length; i++) {
				let enemy = activeEnemyArray[i];
				//console.log(Math.sqrt(Math.pow(enemy.x - this.baseX - .02 * w, 2) + Math.pow(enemy.y - this.baseY - .02 * w, 2)));
				if(Math.sqrt(Math.pow(enemy.x + enemy.width/2 - this.baseX - .02 * w, 2) + Math.pow(enemy.y + enemy.height/2 - this.baseY - .02 * w, 2)) <= this.radius) {
					if(!enemy.camo) {
						this.target = i;
						this.angle = Math.atan2(enemy.y + enemy.height/2 - this.baseY - .02 * w, enemy.x + enemy.width/2 - this.baseX - .02 * w) + 2.4 * Math.PI/3;
						this.spriteCount+= .2;
						break;
					}
					else if(enemy.camo && this.spotStealth) {
						this.target = i;
						this.angle = Math.atan2(enemy.y + enemy.height/2 - this.baseY - .02 * w, enemy.x + enemy.width/2 - this.baseX - .02 * w) + 2.4 * Math.PI/3;
						this.spriteCount+= .2;
						break;
					}
				}
			}
		}
		
		else if(this.spriteCount > 0) {
			this.spriteCount += .2;
		}
		
		ctx.restore();
	}
	
	registerUpgradeA(level) {
		if(level === 2) {
			this.radius *= 1.4;
		}
		else if(level === 3) {
			this.radius *= 1.5;
		}
		else if(level === 4) {
			this.damageRadius *= 1.5;
		}
		else if(level === 5) {
			this.damageRadius *= 1.5;
		}
	}
	
	registerUpgradeB(level) {
		if(level === 2) {
			this.damage += 3;
		}
		else if(level === 3) {
			this.responseTime -= 100;
		}
		else if(level === 4) {
			this.doubleShot = true;
		}
		else if(level === 5) {
			this.doubleShot = false;
			this.tripleShot = true;
		}
	}
}

class Calvary {
	
	constructor(baseX, baseY, width, height, radius) {
		this.type = 'calvary';
		this.baseX = baseX;
		this.baseY = baseY;
		this.x = baseX;
		this.y = baseY;
		this.width = width;
		this.height = height;
		this.radius = radius;
		this.health = 200;
		this.maxHealth = 200;
		this.damage = 2;
		this.spriteCount = 0;
		this.responseTime = 140;
		this.levelA = 1;
		this.itemACost = 0;
		this.canAffordA = true;
		this.levelB = 1;
		this.itemBCost = 0;
		this.canAffordB = true;
		this.angle = 0;
		this.responseCount = 140;
		this.strikes = 0;
		this.spotStealth = false;
		this.target = -1;
		this.cost = calvaryCost;
		this.stun = 0;
		this.multiAttack = false;
	}
	
	draw() {
		this.responseCount++;
		ctx.save();
		
		//console.log(this.target);
		if(this.target > -1 && activeEnemyArray[this.target]) {
			this.x = activeEnemyArray[this.target].x + activeEnemyArray[this.target].width/2;
			this.y = activeEnemyArray[this.target].y + activeEnemyArray[this.target].height/2;
		}
		else {
			this.x = this.baseX;
			this.y = this.baseY;
		}
		
		ctx.translate(this.x + this.width/2, this.y + this.height/2);
		ctx.rotate(this.angle);
		
		let count = Math.round(this.spriteCount);
		if(!calvarySpriteArray[count]) {
			if(this.multiAttack) this.hitMultiTargets();
			count = 0;
			this.spriteCount = 0;
			this.x = this.baseX;
			this.y = this.baseY;
			this.angle = 0;
			if(activeEnemyArray[this.target]) {
				activeEnemyArray[this.target].health -= this.damage;
				if(this.stun > 0) {
					activeEnemyArray[this.target].stunned = true;
					activeEnemyArray[this.target].stunTime = this.stun;
					activeEnemyArray[this.target].stunnedCount = 0;
				}
				this.strikes++;
				//sound1.play();
			}
			this.responseCount = 0;
			this.target = -1;
		}
		
		if(this.levelA === 4 || this.levelB === 4) {
			ctx.drawImage(image11, 0, 0, 447, 424, -.01 * w, -.01 * w - this.height/2, .01 * w, .01 * w);
		}
		else if(this.levelA === 5 || this.levelB === 5) {
			ctx.drawImage(image11, 0, 0, 447, 424, -.01 * w, -.01 * w - this.height/2, .01 * w, .01 * w);
			ctx.drawImage(image11, 0, 0, 447, 424, 0, -.01 * w - this.height/2, .01 * w, .01 * w);
		}
		
		ctx.drawImage(calvarySprite, calvarySpriteArray[count].x, calvarySpriteArray[count].y, calvarySpriteArray[count].width, calvarySpriteArray[count].height, 
		-this.width/2, -this.height/2, this.width, this.height);
		
		ctx.restore();
	}
	
	hitMultiTargets() {
		//console.log("hi");
		for(let i = 0; i < activeEnemyArray.length; i++) {
			let enemy = activeEnemyArray[i];
			if(i != this.target && this.x > enemy.x  && this.x < enemy.x + enemy.width && this.y > enemy.y && this.y < enemy.y + enemy.height) {
				enemy.health -= this.damage;
				if(this.stun > 0) {
				enemy.stunned = true;
				enemy.stunTime = this.stun;
				enemy.stunnedCount = 0;
				}
				this.strikes++;
			}
		}
	}
	
	locateEnemy() {
		ctx.save();
		if(this.spriteCount === 0 && this.responseCount >= this.responseTime) {
			this.target = -1;
			//console.log("hi");
			for(let i = 0; i < activeEnemyArray.length; i++) {
				let enemy = activeEnemyArray[i];
				//console.log(Math.sqrt(Math.pow(enemy.x - this.baseX - .02 * w, 2) + Math.pow(enemy.y - this.baseY - .02 * w, 2)));
				if(Math.sqrt(Math.pow(enemy.x + enemy.width/2 - this.baseX - .02 * w, 2) + Math.pow(enemy.y + enemy.height/2 - this.baseY - .02 * w, 2)) <= this.radius) {
					if(!enemy.camo) {
						this.target = i;
						this.angle = Math.atan2(enemy.y - this.baseY - .02 * w, enemy.x - this.baseX - .02 * w) + Math.PI;
						this.spriteCount+= .2;
						break;
					}
					else if(enemy.camo && this.spotStealth) {
						this.target = i;
						this.angle = Math.atan2(enemy.y - this.baseY - .02 * w, enemy.x - this.baseX - .02 * w) + Math.PI;
						this.spriteCount+= .2;
						break;
					}
				}
			}
		}
		
		else if(this.spriteCount > 0) {
			this.spriteCount += .2;
		}
		
		ctx.restore();
	}
	
	registerUpgradeA(level) {
		if(level === 2) {
			this.radius *= 1.3;
		}
		else if(level === 3) {
			this.multiAttack = true;
		}
		else if(level === 4) {
			this.stun = 60;
		}
		else if(level === 5) {
			this.stun = 120;
		}
	}
	
	registerUpgradeB(level) {
		if(level === 2) {
			this.damage += 2;
		}
		else if(level === 3) {
			this.damage += 2;
		}
		else if(level === 4) {
			this.responseTime -= 70;
		}
		else if(level === 5) {
			this.responseTime -= 50;
		}
	}
}

class SideArrow {
	
	constructor(troop, x, y, angle, speed, pierce, damage) {
		this.troop = troop;
		this.x = x;
		this.y = y;
		this.angle = angle;
		this.speed = speed;
		this.pierce = pierce;
		this.damage = damage;
		this.speedX = 0;
		this.speedY = 0;
		this.width = .015 * w;
		this.height = (489 * .005 * w)/104;
		this.hitArray = [];
	}
	
	calcTrajectory() {
		this.speedX = this.speed * Math.cos(this.angle);
		this.speedY = this.speed * Math.sin(this.angle);
	}
	
	draw() {
		ctx.save();
		this.x += this.speedX;
		this.y += this.speedY;
		
		ctx.translate(this.x + this.width/2, this.y + this.height/2);
		
		ctx.rotate(this.angle + Math.PI/2);
		
		ctx.drawImage(arrowImage, 0, 0, 104, 489, -this.width/2, -this.height/2, this.width, this.height);
		
		ctx.restore();
	}
	
	testForCollision(index) {
		
		for(let i = 0; i < activeEnemyArray.length; i++) {
			let enemy = activeEnemyArray[i];
			let alreadyHit = false;
			for(let j = 0; j < this.hitArray.length; j++) {
				if(this.hitArray[j] === enemy) {
					alreadyHit = true;
				}
			}
			if(!alreadyHit && this.x > enemy.x && this.x < enemy.x + enemy.width && this.y > enemy.y && this.y < enemy.y + enemy.height) {
				this.hitArray.push(enemy);
				enemy.health -= this.damage;
				if(!this.pierce) {
					arrowArray.splice(index, 1);
				}
				this.troop.strikes++;
				//sound1.play();
				break;
			}
			if(this.hitArray.length > 5) {
				arrowArray.splice(index, 1);
			}
		}
	}
	
	testForExit(index) {
		if(this.x > w || this.x + this.width < 0 || this.y > h || this.y + this.height < 0) {
			arrowArray.splice(index, 1);
		}
	}
}

class EnemyArrow {
	
	constructor(x, y, angle, speed, damage) {
		this.x = x;
		this.y = y;
		this.angle = angle;
		this.speed = speed;
		this.damage = damage;
		this.speedX = 0;
		this.speedY = 0;
		this.width = .015 * w;
		this.height = (489 * .005 * w)/104;
	}
	
	calcTrajectory() {
		this.speedX = this.speed * Math.cos(this.angle);
		this.speedY = this.speed * Math.sin(this.angle);
	}
	
	draw() {
		ctx.save();
		this.x += this.speedX;
		this.y += this.speedY;
		
		ctx.translate(this.x + this.width/2, this.y + this.height/2);
		
		ctx.rotate(this.angle + Math.PI/2);
		
		ctx.drawImage(arrowImage, 0, 0, 104, 489, -this.width/2, -this.height/2, this.width, this.height);
		
		ctx.restore();
	}
	
	testForCollision(index) {
		for(let i = 0; i < troopArray.length; i++) {
			let troop = troopArray[i];
			if(this.x > troop.x && this.x < troop.x + troop.width && this.y > troop.y && this.y < troop.y + troop.width) {
				troop.health -= this.damage;
				arrowArray.splice(index, 1);
				break;
			}
		}
	}
	
	testForExit(index) {
		if(this.x > w || this.x + this.width < 0 || this.y > h || this.y + this.height < 0) {
			arrowArray.splice(index, 1);
		}
	}
}

class Arrow {
	
	constructor(troop, targetNum, speed, x, y, pierce, damage) {
		this.troop = troop;
		this.target = activeEnemyArray[targetNum];
		this.speed = speed;
		this.x = x;
		this.y = y;
		this.speedX = 0;
		this.speedY = 0;
		this.angle = 0;
		this.targetArray = activeEnemyArray;
		this.width = .015 * w;
		this.height = (489 * .005 * w)/104;
		this.pierce = pierce;
		this.hitArray = [];
		this.damage = damage;
	}
	
	calcTrajectory() {
		this.angle = Math.atan2(this.target.y + this.target.height/2 - this.y - this.height/2, this.target.x + this.target.width/2 - this.x - this.width/2);
		this.speedX = this.speed * Math.cos(this.angle);
		this.speedY = this.speed * Math.sin(this.angle);
	}
	
	draw() {
		ctx.save();
		this.x += this.speedX;
		this.y += this.speedY;
		
		ctx.translate(this.x + this.width/2, this.y + this.height/2);
		
		ctx.rotate(this.angle + Math.PI/2);
		
		ctx.drawImage(arrowImage, 0, 0, 104, 489, -this.width/2, -this.height/2, this.width, this.height);
		
		ctx.restore();
	}
	
	testForCollision(index) {
		
		for(let i = 0; i < activeEnemyArray.length; i++) {
			let enemy = activeEnemyArray[i];
			let alreadyHit = false;
			for(let j = 0; j < this.hitArray.length; j++) {
				if(this.hitArray[j] === enemy) {
					alreadyHit = true;
				}
			}
			if(!alreadyHit && this.x > enemy.x && this.x < enemy.x + enemy.width && this.y > enemy.y && this.y < enemy.y + enemy.height) {
				this.hitArray.push(enemy);
				enemy.health -= this.damage;
				if(!this.pierce) {
					arrowArray.splice(index, 1);
				}
				this.troop.strikes++;
				//sound1.play();
				break;
			}
			else if(this.troop.type === 'sniper' && this.x > enemy.x - enemy.width/2 && this.x < enemy.x + 3 * enemy.width/2 && this.y > enemy.y - enemy.height/2 && this.y < enemy.y + 3 * enemy.height/2) {
				enemy.health -= this.damage;
				arrowArray.splice(index, 1);
				this.troop.strikes++;
				//sound1.play();
				break;
			}
			if(this.hitArray.length > 5) {
				arrowArray.splice(index, 1);
			}
		}
	}
	
	testForExit(index) {
		if(this.x > w || this.x + this.width < 0 || this.y > h || this.y + this.height < 0) {
			arrowArray.splice(index, 1);
		}
	}
}

class Archer {
	
	constructor(baseX, baseY, width, height, radius) {
		this.type = 'archer';
		this.baseX = baseX;
		this.baseY = baseY;
		this.x = baseX;
		this.y = baseY;
		this.width = width;
		this.height = height;
		this.radius = radius;
		this.health = 50;
		this.maxHealth = 50;
		this.damage = 1;
		this.spriteCount = 0;
		this.responseTime = 120;
		this.levelA = 1;
		this.itemACost = 0;
		this.canAffordA = true;
		this.levelB = 1;
		this.itemBCost = 0;
		this.canAffordB = true;
		this.angle = 0;
		this.responseCount = 120;
		this.strikes = 0;
		this.spotStealth = false;
		this.target = -1;
		this.pierce = false;
		this.tripleShot = false;
		this.cost = archerCost;
	}
	
	draw() {
		this.responseCount++;
		ctx.save();
		
		ctx.translate(this.x + this.width/2, this.y + this.height/2);
		ctx.rotate(this.angle);
		
		let count = Math.round(this.spriteCount);
		if(!archerSpriteArray[count]) {
			count = 0;
			this.spriteCount = 0;
			this.x = this.baseX;
			this.y = this.baseY;
			this.angle = 0;
			this.responseCount = 0;
			if(this.checkIfStillInRange()) {
				let arrow = new Arrow(this, this.target, 7, this.x, this.y, this.pierce, this.damage);
				arrowArray.push(arrow);
				arrow.calcTrajectory();
				if(this.tripleShot) {
					let sideArrow = new SideArrow(this, this.x, this.y, arrow.angle + Math.PI/10, 7, this.pierce, this.damage);
					arrowArray.push(sideArrow);
					sideArrow.calcTrajectory();
					let sideArrow2 = new SideArrow(this, this.x, this.y, arrow.angle - Math.PI/10, 7, this.pierce, this.damage);
					arrowArray.push(sideArrow2);
					sideArrow2.calcTrajectory();
				}
			}
			else {
				this.responseCount = this.responseTime;
			}
		}
		
		if(this.levelA === 4 || this.levelB === 4) {
			ctx.drawImage(image11, 0, 0, 447, 424, -.01 * w, -.01 * w - this.height/2, .01 * w, .01 * w);
		}
		else if(this.levelA === 5 || this.levelB === 5) {
			ctx.drawImage(image11, 0, 0, 447, 424, -.01 * w, -.01 * w - this.height/2, .01 * w, .01 * w);
			ctx.drawImage(image11, 0, 0, 447, 424, 0, -.01 * w - this.height/2, .01 * w, .01 * w);
		}		
		
		ctx.drawImage(archerSprite, archerSpriteArray[count].x, archerSpriteArray[count].y, archerSpriteArray[count].width, archerSpriteArray[count].height, 
		-this.width/2, -this.height/2, this.width, this.height);
		
		ctx.restore();
	}
	
	checkIfStillInRange() {
		if(!activeEnemyArray[this.target]) return false;
		let selected = activeEnemyArray[this.target];
		if(Math.sqrt(Math.pow(selected.x + selected.width/2 - this.baseX - this.width/2, 2) + Math.pow(selected.y + selected.height/2 - this.baseY - this.height/2, 2)) <= 1.2 * this.radius) {
			return true;
		}
		return false;
	}
	
	locateEnemy() {
		ctx.save();
		
		if(this.spriteCount === 0 && this.responseCount >= this.responseTime) {
			this.target = -1;
			for(let i = 0; i < activeEnemyArray.length; i++) {
				let enemy = activeEnemyArray[i];
				//console.log(Math.sqrt(Math.pow(enemy.x - this.baseX - .02 * w, 2) + Math.pow(enemy.y - this.baseY - .02 * w, 2)));
				if(Math.sqrt(Math.pow(enemy.x + enemy.width/2 - this.baseX - this.width/2, 2) + Math.pow(enemy.y + enemy.height/2 - this.baseY - this.height/2, 2)) <= this.radius) {
					if(!enemy.camo) {
						this.target = i;
						this.angle = Math.atan2(enemy.y + enemy.height/2 - this.baseY - .015 * w, enemy.x - enemy.width/2 - this.baseX - 1.267 * .015 * w);
						this.spriteCount+= .2;
						break;
					}
					else if(enemy.camo && this.spotStealth) {
						this.target = i;
						this.angle = Math.atan2(enemy.y + enemy.height/2 - this.baseY - .015 * w, enemy.x + enemy.width/2 - this.baseX - 1.267 * .015 * w);
						this.spriteCount+= .2;
						break;
					}
				}
			}
		}
		
		else if(this.spriteCount > 0) {
			this.spriteCount += .2;
		}
		
		ctx.restore();
	}
	
	registerUpgradeA(level) {
		if(level === 2) {
			this.radius *= 1.3;
		}
		else if(level === 3) {
			this.radius *= 1.3;
		}
		else if(level === 4) {
			this.spotStealth = true;
		}
		else if(level === 5) {
			this.tripleShot = true;
		}
	}
	
	registerUpgradeB(level) {
		if(level === 2) {
			this.responseTime -= 50;
		}
		else if(level === 3) {
			this.pierce = true;
		}
		else if(level === 4) {
			this.damage += 2;
		}
		else if(level === 5) {
			this.responseTime -= 50;
		}
	}
}

class RomanSoldier {
	
	constructor(baseX, baseY, x, y, width, height, radius) {
		this.type = 'romanSoldier';
		this.baseX = baseX;
		this.baseY = baseY;
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.radius = radius;
		this.health = 230;
		this.maxHealth = 230;
		this.damage = 1;
		this.spriteCount = 0;
		this.responseTime = 100;
		this.levelA = 1;
		this.itemACost = 0;
		this.canAffordA = true;
		this.levelB = 1;
		this.itemBCost = 0;
		this.canAffordB = true;
		this.angle = 0;
		this.responseCount = 100;
		this.strikes = 0;
		this.spotStealth = false;
		this.target = -1;
		this.cost = romanSoldierCost;
	}
	
	draw() {
		this.responseCount++;
		ctx.save();
		
		if(this.target > -1 && activeEnemyArray[this.target]) {
			this.x = activeEnemyArray[this.target].x;
			this.y = activeEnemyArray[this.target].y;
		}
		else {
			this.x = this.baseX;
			this.y = this.baseY;
		}
		
		ctx.translate(this.x + this.width/2, this.y + this.height/2);
		ctx.rotate(this.angle);
		
		let count = Math.round(this.spriteCount);
		if(!romanSpriteArray[count]) {
			count = 0;
			this.spriteCount = 0;
			this.x = this.baseX;
			this.y = this.baseY;
			this.angle = 0;
			if(activeEnemyArray[this.target]) {
				activeEnemyArray[this.target].health -= this.damage;
				this.strikes++;
				//sound1.play();
			}
			this.responseCount = 0;
			this.target = -1;
		}
		if(this.spriteCount === 1.6) {
			this.width = 1.45 * this.width;
		}
		else {
			this.width = .04 * w;
		}
		
		if(this.levelA === 4 || this.levelB === 4) {
			ctx.drawImage(image11, 0, 0, 447, 424, -.01 * w, -.01 * w - this.height/2, .01 * w, .01 * w);
		}
		else if(this.levelA === 5 || this.levelB === 5) {
			ctx.drawImage(image11, 0, 0, 447, 424, -.01 * w, -.01 * w - this.height/2, .01 * w, .01 * w);
			ctx.drawImage(image11, 0, 0, 447, 424, 0, -.01 * w - this.height/2, .01 * w, .01 * w);
		}
		
		ctx.drawImage(romanSprite, romanSpriteArray[count].x, romanSpriteArray[count].y, romanSpriteArray[count].width, romanSpriteArray[count].height, 
		-this.width/2, -this.height/2, this.width, this.height);
		
		ctx.restore();
	}
	
	locateEnemy() {
		ctx.save();
		if(this.spriteCount === 0 && this.responseCount >= this.responseTime) {
			this.target = -1;
			for(let i = 0; i < activeEnemyArray.length; i++) {
				let enemy = activeEnemyArray[i];
				//console.log(Math.sqrt(Math.pow(enemy.x - this.baseX - .02 * w, 2) + Math.pow(enemy.y - this.baseY - .02 * w, 2)));
				if(Math.sqrt(Math.pow(enemy.x + enemy.width/2 - this.baseX - .02 * w, 2) + Math.pow(enemy.y + enemy.height/2 - this.baseY - .02 * w, 2)) <= this.radius) {
					if(!enemy.camo) {
						this.target = i;
						this.angle = Math.atan2(enemy.y - this.baseY - .02 * w, enemy.x - this.baseX - .02 * w);
						this.spriteCount+= .2;
						break;
					}
					else if(enemy.camo && this.spotStealth) {
						this.target = i;
						this.angle = Math.atan2(enemy.y - this.baseY - .02 * w, enemy.x - this.baseX - .02 * w);
						this.spriteCount+= .2;
						break;
					}
				}
			}
		}
		
		else if(this.spriteCount > 0) {
			this.spriteCount += .2;
		}
		
		ctx.restore();
	}
	
	registerUpgradeA(level) {
		if(level === 2) {
			this.radius *= 1.3;
		}
		else if(level === 3) {
			this.radius *= 1.3;
		}
		else if(level === 4) {
			this.spotStealth = true;
		}
	}
	
	registerUpgradeB(level) {
		if(level === 2) {
			this.responseTime -= 30;
		}
		else if(level === 3 ) {
			this.damage = 2;
		}
		else if(level === 4) {
			this.responseTime -= 40;
		}
		else if(level === 5) {
			this.damage = 5;
		}
	}
}

class Enemy {
	
	constructor(type, x, y, health, maxSpeed, speedX, speedY, endPointCount, width, height, camo) {
		this.type = type;
		this.x = x;
		this.y = y;
		this.health = health;
		this.maxSpeed = maxSpeed;
		this.speedX = speedX;
		this.speedY = speedY;
		this.endPointCount = endPointCount;
		this.width = width;
		this.height = height;
		this.camo = camo;
		this.stunned = false;
		this.stunnedCount = 0;
		this.stunTime = 0;
		this.onFire = false;
		this.flameCount = 0;
		this.slowDown = false;
		this.slowCount;
		this.spriteCount = 0;
		this.responseTime = 0;
		if(this.type === 'medium' || this.type === 'redBarb' || this.type === 'blueBarb' || this.type === 'greenBarb') {
			this.responseTime = 250;
			this.radius = .04 * w;
		}
		else if(this.type === 'barbArcher1' || this.type === 'fastBarb2' || this.type === 'barbArcher2' || this.type === 'barbArcher3') {
			this.responseTime = 150;
		}
		this.responseCount = this.responseTime/2;
	}
	
	drawEnemy() {
		ctx.save();
		
		if(this.spriteCount > 0) {
			this.spriteCount += .1;
		}
		
		this.responseCount++;
		let count = Math.round(this.spriteCount);
		
		if(this.camo) {
			ctx.globalAlpha = .5;
		}
		
		if(this.type === 'easy') {
			
			ctx.drawImage(barbarianSpriteSheet, barbarianSpriteArray[0].x, barbarianSpriteArray[0].y, barbarianSpriteArray[0].width,
			barbarianSpriteArray[0].height, this.x, this.y, this.width, this.height);
		}
		else if(this.type === 'medium') {
			if(!barbarian2SpriteArray[count]) {
				count = 0;
				this.responseCount = 0;
				this.spriteCount = 0;
			}
			
			ctx.drawImage(barbarian2Sprite, barbarian2SpriteArray[count].x, barbarian2SpriteArray[count].y, barbarian2SpriteArray[count].width, 
			barbarian2SpriteArray[count].height, this.x, this.y, this.width, this.height);
		}
		else if(this.type === 'redBarb'|| this.type === 'blueBarb' || this.type === 'greenBarb') {
			if(!barb3SpriteArray[count]) {
				count = 0;
				this.responseCount = 0;
				this.spriteCount = 0;
			}
			if(this.type === 'redBarb') {
				ctx.drawImage(barbarian3Sprite, barb3SpriteArray[count].x, barb3SpriteArray[count].y, barb3SpriteArray[count].width, 
				barb3SpriteArray[count].height, this.x, this.y, this.width, this.height);
			}
			else if(this.type === 'blueBarb') {
				ctx.drawImage(barbarian3Sprite, barb4SpriteArray[count].x, barb4SpriteArray[count].y, barb4SpriteArray[count].width, 
				barb4SpriteArray[count].height, this.x, this.y, this.width, this.height);
			}
			else if(this.type === 'greenBarb') {
				ctx.drawImage(barbarian3Sprite, barb5SpriteArray[count].x, barb5SpriteArray[count].y, barb5SpriteArray[count].width, 
				barb5SpriteArray[count].height, this.x, this.y, this.width, this.height);
			}
		}
		else if(this.type === 'barbArcher1') {
			if(!barbArcherSpriteArray[count]) {
				count = 0;
				this.responseCount = 0;
				this.spriteCount = 0;
				let arrow = new EnemyArrow(this.x + this.width/2, this.y + this.height/4, this.angle, 7, 2);
				arrowArray.push(arrow);
				arrow.calcTrajectory();
			}
			
			ctx.drawImage(barbArcherSprite, barbArcherSpriteArray[count].x, barbArcherSpriteArray[count].y, barbArcherSpriteArray[count].width, 
			barbArcherSpriteArray[count].height, this.x, this.y, this.width, this.height);
		}
		else if(this.type === 'fastBarb') {
			ctx.drawImage(fastBarbImage, 0, 0, 56, 55, this.x, this.y, this.width, this.height);
		}
		else if(this.type === 'fastBarb2') {
			if(!fastBarb2SpriteArray[count]) {
				count = 0;
				this.responseCount = 0;
				this.spriteCount = 0;
			}
			
			ctx.drawImage(fastBarb2Sprite, fastBarb2SpriteArray[count].x, fastBarb2SpriteArray[count].y, fastBarb2SpriteArray[count].width, 
			fastBarb2SpriteArray[count].height, this.x, this.y, this.width, this.height);
		}
		else if(this.type === 'barbArcher2') {
			if(!barbArcher2SpriteArray[count]) {
				count = 0;
				this.responseCount = 0;
				this.spriteCount = 0;
				let randAngle = Math.random() * 2 * Math.PI;
				for(let i = 0, j = randAngle; i < 6; i++, j+= 2 * Math.PI/6) {
					let arrow = new EnemyArrow(this.x + this.width/2, this.y + this.height/4, j, 7, 2);
					arrowArray.push(arrow);
					arrow.calcTrajectory();
				}
			}
			
			ctx.drawImage(barbArcher2Sprite, barbArcher2SpriteArray[count].x, barbArcher2SpriteArray[count].y, barbArcher2SpriteArray[count].width,
			barbArcher2SpriteArray[count].height, this.x, this.y, this.width, this.height);
		}
		else if(this.type === 'skeleton') {
			ctx.drawImage(skeleImage, 0, 0, 56, 58, this.x, this.y, this.width, this.height);
		}
		else if(this.type === 'barbArcher3') {
			if(!barbArcher3SpriteArray[count]) {
				count = 0;
				this.responseCount = 0;
				this.spriteCount = 0;
				let randAngle = Math.random() * 2 * Math.PI;
				for(let i = 0, j = randAngle; i < 10; i++, j+= 2 * Math.PI/10) {
					let arrow = new EnemyArrow(this.x + this.width/2, this.y + this.height/4, j, 7, 2);
					arrowArray.push(arrow);
					arrow.calcTrajectory();
				}
			}
			
			ctx.drawImage(barbArcher2Sprite, barbArcher3SpriteArray[count].x, barbArcher3SpriteArray[count].y, barbArcher3SpriteArray[count].width, 
			barbArcher3SpriteArray[count].height, this.x, this.y, this.width, this.height);
		}
		
		if(this.onFire && this.flameCount < 120) {
			ctx.drawImage(flameImage, 0, 0, 756, 1125, this.x, this.y, this.width, this.height);
			if(this.flameCount % 30 === 0) this.health--;
			this.flameCount++;
		}
		else {
			this.flameCount = 0;
			this.onFire = false;
		}
		
		ctx.restore();
		
		this.testForAttack();
	}
	
	testForAttack() {
		if(this.type === 'medium' || this.type === 'redBarb' || this.type === 'blueBarb' || this.type === 'greenBarb') {
			if(this.spriteCount === 0 && this.responseCount > this.responseTime) {
				for(let i = 0; i < troopArray.length; i++) {
					let troop = troopArray[i];
					if(Math.sqrt(Math.pow(this.x + this.width/2 - troop.x - troop.width/2, 2) + Math.pow(this.y + this.height/2 - troop.y - troop.height/2, 2)) <= this.radius) {
						this.spriteCount += .1;
						troop.health--;
						break;
					}
				}
			}
		}
		else if(this.type === 'fastBarb2') {
			if(this.spriteCount === 0 && this.responseCount > this.responseTime) {
				for(let i = 0; i < troopArray.length; i++) {
					let troop = troopArray[i];
					if(Math.sqrt(Math.pow(this.x + this.width/2 - troop.x - troop.width/2, 2) + Math.pow(this.y + this.height/2 - troop.y - troop.height/2, 2)) <= this.radius) {
						this.spriteCount += .1;
						troop.health -= 5;
						break;
					}
				}
			}
		}
		else if(this.type === 'barbArcher1' || this.type === 'barbArcher2' || this.type === 'barbArcher3') {
			if(this.spriteCount === 0 && this.responseCount > this.responseTime) {
				this.spriteCount += .1;
			}
		}
	}
	
	moveEnemy(delta, index) {
		
		let angle = Math.atan2((endPointsArray[this.endPointCount].y - this.y), endPointsArray[this.endPointCount].x - this.x);
		this.speedX = this.maxSpeed * Math.cos(angle);
		this.speedY = this.maxSpeed * Math.sin(angle);
		this.angle = angle;
		
		this.x += this.speedX;
		this.y += this.speedY;
		
		if(!this.stunned && this.slowDown && this.slowCount < 240) {
			this.x -= this.speedX/2;
			this.y -= this.speedY/2;
			this.slowCount++;
		}
		else {
			this.slowDown = false;
			this.slowCount = 0;
		}
		
		if(this.stunned && this.stunnedCount < this.stunTime) {
			this.x -= this.speedX;
			this.y -= this.speedY;
			this.stunnedCount++;
		}
		else {
			this.stunned = false;
			this.stunnedCount = 0;
			this.stunTime = 0;
		}
		
		//console.log(this.x + ", " + this.y);
		//console.log(this.y - w/30 + ", " + endPointsArray[this.endPointCount].y);
		//console.log(angle);
		
		if(trackSelected === 1) {
			if(this.endPointCount === 1) {
				if(this.y <= endPointsArray[this.endPointCount].y) {
					this.y = endPointsArray[this.endPointCount].y;
					this.endPointCount++;
					if(this.type === 'barbArcher1' || this.type === 'barbArcher3') {
						this.maxSpeed *= .9;
					}
					else if(this.type === 'fastBarb' || this.type === 'fastBarb2' || this.type === 'barbArcher2') {
						this.maxSpeed *= .7;
					}
				}
			}
			else if(this.endPointCount === 2) {
				if(this.x + this.width >= endPointsArray[this.endPointCount].x) {
					this.x = endPointsArray[this.endPointCount].x;
					//this.x += w/20;
					//this.y += w/60;
					this.endPointCount++;
					if(this.type === 'barbArcher1' || this.type === 'barbArcher3') {
						this.maxSpeed *= .9;
					}
					else if(this.type === 'fastBarb' || this.type === 'fastBarb2' || this.type === 'barbArcher2' || this.type === 'skeleton') {
						this.maxSpeed *= .7;
					}
				}
			}
			else if(this.endPointCount === 3) {
				//console.log(this.y + ", " + endPointsArray[this.endPointCount].y);
				if(this.y >= endPointsArray[this.endPointCount].y) {
					this.y = endPointsArray[this.endPointCount].y;
					this.endPointCount++;
					if(this.type === 'barbArcher1' || this.type === 'barbArcher3') {
						this.maxSpeed *= .9;
					}
					else if(this.type === 'fastBarb' || this.type === 'fastBarb2' || this.type === 'barbArcher2' || this.type === 'skeleton') {
						this.maxSpeed *= .8;
					}
				}
			}
			else if(this.endPointCount === 4) {
				if(this.x + this.width >= endPointsArray[this.endPointCount].x) {
					this.x = endPointsArray[this.endPointCount].x;
					//this.y += w/60;
					this.endPointCount++;
					if(this.type === 'barbArcher1' || this.type === 'barbArcher3') {
						this.maxSpeed *= .9;
					}
					else if(this.type === 'fastBarb' || this.type === 'fastBarb2' || this.type === 'barbArcher2' || this.type === 'skeleton') {
						this.maxSpeed *= .8;
					}
				}
			}
			else if(this.endPointCount === 5) {
				if(this.y >= endPointsArray[this.endPointCount].y) {
					this.y = endPointsArray[this.endPointCount].y;
					//this.y += w/30;
					this.endPointCount++;
					if(this.type === 'barbArcher1' || this.type === 'barbArcher3') {
						this.maxSpeed *= .9;
					}
					else if(this.type === 'fastBarb' || this.type === 'fastBarb2' || this.type === 'barbArcher2' || this.type === 'skeleton') {
						this.maxSpeed *= .8;
					}
				}
			}
			else if(this.endPointCount === 6) {
				if(this.x <= endPointsArray[this.endPointCount].x) {
					this.x = endPointsArray[this.endPointCount].x;
					this.endPointCount++;
					if(this.type === 'barbArcher1' || this.type === 'barbArcher3') {
						this.maxSpeed *= .9;
					}
					else if(this.type === 'fastBarb' || this.type === 'fastBarb2' || this.type === 'barbArcher2' || this.type === 'skeleton') {
						this.maxSpeed *= .8;
					}
				}
			}
			else if(this.endPointCount === 7) {
				if(this.y >= endPointsArray[this.endPointCount].y) {
					playerHealth -= this.health;
					if(this.type === 'skeleton') {
						playerHealth += this.health;
						playerMoney -= 500;
					}
					activeEnemyArray.splice(index, 1);
				}
			}
		}
		else if(trackSelected === 2) {
			if(this.endPointCount === 1) {
				if(this.x >= endPointsArray[this.endPointCount].x) {
					this.x = endPointsArray[this.endPointCount].x;
					this.endPointCount++;
					if(this.type === 'barbArcher1' || this.type === 'barbArcher3') {
						this.maxSpeed *= .9;
					}
					else if(this.type === 'fastBarb' || this.type === 'fastBarb2' || this.type === 'barbArcher2') {
						this.maxSpeed *= .7;
					}
				}
			}
			else if(this.endPointCount === 2) {
				if(this.y >= endPointsArray[this.endPointCount].y) {
					this.y = endPointsArray[this.endPointCount].y;
					this.endPointCount++;
					if(this.type === 'barbArcher1' || this.type === 'barbArcher3') {
						this.maxSpeed *= .9;
					}
					else if(this.type === 'fastBarb' || this.type === 'fastBarb2' || this.type === 'barbArcher2' || this.type === 'skeleton') {
						this.maxSpeed *= .7;
					}
				}
			}
			else if(this.endPointCount === 3) {
				if(this.x >= endPointsArray[this.endPointCount].x) {
					this.x = endPointsArray[this.endPointCount].x;
					this.endPointCount++;
					if(this.type === 'barbArcher1' || this.type === 'barbArcher3') {
						this.maxSpeed *= .9;
					}
					else if(this.type === 'fastBarb' || this.type === 'fastBarb2' || this.type === 'barbArcher2' || this.type === 'skeleton') {
						this.maxSpeed *= .8;
					}
				}
			}
			else if(this.endPointCount === 4) {
				if(this.y >= endPointsArray[this.endPointCount].y) {
					this.y = endPointsArray[this.endPointCount].y;
					this.endPointCount++;
					if(this.type === 'barbArcher1' || this.type === 'barbArcher3') {
						this.maxSpeed *= .9;
					}
					else if(this.type === 'fastBarb' || this.type === 'fastBarb2' || this.type === 'barbArcher2' || this.type === 'skeleton') {
						this.maxSpeed *= .8;
					}
				}
			}
			else if(this.endPointCount === 5) {
				if(this.x <= endPointsArray[this.endPointCount].x) {
					this.x = endPointsArray[this.endPointCount].x;
					this.endPointCount++;
					if(this.type === 'barbArcher1' || this.type === 'barbArcher3') {
						this.maxSpeed *= .9;
					}
					else if(this.type === 'fastBarb' || this.type === 'fastBarb2' || this.type === 'barbArcher2' || this.type === 'skeleton') {
						this.maxSpeed *= .8;
					}
				}
			}
			else if(this.endPointCount === 6) {
				if(this.y >= endPointsArray[this.endPointCount].y) {
					playerHealth -= this.health;
					if(this.type === 'skeleton') {
						playerHealth += this.health;
						playerMoney -= 500;
					}
					activeEnemyArray.splice(index, 1);
				}
			}
		}
		else if(trackSelected === 3) {
			if(this.endPointCount === 1) {
				if(this.y >= endPointsArray[this.endPointCount].y) {
					this.y = endPointsArray[this.endPointCount].y;
					this.endPointCount++;
					if(this.type === 'barbArcher1' || this.type === 'barbArcher3') {
						this.maxSpeed *= .9;
					}
					else if(this.type === 'fastBarb' || this.type === 'fastBarb2' || this.type === 'barbArcher2') {
						this.maxSpeed *= .7;
					}
				}
			}
			else if(this.endPointCount === 2) {
				if(this.x >= endPointsArray[this.endPointCount].x) {
					this.x = endPointsArray[this.endPointCount].x;
					this.endPointCount++;
					if(this.type === 'barbArcher1' || this.type === 'barbArcher3') {
						this.maxSpeed *= .9;
					}
					else if(this.type === 'fastBarb' || this.type === 'fastBarb2' || this.type === 'barbArcher2' || this.type === 'skeleton') {
						this.maxSpeed *= .7;
					}
				}
			}
			else if(this.endPointCount === 3) {
				if(this.y <= endPointsArray[this.endPointCount].y) {
					this.y = endPointsArray[this.endPointCount].y;
					this.endPointCount++;
					if(this.type === 'barbArcher1' || this.type === 'barbArcher3') {
						this.maxSpeed *= .9;
					}
					else if(this.type === 'fastBarb' || this.type === 'fastBarb2' || this.type === 'barbArcher2' || this.type === 'skeleton') {
						this.maxSpeed *= .8;
					}
				}
			}
			else if(this.endPointCount === 4) {
				if(this.x <= endPointsArray[this.endPointCount].x) {
					this.x = endPointsArray[this.endPointCount].x;
					this.endPointCount++;
					if(this.type === 'barbArcher1' || this.type === 'barbArcher3') {
						this.maxSpeed *= .9;
					}
					else if(this.type === 'fastBarb' || this.type === 'fastBarb2' || this.type === 'barbArcher2' || this.type === 'skeleton') {
						this.maxSpeed *= .8;
					}
				}
			}
			else if(this.endPointCount === 5) {
				if(this.y >= endPointsArray[this.endPointCount].y) {
					this.y = endPointsArray[this.endPointCount].y;
					this.endPointCount++;
					if(this.type === 'barbArcher1' || this.type === 'barbArcher3') {
						this.maxSpeed *= .9;
					}
					else if(this.type === 'fastBarb' || this.type === 'fastBarb2' || this.type === 'barbArcher2' || this.type === 'skeleton') {
						this.maxSpeed *= .8;
					}
				}
			}
			else if(this.endPointCount === 6) {
				if(this.x >= endPointsArray[this.endPointCount].x) {
					this.x = endPointsArray[this.endPointCount].x;
					this.endPointCount++;
					if(this.type === 'barbArcher1' || this.type === 'barbArcher3') {
						this.maxSpeed *= .9;
					}
					else if(this.type === 'fastBarb' || this.type === 'fastBarb2' || this.type === 'barbArcher2' || this.type === 'skeleton') {
						this.maxSpeed *= .8;
					}
				}
			}
			else if(this.endPointCount === 7) {
				if(this.y <= endPointsArray[this.endPointCount].y) {
					playerHealth -= this.health;
					if(this.type === 'skeleton') {
						playerHealth += this.health;
						playerMoney -= 500;
					}
					activeEnemyArray.splice(index, 1);
				}
			}
		}
	}
	
	checkHealth(index) {
		if(this.health <= 0) {
			if(waveNum < 10) {
				if(this.type === 'easy')  {
					playerMoney += 10;
					activeEnemyArray.splice(index, 1);
				}
				else if(this.type === 'medium') {
					playerMoney += 20;
					activeEnemyArray.splice(index, 1);
				}
				else if(this.type === 'redBarb') {
					playerMoney += 20;
					this.type = 'easy';
					this.health = 1;
				}
				else if(this.type === 'blueBarb') {
					playerMoney += 20;
					this.type = 'redBarb';
					this.health = 3;
				}
				else if(this.type === 'greenBarb') {
					playerMoney += 20;
					this.type = 'blueBarb';
					this.health = 4;
				}
			}
			else {
				if(this.type === 'easy')  {
					playerMoney += 3;
					activeEnemyArray.splice(index, 1);
				}
				else if(this.type === 'medium') {
					playerMoney += 8;
					activeEnemyArray.splice(index, 1);
				}
				else if(this.type === 'redBarb') {
					playerMoney += 10;
					this.type = 'easy';
					this.health = 1;
				}
				else if(this.type === 'blueBarb') {
					playerMoney += 10;
					this.type = 'redBarb';
					this.health = 3;
				}
				else if(this.type === 'greenBarb') {
					playerMoney += 10;
					this.type = 'blueBarb';
					this.health = 4;
				}
				else if(this.type === 'barbArcher1') {
					playerMoney += 15;	
					this.type = 'greenBarb';
					if(this.maxSpeed > 1.25025) {
						this.maxSpeed = 1.25025;
					}
					this.health = 6;
				}
				else if(this.type === 'fastBarb') {
					playerMoney += 15;
					this.type = 'greenBarb';
					if(this.maxSpeed > 1.25025) {
						this.maxSpeed = 1.25025;
					}
					this.health = 6;
				}
				else if(this.type === 'barbArcher2') {
					playerMoney += 5;
					this.type = 'barbArcher1';
					this.health = 6;
				}
				else if(this.type === 'skeleton') {
					playerMoney += 5;
					activeEnemyArray.splice(index, 1);
				}
				else if(this.type === 'fastBarb2') {
					playerMoney += 5;
					this.type = 'fastBarb';
					this.health = 7;
				}
				else if(this.type === 'barbArcher3') {
					playerMoney += 20;
					this.type = 'barbArcher2';
					this.health = 15;
				}
			}
			
			for(let i = 0; i < troopArray.length; i++) {
				let troop = troopArray[i];
				if(troop.hitArray) {
					for(let j = 0; j < troop.hitArray.length; j++) {
						if(troop.hitArray[j] === this) {
							troop.hitArray.splice(j, 1);
							break;
						}
					}
				}
			}
		}
	}
}

window.onload = function() {
	
	canvas = document.querySelector("#canvas");
	ctx = canvas.getContext('2d');
	gameArea = document.querySelector("#gameplace");
	infoDiv = document.querySelector("#infoDiv");
	
	resizeGame();
	
	animation2 = requestAnimationFrame(checkDataLoad);
	
	loadImages();
	loadEvents();
	console.log(w + ", " + h);
};

function loadEvents() {
	
	sound1 = document.querySelector("#sound1");
	
	event1 = function(e) {
		mousePos = getMousePos(e);
		//console.log(mousePos.x + ", " + mousePos.y);
	};
	
	event2 = function(e) {
		if(e.keyCode === 13) {
			loadTrackSelect();
			removeEventListener('keydown', event2);
		}
	};
	
	event3 = function(e) {
		if(mousePos.x > .1 * w && mousePos.x < .3 * w && mousePos.y > h/3 && mousePos.y < 2 * h/3) {
			//console.log("click");
			trackSelected = 1;
			loadTrack1();
			removeEventListener('mousedown', event3);
		}
		else if(mousePos.x > .4 * w && mousePos.x < .6 * w && mousePos.y > h/3 && mousePos.y < 2 * h/3) {
			//console.log("click");
			trackSelected = 2;
			loadTrack2();
			removeEventListener('mousedown', event3);
		}
		else if(mousePos.x > .7 * w && mousePos.x < .9 * w && mousePos.y > h/3 && mousePos.y < 2 * h/3) {
			trackSelected = 3;
			loadTrack3();
			removeEventListener('mousedown', event3);
		}
	};
	
	event4 = function(e) {
		//console.log("hello");
		if(mousePos.x > .95 * w && mousePos.x < w && mousePos.y > 0 && mousePos.y < .05 * w) {
			console.log("click");
			waveNum++;
			beginNextWave = true;
			waveCounter = 0;
			infoDiv.innerHTML = "";
			removeEventListener('mousedown', event4);
			addEventListener('mousedown', event11);
		}
	};
	
	event5 = function(e) {
		if(mousePos.x > .8 * w) {
			if(mousePos.x > .8 * w && mousePos.x < .825 * w && mousePos.y > .15 * h && mousePos.y < .15 * h + .04 * w && playerMoney >= romanSoldierCost) {
				itemNumSelected = 0;
				addEventListener('mousemove', event6);
				addEventListener('mouseup', event7);
			}
			else if(mousePos.x > .8375 * w && mousePos.x < .8625 * w && mousePos.y > .15 * h && mousePos.y < .15 * h + .04 * w && playerMoney >= archerCost) {
				itemNumSelected = 1;
				addEventListener('mousemove', event6);
				addEventListener('mouseup', event7);
			}
			else if(mousePos.x > .875 * w && mousePos.x < .9 * w && mousePos.y > .15 * h && mousePos.y < .15 * h + .04 * w && playerMoney >= calvaryCost) {
				itemNumSelected = 2;
				addEventListener('mousemove', event6);
				addEventListener('mouseup', event7);
			}
			else if(mousePos.x > .9125 * w && mousePos.x < .9375 * w && mousePos.y > .15 * h && mousePos.y < .15 * h + .04 * w && playerMoney >= cannonCost) {
				itemNumSelected = 3;
				addEventListener('mousemove', event6);
				addEventListener('mouseup', event7);
			}
			else if(mousePos.x > .8 * w && mousePos.x < .825 * w && mousePos.y > .255 * h && mousePos.y < .255 * h + .04 * w && playerMoney >= shipCost) {
				itemNumSelected = 4;
				addEventListener('mousemove', event6);
				addEventListener('mouseup', event7);
			}
			else if(mousePos.x > .8375 * w && mousePos.x < .8625 * w && mousePos.y > .255 * h && mousePos.y < .255 * h + .04 * w && playerMoney >= sniperCost) {
				itemNumSelected = 5;
				addEventListener('mousemove', event6);
				addEventListener('mouseup', event7);
			}
			else if(mousePos.x > .875 * w && mousePos.x < .9 * w && mousePos.y > .255 * h && mousePos.y < .255 * h + .04 * w && playerMoney >= generalCost) {
				itemNumSelected = 6;
				addEventListener('mousemove', event6);
				addEventListener('mouseup', event7);
			}
			else if(mousePos.x > .9125 * w && mousePos.x < .9375 * w && mousePos.y > .255 * h && mousePos.y < .255 * h + .04 * w && playerMoney >= medicCost) {
				itemNumSelected = 7;
				addEventListener('mousemove', event6);
				addEventListener('mouseup', event7);
			}
			else if(mousePos.x > .8 * w && mousePos.x < .825 * w && mousePos.y > .36 * h && mousePos.y < .36 * h + .04 * w && playerMoney >= riflemanCost && waveNum > 24) {
				itemNumSelected = 8;
				addEventListener('mousemove', event6);
				addEventListener('mouseup', event7);
			}
			else if(mousePos.x > .8375 * w && mousePos.x < .8625 * w && mousePos.y > .36 * h && mousePos.y < .36 * h + .04 * w && playerMoney >= wizardCost && waveNum > 30) {
				itemNumSelected = 9;
				addEventListener('mousemove', event6);
				addEventListener('mouseup', event7);
			}
		}
	};
	
	event6 = function() {
		drawPlacement = true;
	};
	
	event7 = function() {
		drawPlacement = false;
		removeEventListener('mousemove', event6);
		removeEventListener('mouseup', event7);
		if(checkForWaterPlacement()) {
			if(itemNumSelected === 0) {
				let roman = new RomanSoldier(mousePos.x - .02 * w, mousePos.y - .02 * w, mousePos.x - .02 * w, mousePos.y - .02 * w, .04 * w, .04 * w, .05 * w);
				troopArray.push(roman);
				playerMoney -= romanSoldierCost;
			}
			else if(itemNumSelected === 1) {
				let archer = new Archer(mousePos.x - .015 * w, mousePos.y - 1.267 * (.015 * w), .03 * w, 1.267 * .03 * w, .1 * w);
				troopArray.push(archer);
				playerMoney -= archerCost;
			}
			else if(itemNumSelected === 2) {
				let calvary = new Calvary(mousePos.x - .02 * w, mousePos.y - .02 * w, .04 * w, .04 * w, .1 * w);
				troopArray.push(calvary);
				playerMoney -= calvaryCost;
			}
			else if(itemNumSelected === 3) {
				let cannon = new Cannon(mousePos.x - .02 * w, mousePos.y - .02 * w, .04 * w, .04 * w, .07 * w);
				troopArray.push(cannon);
				playerMoney -= cannonCost;
			}
			else if(itemNumSelected === 4) {
				let ship = new Ship(mousePos.x - .03 * w, mousePos.y - .03 * w, .06 * w, .06 * w, .1 * w);
				troopArray.push(ship);
				playerMoney -= shipCost;
			}
			else if(itemNumSelected === 5) {
				let sniper = new Sniper(mousePos.x - .015 * w, mousePos.y - (.015 * w) * (740/400), .03 * w, .03 * w * 740/400, .2 * w);
				troopArray.push(sniper);
				playerMoney -= sniperCost;
			}
			else if(itemNumSelected === 6) {
				let general = new General(mousePos.x - .015 * w, mousePos.y - 1.67 * .015 * w, .03 * w, 1.67 * .03 * w, .05 * w);
				troopArray.push(general);
				playerMoney -= generalCost;
			}
			else if(itemNumSelected === 7) {
				let medic = new Medic(mousePos.x - .015 * w, mousePos.y - 1.35 * .015 * w, .03 * w, 1.35 * .03 * w, .05 * w);
				troopArray.push(medic);
				playerMoney -= medicCost;
			}
			else if(itemNumSelected === 8) {
				let rifleman = new Rifleman(mousePos.x - .02 * w, mousePos.y - .02 * w, .04 * w, .04 * w, .13 * w);
				troopArray.push(rifleman);
				playerMoney -= riflemanCost;
			}
			else if(itemNumSelected === 9) {
				let wizard = new Wizard(mousePos.x - .02 * w, mousePos.y - .02 * w, .04 * w, .04 * w, .1 * w);
				troopArray.push(wizard);
				playerMoney -= wizardCost;
			}
		}
	};
	
	event8 = function(e) {
		for(let i = 0; i < troopArray.length; i++) {
			let troop = troopArray[i];
			if(mousePos.x > troop.baseX && mousePos.x < troop.baseX + troop.width && mousePos.y > troop.baseY && mousePos.y < troop.baseY + troop.height) {
				troopSelected = i;
				addEventListener('mousedown', event9);
				return;
			}
		}
		
		if(mousePos.x > .775 * w && mousePos.y > .83 * h && mousePos.y < .93 * h) {
			return;
		}
		else if(mousePos.x > .95 * w && mousePos.x < w && mousePos.y > .965 * h && mousePos.y < h) {
			return;
		}
		
		removeEventListener('mousedown', event9);
		troopSelected = -1;
	};
	
	event9 = function(e) {
		if(!troopArray[troopSelected]) return;
		let troop = troopArray[troopSelected];
		
		if(mousePos.x > .775 * w && mousePos.x < .875 * w && mousePos.y > .83 * h && mousePos.y < .93 * h && troop.canAffordA) {
			if(troop.levelA === 3 && troop.levelB >= 4) return;
			if(troop.levelA < 5) troop.levelA++;
			troop.registerUpgradeA(troop.levelA);
			playerMoney -= troop.itemACost;
			troop.cost += troop.itemACost;
		}
		else if(mousePos.x > .875 * w && mousePos.x < .975 * w && mousePos.y > .83 * h && mousePos.y < .93 * h && troop.canAffordB) {
			if(troop.levelB === 3 && troop.levelA >= 4) return;
			if(troop.levelB < 5) troop.levelB++;
			troop.registerUpgradeB(troop.levelB);
			playerMoney -= troop.itemBCost;
			troop.cost += troop.itemBCost;
		}
		else if(mousePos.x > .95 * w && mousePos.x < w && mousePos.y > .965 * h && mousePos.y < h) {
			//console.log("hi");
			playerMoney += Math.round(.2 * troop.cost);
			troopArray.splice(troopSelected, 1);
			troopSelected = -1;
		}
	};
	
	event10 = function(e) {
		if(mousePos.x > .75 * w) {
			if(mousePos.x > .8 * w && mousePos.x < .825 * w && mousePos.y > .15 * h && mousePos.y < .15 * h + .04 * w) {
				hoverText = 'Soldier';
				return;
			}
			else if(mousePos.x > .8375 * w && mousePos.x < .8625 * w && mousePos.y > .15 * h && mousePos.y < .15 * h + .04 * w) {
				hoverText = 'Archer';
				return;
			}
			else if(mousePos.x > .875 * w && mousePos.x < .9 * w && mousePos.y > .15 * h && mousePos.y < .15 * h + .04 * w) {
				hoverText = 'Calvary';
				return;
			}
			else if(mousePos.x > .9125 * w && mousePos.x < .9375 * w && mousePos.y > .15 * h && mousePos.y < .15 * h + .04 * w) {
				hoverText = 'Cannon';
				return;
			}
			else if(mousePos.x > .8 * w && mousePos.x < .825 * w && mousePos.y > .255 * h && mousePos.y < .255 * h + .04 * w) {
				hoverText = 'Ship';
				return;
			}
			else if(mousePos.x > .8375 * w && mousePos.x < .8625 * w && mousePos.y > .255 * h && mousePos.y < .255 * h + .04 * w) {
				hoverText = 'Sharpshooter';
				return;
			}
			else if(mousePos.x > .875 * w && mousePos.x < .9 * w && mousePos.y > .255 * h && mousePos.y < .255 * h + .04 * w) {
				hoverText = 'General';
				return;
			}
			else if(mousePos.x > .9125 * w && mousePos.x < .9375 * w && mousePos.y > .255 * h && mousePos.y < .255 * h + .04 * w) {
				hoverText = 'Medic';
				return;
			}
			else if(mousePos.x > .8 * w && mousePos.x < .825 * w && mousePos.y > .36 * h && mousePos.y < .36 * h + .04 * w && waveNum > 24) {
				hoverText = 'Rifleman';
				return;
			}
			else if(mousePos.x > .8375 * w && mousePos.x < .8625 * w && mousePos.y > .36 * h && mousePos.y < .36 * h + .04 * w && waveNum > 30) {
				hoverText = 'Wizard';
				return;
			}
		}
		hoverText = '';
	}
	
	event11 = function() {
		if(mousePos.x > .94 * w && mousePos.x < .96 * w && mousePos.y > .03 * w && mousePos.y < .05 * w) {
			fastForward = !fastForward;
		}
	}
	
	event12 = function() {
		if(mousePos.x > .75 * w && mousePos.x < .8 * w && mousePos.y < .05 * w) {
			window.open('https://mroglan.github.io/BTDBB/generalinfo.html');
		}
	}
}

function checkForWaterPlacement() {
	
	if(mousePos.x > .75 * w) {
		return false;
	}
	
	for(let i = 0; i < troopArray.length; i++) {
		let troop = troopArray[i];
		if(mousePos.x > troop.baseX && mousePos.x < troop.baseX + troop.width && mousePos.y > troop.baseY && mousePos.y < troop.baseY + troop.height) {
			return false;
		}
	}
	for(let i = 0; i < waterRectanglesArray.length; i++) {
		let rect = waterRectanglesArray[i];
		if(mousePos.x > rect.x && mousePos.x < rect.x + rect.width && mousePos.y > rect.y && mousePos.y < rect.y + rect.height) {
			if(itemNumSelected === 4) return true;
			return false;
		}
	}
	for(let i = 0; i < waterCirclesArray.length; i++) {
		let circle = waterCirclesArray[i];
		if(Math.sqrt(Math.pow(mousePos.x - circle.x, 2) + Math.pow(mousePos.y - circle.y, 2)) < circle.r) {
			if(itemNumSelected === 4) return true;
			return false;
		}
	}
	if(itemNumSelected === 4) return false;
	return true;
}

function calcDistanceToMove(delta, speed) {
	return delta * speed / 1000;
}

function getMousePos(e) {
	let rect = canvas.getBoundingClientRect();
		
	return {
		x: e.clientX - rect.left,
		y: e.clientY - rect.top
	};
}

function loadImages() {
	
	createSpriteArrays();
	
	image1 = new Image();
	image1.src = 'media/backgroundMap.png';
	image1.onload = function() {
		imageLoadCount++;
	};
	
	image2 = new Image();
	image2.src = 'media/wood.png';
	image2.onload = function() {
		imageLoadCount++;
	};
	
	image3 = new Image();
	image3.src = 'media/wood2.png';
	image3.onload = function() {
		imageLoadCount++;
	};
	
	image4 = new Image();
	image4.src = 'media/track1Back.png';
	image4.onload = function() {
		imageLoadCount++;
	};
	
	image5 = new Image();
	image5.src = 'media/sandstone.png';
	image5.onload = function() {
		imageLoadCount++;
	};
	
	image6 = new Image();
	image6.src = 'media/track1Image.png';
	image6.onload = function() {
		imageLoadCount++;
	};
	
	image7 = new Image();
	image7.src = 'media/startButton.png';
	image7.onload = function() {
		imageLoadCount++;
	};
	
	image8 = new Image();
	image8.src = 'media/heart.png';
	image8.onload = function() {
		imageLoadCount++;
	};
	
	image9 = new Image();
	image9.src = 'media/coin.png';
	image9.onload = function() {
		imageLoadCount++;
	};
	
	image10 = new Image();
	image10.src = 'media/info.png';
	image10.onload = function() {
		imageLoadCount++;
	};
	
	image11 = new Image();
	image11.src = 'media/star.png';
	image11.onload = function() {
		imageLoadCount++;
	};
	
	image12 = new Image();
	image12.src = 'media/fastForward.png';
	image12.onload = function() {
		imageLoadCount++;
	};
	
	image13 = new Image();
	image13.src = 'media/iceland.png';
	image13.onload = function() {
		imageLoadCount++;
	};
	
	image14 = new Image();
	image14.src='media/greenBack.png';
	image14.onload = function() {
		imageLoadCount++;
	};
	
	image15 = new Image();
	image15.src='media/track2Back.PNG';
	image15.onload = function() {
		imageLoadCount++;
	};
	
	image16 = new Image();
	image16.src = 'media/arctic.png';
	image16.onload = function() {
		imageLoadCount++;
	};
	
	image17 = new Image();
	image17.src = 'media/track3Back.PNG';
	image17.onload = function() {
		imageLoadCount++;
	};
	
	barbarianSpriteSheet = new Image();
	barbarianSpriteSheet.src = 'media/barbarianSprite.png';
	barbarianSpriteSheet.onload = function() {
		imageLoadCount++;
	};
	
	romanHead = new Image();
	romanHead.src = 'media/romanHead.png';
	romanHead.onload = function() {
		imageLoadCount++;
	};
	
	romanSprite = new Image();
	romanSprite.src = 'media/romanSoldierSprite.png';
	romanSprite.onload = function() {
		imageLoadCount++;
	};
	
	archerHead = new Image();
	archerHead.src = 'media/archerHead.png';
	archerHead.onload = function() {
		imageLoadCount++;
	};
	
	archerSprite = new Image();
	archerSprite.src = 'media/archerSprite.png';
	archerSprite.onload = function() {
		imageLoadCount++;
	};
	
	arrowImage = new Image();
	arrowImage.src = 'media/arrow.png';
	arrowImage.onload = function() {
		imageLoadCount++;
	};
	
	calvaryHead = new Image();
	calvaryHead.src = 'media/calvaryHead.png';
	calvaryHead.onload = function() {
		imageLoadCount++;
	};
	
	calvarySprite = new Image();
	calvarySprite.src = 'media/calvarySprite.png';
	calvarySprite.onload = function() {
		imageLoadCount++;
	};
	
	cannonImage = new Image();
	cannonImage.src = 'media/cannon.png';
	cannonImage.onload = function() {
		imageLoadCount++;
	};
	
	cannonballImage = new Image();
	cannonballImage.src = 'media/cannonball.png';
	cannonballImage.onload = function() {
		imageLoadCount++;
	};
	
	explosionImage = new Image();
	explosionImage.src = 'media/explosion.png';
	explosionImage.onload = function() {
		imageLoadCount++;
	};
	
	shipImage = new Image();
	shipImage.src = 'media/ship.png';
	shipImage.onload = function() {
		imageLoadCount++;
	};
	
	sniperHead = new Image();
	sniperHead.src = 'media/sniperHead.png';
	sniperHead.onload = function() {
		imageLoadCount++;
	};
	
	sniperSprite = new Image();
	sniperSprite.src = 'media/sniperSprite.png';
	sniperSprite.onload = function() {
		imageLoadCount++;
	};
	
	flamingArrow = new Image();
	flamingArrow.src = 'media/flamingArrow.png';
	flamingArrow.onload = function() {
		imageLoadCount++;
	};
	
	flameImage = new Image();
	flameImage.src = 'media/flame.png';
	flameImage.onload = function() {
		imageLoadCount++;
	};
	
	generalImage = new Image();
	generalImage.src = 'media/general.png';
	generalImage.onload = function() {
		imageLoadCount++;
	};
	
	generalHead = new Image();
	generalHead.src = 'media/general.png';
	generalImage.onload = function() {
		imageLoadCount++;
	};
	
	medicImage = new Image();
	medicImage.src = 'media/medic.png';
	medicImage.onload = function() {
		imageLoadCount++;
	};
	
	medicHead = new Image();
	medicHead.src = 'media/medicHead.png';
	medicHead.onload = function() {
		imageLoadCount++;
	};
	
	riflemanHead = new Image();
	riflemanHead.src = 'media/riflemanHead.png';
	riflemanHead.onload = function() {
		imageLoadCount++;
	};
	
	riflemanSprite = new Image();
	riflemanSprite.src = 'media/riflemanSprite.png';
	riflemanSprite.onload = function() {
		imageLoadCount++;
	};
	
	bulletImage = new Image();
	bulletImage.src = 'media/bullet.png';
	bulletImage.onload = function() {
		imageLoadCount++;
	};
	
	wizardHead = new Image();
	wizardHead.src = 'media/wizardHead.png';
	wizardHead.onload = function() {
		imageLoadCount++;
	};
	
	wizardSprite = new Image();
	wizardSprite.src = 'media/wizardSprite.png';
	wizardSprite.onload = function() {
		imageLoadCount++;
	};
	
	fireBall = new Image();
	fireBall.src = 'media/fireball.png';
	fireBall.onload = function() {
		imageLoadCount++;
	};
	
	barbarian2Sprite = new Image();
	barbarian2Sprite.src = 'media/barbarian2Sprite.png';
	barbarian2Sprite.onload = function() {
		imageLoadCount++;
	};
	
	barbarian3Sprite = new Image();
	barbarian3Sprite.src = 'media/barbarian3Sprite.png';
	barbarian3Sprite.onload = function() {
		imageLoadCount++;
	};
	
	barbArcherSprite = new Image();
	barbArcherSprite.src = 'media/barbArcher.png';
	barbArcherSprite.onload = function() {
		imageLoadCount++;
	};
	
	fastBarbImage = new Image();
	fastBarbImage.src = 'media/fastBarb.png';
	fastBarbImage.onload = function() {
		imageLoadCount++;
	};
	
	fastBarb2Sprite = new Image();
	fastBarb2Sprite.src = 'media/fastBarb2.png';
	fastBarb2Sprite.onload = function() {
		imageLoadCount++;
	};
	
	barbArcher2Sprite = new Image();
	barbArcher2Sprite.src = 'media/shooterBarb.png';
	barbArcher2Sprite.onload = function() {
		imageLoadCount++;
	};
	
	skeleImage = new Image();
	skeleImage.src = 'media/skeletonBarb.png';
	skeleImage.onload = function() {
		imageLoadCount++;
	};
}

function createSpriteArrays() {
	
	barbarianSpriteArray.push({x: 120, y: 0, width: 60, height: 79});
	barbarianSpriteArray.push({x: 280, y: 0, width: 60, height: 79});
	barbarianSpriteArray.push({x: 440, y: 0, width: 70, height: 79});
	barbarianSpriteArray.push({x: 600, y: 0, width: 70, height: 79});
	barbarianSpriteArray.push({x: 770, y: 0, width: 60, height: 79});
	
	romanSpriteArray.push({x: 40, y: 0, width: 160, height: 155});
	romanSpriteArray.push({x: 210, y: 0, width: 150, height: 155});
	romanSpriteArray.push({x: 400, y: 0, width: 225, height: 155});
	
	archerSpriteArray.push({x: 90, y: 70, width: 150, height: 190});
	archerSpriteArray.push({x: 670, y: 310, width: 150, height: 190});
	
	calvarySpriteArray.push({x: 20, y: 70, width: 140, height: 140});
	calvarySpriteArray.push({x: 180, y: 80, width: 140, height: 130});
	calvarySpriteArray.push({x: 330, y: 70, width: 150, height: 140});
	calvarySpriteArray.push({x: 490, y: 70, width: 150, height: 140});
	calvarySpriteArray.push({x: 830, y: 70, width: 190, height: 130});
	calvarySpriteArray.push({x: 1040, y: 70, width: 150, height: 140});
	
	sniperSpriteArray.push({x: 40, y: 40, width: 380, height: 740});
	sniperSpriteArray.push({x: 540, y: 40, width: 420, height: 740});
	sniperSpriteArray.push({x: 1140, y: 40, width: 400, height: 740});
	
	riflemanSpriteArray.push({x: 0, y: 0, width: 100, height: 100});
	riflemanSpriteArray.push({x: 100, y: 0, width: 70, height: 100});
	
	wizardSpriteArray.push({x: 0, y: 0, width: 90, height: 106});
	wizardSpriteArray.push({x: 160, y: 0, width: 80, height: 106});
	wizardSpriteArray.push({x: 330, y: 0, width: 110, height: 106});
	wizardSpriteArray.push({x: 500, y: 0, width: 100, height: 106});
	
	barbarian2SpriteArray.push({x: 40, y: 290, width: 70, height: 60});
	barbarian2SpriteArray.push({x: 20, y: 110, width: 50, height: 60});
	barbarian2SpriteArray.push({x: 110, y: 110, width: 70, height: 60});
	barbarian2SpriteArray.push({x: 210, y: 110, width: 50, height: 60});
	barbarian2SpriteArray.push({x: 390, y: 220, width: 50, height: 60});
	
	barb3SpriteArray.push({x: 10, y: 10, width: 60, height: 50});
	barb3SpriteArray.push({x: 70, y: 10, width: 40, height: 50});
	barb3SpriteArray.push({x: 120, y: 10, width: 60, height: 50});
	
	barb4SpriteArray.push({x: 10, y: 70, width: 60, height: 50});
	barb4SpriteArray.push({x: 70, y: 70, width: 40, height: 50});
	barb4SpriteArray.push({x: 120, y: 70, width: 60, height: 50});
	
	barb5SpriteArray.push({x: 10, y: 130, width: 60, height: 50});
	barb5SpriteArray.push({x: 70, y: 130, width: 40, height: 50});
	barb5SpriteArray.push({x: 120, y: 130, width: 60, height: 50});
	
	barbArcherSpriteArray.push({x: 10, y: 50, width: 40, height: 55});
	barbArcherSpriteArray.push({x: 10, y: 120, width: 40, height: 50});
	
	fastBarb2SpriteArray.push({x: 10, y: 0, width: 40, height: 45});
	fastBarb2SpriteArray.push({x: 200, y: 0, width: 40, height: 45});
	fastBarb2SpriteArray.push({x: 250, y: 0, width: 40, height: 45});
	fastBarb2SpriteArray.push({x: 370, y: 0, width: 40, height: 45});
	fastBarb2SpriteArray.push({x: 430, y: 0, width: 40, height: 45});
	
	barbArcher2SpriteArray.push({x: 10, y: 5, width: 35, height: 30});
	barbArcher2SpriteArray.push({x: 50, y: 5, width: 40, height: 30});
	barbArcher2SpriteArray.push({x: 95, y: 0, width: 40, height: 35});
	barbArcher2SpriteArray.push({x: 140, y: 0, width: 35, height: 35});

	barbArcher3SpriteArray.push({x: 10, y: 105, width: 35, height: 30});
	barbArcher3SpriteArray.push({x: 50, y: 105, width: 40, height: 30});
	barbArcher3SpriteArray.push({x: 95, y: 105, width: 40, height: 30});
	barbArcher3SpriteArray.push({x: 140, y: 100, width: 35, height: 35});
}

function checkDataLoad() {
	let amountOfImages = 49;
	animation2 = requestAnimationFrame(checkDataLoad);
	if(imageLoadCount === amountOfImages) {
		loadOpeningScreen();
	}
}

function resizeGame() {
	let widthToHeight = 5/2.5;
	let newWidth = window.innerWidth -10;
	let newHeight = window.innerHeight - 10;
	let newWidthToHeight = newWidth / newHeight;
	
	if(newWidthToHeight > widthToHeight) {
		newWidth = newHeight * widthToHeight;
		gameArea.style.height = newHeight + 'px';
		gameArea.style.width = newWidth + 'px';
	}
	else {
		newHeight = newWidth / widthToHeight;
		gameArea.style.height = newHeight + 'px';
		gameArea.style.width = newWidth + 'px';
	}
	
	gameArea.style.marginTop = (-newHeight/2) + 'px';
	gameArea.style.marginLeft = (-newWidth/2) + 'px';
	gameArea.style.fontSize = (newWidth/400) + 'em';
	
	canvas.width = newWidth;
	canvas.height = newHeight;
	
	w = canvas.width;
	h = canvas.height;
}

function loadOpeningScreen() {
	ctx.save();
	
	cancelAnimationFrame(animation2);
	addEventListener('mousemove', event1);
	addEventListener('keydown', event2);

	ctx.drawImage(image1, 0, 0, 960, 669, 0, 0, w, h);
	
	ctx.font = h/4 + 'px Impact';
	ctx.fillStyle = 'red';
	ctx.textAlign = 'center';
	ctx.fillText('BTDBB', w/2, h/3);
	ctx.strokeStyle = 'black';
	ctx.lineWidth = h/150;
	ctx.strokeText('BTDBB', w/2, h/3);
	
	ctx.lineWidth = h/100;
	ctx.strokeRect(w/3, h/2, w/3, h/8);
	ctx.fillStyle = 'black';
	ctx.font = h/10 + 'px Arial';
	ctx.fillText('Press Enter', w/2, 3 * h/5);
	
	ctx.restore();
}

function loadTrackSelect() {
	addEventListener('mousedown', event3);
	
	ctx.save();
	
	createTrackSelectBackground();
	
	ctx.lineJoin = 'round';
	ctx.strokeStyle = 'black';
	ctx.lineWidth = h/50;
	ctx.beginPath();
	ctx.strokeRect(.1 * w, h/3, .2 * w, h/3);
	ctx.strokeRect(.4 * w, h/3, .2 * w, h/3);
	ctx.strokeRect(.7 * w, h/3, .2 * w, h/3);
	ctx.closePath();
	
	ctx.drawImage(image6, 0, 0, 924, 614, .1 * w, h/3, .2 * w, h/3);
	ctx.drawImage(image15, 0, 0, 647, 433, .4 * w, h/3, .2 * w, h/3);
	ctx.drawImage(image17, 0, 0, 922, 615, .7 * w, h/3, .2 * w, h/3);
	
	ctx.restore();
}

function createTrackSelectBackground() {
	ctx.save();
	
	ctx.clearRect(0, 0, w, h);
	ctx.drawImage(image3, 0, 0, 750, 500, 0, 0, w, h);
	ctx.drawImage(image2, 0, 0, 750, 500, 0, 0, w, h/4);
	ctx.drawImage(image2, 0, 0, 750, 500, 0, 4 * h/5, w, h/5);
	
	ctx.fillStyle = '#161461';
	ctx.font = h/5 + 'px Arial';
	ctx.textAlign = 'center';
	ctx.fillText('Map Select', w/2, h/5);
	
	ctx.restore();
}

function loadTrack1() {
	
	endPointsArray.push({x: .05 * w, y: 1.05 * h});
	endPointsArray.push({x: .05 * w - w/60, y: .1 * h - w/60});
	endPointsArray.push({x: .7 * w - w/60, y: .1 * h - w/60});
	endPointsArray.push({x: .35 * w - w/60, y: .5 * h - w/60});
	endPointsArray.push({x: .6 * w - w/60, y: .5 * h - w/60});
	endPointsArray.push({x: .35 * w - w/60, y: .8 * h - w/60});
	endPointsArray.push({x: .2 * w - w/60, y: .8 * h - w/60});
	endPointsArray.push({x: .2 * w - w/60, y: 1.05 * h});
	
	waterRectanglesArray.push({x: .1 * w, y: .315 * h, width: .2 * w, height: .23 * h});
	waterRectanglesArray.push({x: .53 * w, y: .66 * h, width: .2 * w, height: .25 * h});
	
	enemyArray = [{type: 1, time: 60}, {type: 1, time: 240}, {type: 1, time: 420}, {type: 1, time: 600}, {type: 1, time: 780}, {type: 1, time: 960}, {type: 1, time: 1140}, {type: 1, time: 1320}, {type: 1, time: 1500}, {type: 1, time: 1680}];

	addEventListener('mousedown', event4);
	addEventListener('mousedown', event5);
	addEventListener('mousedown', event8);
	addEventListener('mousemove', event10);
	addEventListener('mousedown', event12);
	animation1 = requestAnimationFrame(trackLoop);
}

function loadTrack2() {
	
	enemyArray = [{type: 1, time: 60}, {type: 1, time: 240}, {type: 1, time: 420}, {type: 1, time: 600}, {type: 1, time: 780}, {type: 1, time: 960}, {type: 1, time: 1140}, {type: 1, time: 1320}, {type: 1, time: 1500}, {type: 1, time: 1680}];
	
	waterCirclesArray.push({x: .005 * w, y: .17 * h, r: .02 * w});
	waterCirclesArray.push({x: .56 * w, y: .17 * h, r: .03 * w});
	waterCirclesArray.push({x: .6 * w, y: .2 * h, r: .03 * w});
	waterCirclesArray.push({x: .65 * w, y: .25 * h, r: .045 * w});
	waterCirclesArray.push({x: .39 * w, y: .34 * h, r: .04 * w});
	waterCirclesArray.push({x: .36 * w, y: .4 * h, r: .06 * w});
	waterCirclesArray.push({x: .27 * w, y: .59 * h, r: .06 * w});
	waterCirclesArray.push({x: .2 * w, y: .59 * h, r: .04 * w});
	waterCirclesArray.push({x: .66 * w, y: .77 * h, r: .07 * w});
	waterCirclesArray.push({x: .29 * w, y: .9 * h, r: .05 * w});
	waterCirclesArray.push({x: .235 * w, y: .99 * h, r: .07 * w});
	
	waterRectanglesArray.push({x: .02 * w, y: .15 * h, width: .2 * w, height: .035 * w});
	waterRectanglesArray.push({x: .22 * w, y: .12 * h, width: .2 * w, height: .035 * w});
	waterRectanglesArray.push({x: .37 * w, y: .1 * h, width: .2 * w, height: .035 * w});
	waterRectanglesArray.push({x: .43 * w, y: .27 * h, width: .2 * w, height: .04 * w});
	waterRectanglesArray.push({x: .34 * w, y: .43 * h, width: .15 * w, height: .07 * w});
	waterRectanglesArray.push({x: .25 * w, y: .5 * h, width: .15 * w, height: .04 * w});
	waterRectanglesArray.push({x: .32 * w, y: .6 * h, width: .2 * w, height: .07 * w});
	waterRectanglesArray.push({x: .5 * w, y: .65 * h, width: .15 * w, height: .06 * w});
	waterRectanglesArray.push({x: .32 * w, y: .78 * h, width: .3 * w, height: .065 * w});
	
	endPointsArray.push({x: 0, y: .05 * h - w/60});
	endPointsArray.push({x: .7 * w - w/30, y: .05 * h - w/60});
	endPointsArray.push({x: .1 * w, y: .4 * h - w/60});
	endPointsArray.push({x: .7 * w - w/60, y: .4 * h - w/60});
	endPointsArray.push({x: .45 * w - w/60, y: .78 * h - w/60});
	endPointsArray.push({x: .1 * w - w/60, y: .78 * h - w/60});
	endPointsArray.push({x: .1 * w - w/60, y: 1.05 * h});
	
	addEventListener('mousedown', event4);
	addEventListener('mousedown', event5);
	addEventListener('mousedown', event8);
	addEventListener('mousemove', event10);
	addEventListener('mousedown', event12);
	animation1 = requestAnimationFrame(trackLoop);
}

function loadTrack3() {
	
	enemyArray = [{type: 1, time: 60}, {type: 1, time: 240}, {type: 1, time: 420}, {type: 1, time: 600}, {type: 1, time: 780}, {type: 1, time: 960}, {type: 1, time: 1140}, {type: 1, time: 1320}, {type: 1, time: 1500}, {type: 1, time: 1680}];
	
	waterCirclesArray.push({x: .45 * w, y: .02 * h, r: .01 * w});
	waterCirclesArray.push({x: .44 * w, y: .02 * h, r: .01 * w});
	waterCirclesArray.push({x: .38 * w, y: .05 * h, r: .02 * w});
	waterCirclesArray.push({x: .36 * w, y: .09 * h , r: .01 * w});
	waterCirclesArray.push({x: .35 * w, y: .11 * h, r: .01 * w});
	waterCirclesArray.push({x: .34 * w, y: .13 * h, r: .01 * w});
	waterCirclesArray.push({x: .33 * w, y: .15 * h, r: .01 * w});
	waterCirclesArray.push({x: .27 * w, y: .55 * h, r: .02 * w});
	waterCirclesArray.push({x: .26 * w, y: .59 * h, r: .02 * w});
	waterCirclesArray.push({x: .25 * w, y: .63 * h, r: .02 * w});
	waterCirclesArray.push({x: .25 * w, y: .68 * h, r: .04 * w});
	waterCirclesArray.push({x: .25 * w, y: .73 * h, r: .04 * w});
	waterCirclesArray.push({x: .26 * w, y: .8 * h, r: .04 * w});
	waterCirclesArray.push({x: .27 * w, y: .87 * h, r: .04 * w});
	waterCirclesArray.push({x: .29 * w, y: .94 * h, r: .04 * w});
	waterCirclesArray.push({x: .31 * w, y: 1.01 * h, r: .04 * w});
	
	waterRectanglesArray.push({x: .4 * w, y: .01 * h, width: .05 * w, height: .02 * w});
	waterRectanglesArray.push({x: .3 * w, y: .15 * h, width: .05 * w, height: .1 * w});
	waterRectanglesArray.push({x: .28 * w, y: .35 * h, width: .04 * w, height: .05 * w});
	waterRectanglesArray.push({x: .27 * w, y: .45 * h, width: .035 * w, height: .05 * w});
	
	endPointsArray.push({x: .1 * w - w/60, y: -.05 * w});
	endPointsArray.push({x: .1 * w - w/60, y: .95 * h - w/60});
	endPointsArray.push({x: .7 * w - w/60, y: .95 * h - w/60});
	endPointsArray.push({x: .7 * w - w/60, y: .4 * h - w/60});
	endPointsArray.push({x: .4 * w - w/60, y: .4 * h - w/60});
	endPointsArray.push({x: .4 * w - w/60, y: .7 * h - w/60});
	endPointsArray.push({x: .6 * w - w/60, y: .7 * h - w/60});
	endPointsArray.push({x: .6 * w - w/60, y: -.05 * w});
	
	addEventListener('mousedown', event4);
	addEventListener('mousedown', event5);
	addEventListener('mousedown', event8);
	addEventListener('mousemove', event10);
	addEventListener('mousedown', event12);
	animation1 = requestAnimationFrame(trackLoop);
}

function drawCircles() {
	for(let i = 0; i < waterCirclesArray.length; i++) {
		let circle = waterCirclesArray[i];
		ctx.beginPath();
		ctx.arc(circle.x, circle.y, circle.r, 0, 2 * Math.PI);
		ctx.stroke();
		ctx.closePath();
	}
	for(let i = 0; i < waterRectanglesArray.length; i++) {
		let rect = waterRectanglesArray[i];
		ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
	}
}

function trackLoop(currentTime) {
	let delta = currentTime - oldTime;
	ctx.save();
	
	drawTrackMap(trackSelected);
	displayHoverText();
	displayTroopInfo(troopSelected);
	
	//if(trackSelected === 3) drawCircles();

	if(beginNextWave) {
		enemySpawnCounter++;
		checkForSpawn();
	}

	if(drawPlacement) {
		drawTroopPlacement();
	}
	
	if(fastForward) {
		activeEnemyArray.forEach(function(enemy, index) {
			enemy.moveEnemy(delta, index);
		});
		troopArray.forEach(function(troop, index) {
			troop.responseCount++;
			if(troop.spriteCount > 0) {
				troop.spriteCount += .2;
			}
		});
		arrowArray.forEach(function(arrow, index) {
			arrow.x += arrow.speedX;
			arrow.y += arrow.speedY;
			arrow.testForCollision(index);
		});
		explosionArray.forEach(function(explosion, index) {
			explosion.count++;
		});
		if(beginNextWave) {
			enemySpawnCounter++;
			checkForSpawn();
		}
	}
	
	activeEnemyArray.forEach(function(enemy, index) {
		enemy.drawEnemy();
		enemy.moveEnemy(delta, index);
		enemy.checkHealth(index);
	});
	
	troopArray.forEach(function(troop, index) {
		troop.draw();
		troop.locateEnemy();
		checkHealth(troop, index);
	});
	
	arrowArray.forEach(function(arrow, index) {
		arrow.draw();
		arrow.testForCollision(index);
		arrow.testForExit(index);
	});
	
	explosionArray.forEach(function(explosion, index) {
		if(explosion.count < 60) {
			explosion.draw();
		}
		else {
			explosionArray.splice(index, 1);
		}
	});
	
	if(activeEnemyArray.length === 0 && enemyArray.length === 0 && waveCounter === 0) {
		prepareNextWave();
		removeEventListener('mousedown', event11);
		fastForward = false;
		waveCounter++;
	}
	
	if(playerHealth <= 0) {
		ctx.fillStyle = 'black';
		ctx.fillRect(0, 0, w, h);
		ctx.font = w/4 + 'px Arial';
		ctx.fillStyle = 'red';
		ctx.textAlign = 'center';
		ctx.fillText('DEFEAT', w/2, h/2);
		ctx.font = w/8 + 'px Arial';
		ctx.fillText('Wave: ' + waveNum, w/2, 3 * h/4);
	}
	
	ctx.restore();
	
	oldTime = currentTime;
	animation1 = requestAnimationFrame(trackLoop);
}

function checkForSpawn() {
	for(let i = 0; i < enemyArray.length; i++) {
		let enemy = enemyArray[i];
		
		if(trackSelected === 1) {
			if(enemySpawnCounter === enemy.time) {
				let opponent;
				if(enemy.type === 1) {
					opponent = new Enemy('easy', (.05 * w) - w/60, 1.05 * h, 1, .625125, 0, 0, 1, w/30, w/30, enemy.stealth);
				}
				else if(enemy.type === 2) {
					opponent = new Enemy('medium',  (.05 * w) - w/60, 1.05 * h, 5, .45, 0, 0, 1, w/30, w/30, enemy.stealth);
				}
				else if(enemy.type === 3) {
					opponent = new Enemy('redBarb', (.05 * w) - w/60, 1.05 * h, 3, .625125, 0, 0, 1, w/30, w/30, enemy.stealth);
				}
				else if(enemy.type === 4) {
					opponent = new Enemy('blueBarb', (.05 * w) - w/60, 1.05 * h, 4, .625125, 0, 0, 1, w/30, w/30, enemy.stealth);
				}
				else if(enemy.type === 5) {
					opponent = new Enemy('greenBarb', (.05 * w) - w/60, 1.05 * h, 5, 1.25025, 0, 0, 1, w/30, w/30, enemy.stealth);
				}
				else if(enemy.type === 6) {
					opponent = new Enemy('barbArcher1', (.05 * w) - w/60, 1.05 * h, 6, 1.25025, 0, 0, 1, w/30, w/30, enemy.stealth);
				}
				else if(enemy.type === 7) {
					opponent = new Enemy('fastBarb', (.05 * w) - w/60, 1.05 * h, 7, 3, 0, 0, 1, w/30, w/30, enemy.stealth);
				}
				else if(enemy.type === 8) {
					opponent = new Enemy('fastBarb2', (.05 * w) - w/60, 1.05 * h, 20, 3, 0, 0, 1, w/30, w/30, enemy.stealth);
				}
				else if(enemy.type === 9) {
					opponent = new Enemy('barbArcher2', (.05 * w) - w/60, 1.05 * h, 15, 2.5, 0, 0, 1, w/30, w/30, enemy.stealth);
				}
				else if(enemy.type === 10) {
					opponent = new Enemy('barbArcher3', (.05 * w) - w/60, 1.05 * h, 25, 3, 0, 0, 1, w/30, w/30, enemy.stealth);
				}
				else if(enemy.type === 11) {
					opponent = new Enemy('skeleton', (.05 * w) - w/60, 1.05 * h, 10, 3.5, 0, 0, 1, w/30, w/30, enemy.stealth);
				}
				activeEnemyArray.push(opponent);
				enemyArray.splice(i, 1);
				
				break;
			}
		}
		else if(trackSelected === 2) {
			if(enemySpawnCounter === enemy.time) {
				let opponent;
				if(enemy.type === 1) {
					opponent = new Enemy('easy', -.05 * w, .05 * h - w/60, 1, .41675, 0, 0, 1, w/30, w/30, enemy.stealth);
				}
				else if(enemy.type === 2) {
					opponent = new Enemy('medium', -.05 * w, .05 * h - w/60, 5, .3, 0, 0, 1, w/30, w/30, enemy.stealth);
				}
				else if(enemy.type === 3) {
					opponent = new Enemy('redBarb', -.05 * w, .05 * h - w/60, 3, .41675, 0, 0, 1, w/30, w/30, enemy.stealth);
				}
				else if(enemy.type === 4) {
					opponent = new Enemy('blueBarb', -.05 * w, .05 * h - w/60, 4, .625125, 0, 0, 1, w/30, w/30, enemy.stealth);
				}
				else if(enemy.type === 5) {
					opponent = new Enemy('greenBarb', -.05 * w, .05 * h - w/60, 5, 1.25025, 0, 0, 1, w/30, w/30, enemy.stealth);
				}
				else if(enemy.type === 6) {
					opponent = new Enemy('barbArcher1', -.05 * w, .05 * h - w/60, 6, 1.25025, 0, 0, 1, w/30, w/30, enemy.stealth);
				}
				else if(enemy.type === 7) {
					opponent = new Enemy('fastBarb', -.05 * w, .05 * h - w/60, 7, 3, 0, 0, 1, w/30, w/30, enemy.stealth);
				}
				else if(enemy.type === 8) {
					opponent = new Enemy('fastBarb2', -.05 * w, .05 * h - w/60, 20, 3, 0, 0, 1, w/30, w/30, enemy.stealth);
				}
				else if(enemy.type === 9) {
					opponent = new Enemy('barbArcher2', -.05 * w, .05 * h - w/60, 15, 2.5, 0, 0, 1, w/30, w/30, enemy.stealth);
				}
				else if(enemy.type === 10) {
					opponent = new Enemy('barbArcher3', -.05 * w, .05 * h - w/60, 25, 3, 0, 0, 1, w/30, w/30, enemy.stealth);
				}
				else if(enemy.type === 11) {
					opponent = new Enemy('skeleton', -.05 * w, .05 * h - w/60, 10, 3.5, 0, 0, 1, w/30, w/30, enemy.stealth);
				}
				activeEnemyArray.push(opponent);
				enemyArray.splice(i, 1);
				
				break;
			}
		}
		else if(trackSelected === 3) {
			if(enemySpawnCounter === enemy.time) {
				let opponent;
				if(enemy.type === 1) {
					opponent = new Enemy('easy', .1 * w - w/60, -.05 * w, 1, .41675, 0, 0, 1, w/30, w/30, enemy.stealth);
				}
				else if(enemy.type === 2) {
					opponent = new Enemy('medium', .1 * w - w/60, -.05 * w, 5, .3, 0, 0, 1, w/30, w/30, enemy.stealth);
				}
				else if(enemy.type === 3) {
					opponent = new Enemy('redBarb', .1 * w - w/60, -.05 * w, 3, .41675, 0, 0, 1, w/30, w/30, enemy.stealth);
				}
				else if(enemy.type === 4) {
					opponent = new Enemy('blueBarb', .1 * w - w/60, -.05 * w, 4, .625125, 0, 0, 1, w/30, w/30, enemy.stealth);
				}
				else if(enemy.type === 5) {
					opponent = new Enemy('greenBarb', .1 * w - w/60, -.05 * w, 5, 1.25025, 0, 0, 1, w/30, w/30, enemy.stealth);
				}
				else if(enemy.type === 6) {
					opponent = new Enemy('barbArcher1', .1 * w - w/60, -.05 * w, 6, 1.25025, 0, 0, 1, w/30, w/30, enemy.stealth);
				}
				else if(enemy.type === 7) {
					opponent = new Enemy('fastBarb', .1 * w - w/60, -.05 * w, 7, 3, 0, 0, 1, w/30, w/30, enemy.stealth);
				}
				else if(enemy.type === 8) {
					opponent = new Enemy('fastBarb2', .1 * w - w/60, -.05 * w, 20, 3, 0, 0, 1, w/30, w/30, enemy.stealth);
				}
				else if(enemy.type === 9) {
					opponent = new Enemy('barbArcher2', .1 * w - w/60, -.05 * w, 15, 2.5, 0, 0, 1, w/30, w/30, enemy.stealth);
				}
				else if(enemy.type === 10) {
					opponent = new Enemy('barbArcher3', .1 * w - w/60, -.05 * w, 25, 3, 0, 0, 1, w/30, w/30, enemy.stealth);
				}
				else if(enemy.type === 11) {
					opponent = new Enemy('skeleton', .1 * w - w/60, -.05 * w, 10, 3.5, 0, 0, 1, w/30, w/30, enemy.stealth);
				}
				activeEnemyArray.push(opponent);
				enemyArray.splice(i, 1);
				
				break;
			}
		}
	}
}

function checkHealth(troop, index) {
	if(troop.health <= 0) {
		troopArray.splice(index, 1);
	}
}

function displayHoverText() {
	ctx.save();
	ctx.font = .02 * w + 'px Arial';
	ctx.fillStyle = 'black';
	ctx.textAlign = 'center';
	ctx.fillText(hoverText, .8875 * w, .14 * h);
	ctx.restore();
}

function displayTroopInfo(troopSelected) {
	ctx.save();
	if(troopSelected === -1 || !troopArray[troopSelected]) return;
	
	let troop = troopArray[troopSelected];
	
	ctx.save();
	ctx.globalAlpha = .5;
	ctx.fillStyle = 'black';
	ctx.beginPath();
	ctx.arc(troop.baseX + troop.width/2, troop.baseY + troop.height/2, troop.radius, 0, 2 * Math.PI);
	ctx.fill();
	ctx.closePath();
	ctx.restore();
	
	ctx.fillStyle = 'black';
	ctx.textAlign = 'center';
	ctx.font = .015 * w + 'px Arial';
	ctx.fillText('Health: ' + troop.health + '     Damage: ' + troop.damage, .875 * w, .79 * h);
	
	displayUpgradesA(troop);
	displayUpgradesB(troop);
	
	ctx.strokeStyle = 'black';
	ctx.lineWidth = .005 * h;
	ctx.strokeRect(.775 * w, .83 * h, .1 * w, .1 * h);
	ctx.strokeRect(.875 * w, .83 * h, .1 * w, .1 * h);
	ctx.strokeRect(.775 * w, .8 * h, .02 * w, .03 * h);
	ctx.strokeRect(.795 * w, .8 * h, .02 * w, .03 * h);
	ctx.strokeRect(.815 * w, .8 * h, .02 * w, .03 * h);
	ctx.strokeRect(.835 * w, .8 * h, .02 * w, .03 * h);
	ctx.strokeRect(.875 * w, .8 * h, .02 * w, .03 * h);
	ctx.strokeRect(.895 * w, .8 * h, .02 * w, .03 * h);
	ctx.strokeRect(.915 * w, .8 * h, .02 * w, .03 * h);
	ctx.strokeRect(.935 * w, .8 * h, .02 * w, .03 * h);
	
	ctx.fillStyle = 'red';
	ctx.fillRect(.95 * w, .965 * h, .05 * w, .035 * h);
	ctx.fillStyle = 'black';
	ctx.fillText(Math.round(.2 * troop.cost), .975 * w, h);
	
	ctx.restore();
}

function displayUpgradesB(troop) {
	ctx.save();
	
	if(troop.type === 'romanSoldier') {
		switch(troop.levelB) {
			
			case 1:
			ctx.font = .04 * h + 'px Arial';
			ctx.fillText('Quicker', .925 * w, .88 * h);
			ctx.fillText('Attacks', .925 * w, .92 * h);
			ctx.font = .03 * h + 'px Arial';
			if(playerMoney >= 300) {
				ctx.fillStyle = 'green';
				troop.canAffordB = true;
			}
			else {
				ctx.fillStyle = 'red';
				troop.canAffordB = false;
			}
			troop.itemBCost = 300;
			ctx.fillText('300', .925 * w, .9625 * h);
			break;
			
			case 2: 
			ctx.font = .04 * h + 'px Arial';
			ctx.fillText('Higher', .925 * w, .88 * h);
			ctx.fillText('Damage', .925 * w, .92 * h);
			ctx.fillStyle = 'green';
			ctx.fillRect(.875 * w, .8 * h, .02 * w, .03 * h);
			ctx.font = .03 * h + 'px Arial';
			if(playerMoney >= 500) {
				ctx.fillStyle = 'green';
				troop.canAffordB = true;
			}
			else {
				ctx.fillStyle = 'red';
				troop.canAffordB = false;
			}
			troop.itemBCost = 500;
			ctx.fillText('500', .925 * w, .9625 * h);
			break;
			
			case 3:
			ctx.font = .04 * h + 'px Arial';
			ctx.fillText('Super fast', .925 * w, .88 * h);
			ctx.fillText('Attacks', .925 * w, .92 * h);
			ctx.fillStyle = 'green';
			ctx.fillRect(.875 * w, .8 * h, .02 * w, .03 * h);
			ctx.fillRect(.895 * w, .8 * h, .02 * w, .03 * h);
			ctx.font = .03 * h + 'px Arial';
			if(troop.levelA >= 4) {
				ctx.fillStyle = 'red';
				ctx.fillRect(.915 * w, .8 * h, .02 * w, .03 * h);
				ctx.fillRect(.935 * w, .8 * h, .02 * w, .03 * h);
			}
				
			if(playerMoney >= 1000) {
				ctx.fillStyle = 'green';
				troop.canAffordB = true;
			}
			else {
				ctx.fillStyle = 'red';
				troop.canAffordB = false;
			}
			troop.itemBCost = 1000;
			ctx.fillText('1000', .925 * w, .9625 * h);
			break;
			
			case 4: 
			ctx.font = .03 * h + 'px Arial';
			ctx.fillText('Unbelievable', .925 * w, .88 * h);
			ctx.fillText('Power', .925 * w, .92 * h);
			ctx.fillStyle = 'green';
			ctx.fillRect(.875 * w, .8 * h, .02 * w, .03 * h);
			ctx.fillRect(.895 * w, .8 * h, .02 * w, .03 * h);
			ctx.fillRect(.915 * w, .8 * h, .02 * w, .03 * h);
			if(playerMoney >= 2000) {
				ctx.fillStyle = 'green';
				troop.canAffordB = true;
			}
			else {
				ctx.fillStyle = 'red';
				troop.canAffordB = false;
			}
			troop.itemBCost = 2000;
			ctx.fillText('2000', .925 * w, .9625 * h);
			break;
			
			case 5:
			ctx.font = .03 * h + 'px Arial';
			ctx.fillText('All upgrades', .925 * w, .88 * h);
			ctx.fillText('Bought', .925 * w, .92 * h);
			ctx.fillStyle = 'green';
			ctx.fillRect(.875 * w, .8 * h, .02 * w, .03 * h);
			ctx.fillRect(.895 * w, .8 * h, .02 * w, .03 * h);
			ctx.fillRect(.915 * w, .8 * h, .02 * w, .03 * h);
			ctx.fillRect(.935 * w, .8 * h, .02 * w, .03 * h);
			troop.canAffordB = false;
			break;
		}
	}
	else if(troop.type === 'archer') {
		switch(troop.levelB) {
			
			case 1:
			ctx.font = .04 * h + 'px Arial';
			ctx.fillText('Quicker', .925 * w, .88 * h);
			ctx.fillText('Attacks', .925 * w, .92 * h);
			ctx.font = .03 * h + 'px Arial';
			if(playerMoney >= 500) {
				ctx.fillStyle = 'green';
				troop.canAffordB = true;
			}
			else {
				ctx.fillStyle = 'red';
				troop.canAffordB = false;
			}
			troop.itemBCost = 500;
			ctx.fillText('500', .925 * w, .9625 * h);
			break;
			
			case 2:
			ctx.font = .04 * h + 'px Arial';
			ctx.fillText('Piercing', .925 * w, .88 * h);
			ctx.fillText('Arrows', .925 * w, .92 * h);
			ctx.font = .03 * h + 'px Arial';
			ctx.fillStyle = 'green';
			ctx.fillRect(.875 * w, .8 * h, .02 * w, .03 * h);
			if(playerMoney >= 600) {
				ctx.fillStyle = 'green';
				troop.canAffordB = true;
			}
			else {
				ctx.fillStyle = 'red';
				troop.canAffordB = false;
			}
			troop.itemBCost = 600;
			ctx.fillText('600', .925 * w, .9625 * h);
			break;
			
			case 3:
			ctx.font = .04 * h + 'px Arial';
			ctx.fillText('More', .925 * w, .88 * h);
			ctx.fillText('Damage', .925 * w, .92 * h);
			ctx.font = .03 * h + 'px Arial';
			ctx.fillStyle = 'green';
			ctx.fillRect(.875 * w, .8 * h, .02 * w, .03 * h);
			ctx.fillRect(.895 * w, .8 * h, .02 * w, .03 * h);
			if(troop.levelA >= 4) {
				ctx.fillStyle = 'red';
				ctx.fillRect(.915 * w, .8 * h, .02 * w, .03 * h);
				ctx.fillRect(.935 * w, .8 * h, .02 * w, .03 * h);
			}
			if(playerMoney >= 1000) {
				ctx.fillStyle = 'green';
				troop.canAffordB = true;
			}
			else {
				ctx.fillStyle = 'red';
				troop.canAffordB = false;
			}
			troop.itemBCost = 1000;
			ctx.fillText('1000', .925 * w, .9625 * h);
			break;
			
			case 4:
			ctx.font = .04 * h + 'px Arial';
			ctx.fillText('Super', .925 * w, .88 * h);
			ctx.fillText('Speed', .925 * w, .92 * h);
			ctx.font = .03 * h + 'px Arial';
			ctx.fillStyle = 'green';
			ctx.fillRect(.875 * w, .8 * h, .02 * w, .03 * h);
			ctx.fillRect(.895 * w, .8 * h, .02 * w, .03 * h);
			ctx.fillRect(.915 * w, .8 * h, .02 * w, .03 * h);
			if(playerMoney >= 2000) {
				ctx.fillStyle = 'green';
				troop.canAffordB = true;
			}
			else {
				ctx.fillStyle = 'red';
				troop.canAffordB = false;
			}
			troop.itemBCost = 2000;
			ctx.fillText('2000', .925 * w, .9625 * h);
			break;
			
			case 5:
			ctx.font = .03 * h + 'px Arial';
			ctx.fillText('All upgrades', .925 * w, .88 * h);
			ctx.fillText('Bought', .925 * w, .92 * h);
			ctx.fillStyle = 'green';
			ctx.fillRect(.875 * w, .8 * h, .02 * w, .03 * h);
			ctx.fillRect(.895 * w, .8 * h, .02 * w, .03 * h);
			ctx.fillRect(.915 * w, .8 * h, .02 * w, .03 * h);
			ctx.fillRect(.935 * w, .8 * h, .02 * w, .03 * h);
			troop.canAffordB = false;
			break;
		}
	}
	else if(troop.type === 'calvary') {
		switch(troop.levelB) {
			
			case 1:
			ctx.font = .04 * h + 'px Arial';
			ctx.fillText('Increased', .925 * w, .88 * h);
			ctx.fillText('Damage', .925 * w, .92 * h);
			ctx.font = .03 * h + 'px Arial';
			if(playerMoney >= 500) {
				ctx.fillStyle = 'green';
				troop.canAffordB = true;
			}
			else {
				ctx.fillStyle = 'red';
				troop.canAffordB = false;
			}
			troop.itemBCost = 500;
			ctx.fillText('500', .925 * w, .9625 * h);
			break;
			
			case 2:
			ctx.font = .04 * h + 'px Arial';
			ctx.fillText('Increased', .925 * w, .88 * h);
			ctx.fillText('Damage', .925 * w, .92 * h);
			ctx.font = .03 * h + 'px Arial';
			ctx.fillStyle = 'green';
			ctx.fillRect(.875 * w, .8 * h, .02 * w, .03 * h);
			if(playerMoney >= 800) {
				ctx.fillStyle = 'green';
				troop.canAffordB = true;
			}
			else {
				ctx.fillStyle = 'red';
				troop.canAffordB = false;
			}
			troop.itemBCost = 800;
			ctx.fillText('800', .925 * w, .9625 * h);
			break;
			
			case 3:
			ctx.font = .04 * h + 'px Arial';
			ctx.fillText('Increased', .925 * w, .88 * h);
			ctx.fillText('Speed', .925 * w, .92 * h);
			ctx.font = .03 * h + 'px Arial';
			ctx.fillStyle = 'green';
			ctx.fillRect(.875 * w, .8 * h, .02 * w, .03 * h);
			ctx.fillRect(.895 * w, .8 * h, .02 * w, .03 * h);
			if(troop.levelA >= 4) {
				ctx.fillStyle = 'red';
				ctx.fillRect(.915 * w, .8 * h, .02 * w, .03 * h);
				ctx.fillRect(.935 * w, .8 * h, .02 * w, .03 * h);
			}
			if(playerMoney >= 1100) {
				ctx.fillStyle = 'green';
				troop.canAffordB = true;
			}
			else {
				ctx.fillStyle = 'red';
				troop.canAffordB = false;
			}
			troop.itemBCost = 1100;
			ctx.fillText('1100', .925 * w, .9625 * h);
			break;
			
			case 4:
			ctx.font = .04 * h + 'px Arial';
			ctx.fillText('Super', .925 * w, .88 * h);
			ctx.fillText('Speed', .925 * w, .92 * h);
			ctx.font = .03 * h + 'px Arial';
			ctx.fillStyle = 'green';
			ctx.fillRect(.875 * w, .8 * h, .02 * w, .03 * h);
			ctx.fillRect(.895 * w, .8 * h, .02 * w, .03 * h);
			ctx.fillRect(.915 * w, .8 * h, .02 * w, .03 * h);
			if(playerMoney >= 1900) {
				ctx.fillStyle = 'green';
				troop.canAffordB = true;
			}
			else {
				ctx.fillStyle = 'red';
				troop.canAffordB = false;
			}
			troop.itemBCost = 1900;
			ctx.fillText('1900', .925 * w, .9625 * h);
			break;
			
			case 5:
			ctx.font = .03 * h + 'px Arial';
			ctx.fillText('All upgrades', .925 * w, .88 * h);
			ctx.fillText('Bought', .925 * w, .92 * h);
			ctx.fillStyle = 'green';
			ctx.fillRect(.875 * w, .8 * h, .02 * w, .03 * h);
			ctx.fillRect(.895 * w, .8 * h, .02 * w, .03 * h);
			ctx.fillRect(.915 * w, .8 * h, .02 * w, .03 * h);
			ctx.fillRect(.935 * w, .8 * h, .02 * w, .03 * h);
			troop.canAffordB = false;
			break;
		}
	}
	else if(troop.type === 'cannon') {
		switch(troop.levelB) {
			
			case 1:
			ctx.font = .04 * h + 'px Arial';
			ctx.fillText('Increased', .925 * w, .88 * h);
			ctx.fillText('Speed', .925 * w, .92 * h);
			ctx.font = .03 * h + 'px Arial';
			if(playerMoney >= 700) {
				ctx.fillStyle = 'green';
				troop.canAffordB = true;
			}
			else {
				ctx.fillStyle = 'red';
				troop.canAffordB = false;
			}
			troop.itemBCost = 700;
			ctx.fillText('700', .925 * w, .9625 * h);
			break;
			
			case 2:
			ctx.font = .04 * h + 'px Arial';
			ctx.fillText('Increased', .925 * w, .88 * h);
			ctx.fillText('Damage', .925 * w, .92 * h);
			ctx.font = .03 * h + 'px Arial';
			ctx.fillStyle = 'green';
			ctx.fillRect(.875 * w, .8 * h, .02 * w, .03 * h);
			if(playerMoney >= 1000) {
				ctx.fillStyle = 'green';
				troop.canAffordB = true;
			}
			else {
				ctx.fillStyle = 'red';
				troop.canAffordB = false;
			}
			troop.itemBCost = 1000;
			ctx.fillText('1000', .925 * w, .9625 * h);
			break;
			
			case 3:
			ctx.font = .04 * h + 'px Arial';
			ctx.fillText('Double', .925 * w, .88 * h);
			ctx.fillText('Shot', .925 * w, .92 * h);
			ctx.font = .03 * h + 'px Arial';
			ctx.fillStyle = 'green';
			ctx.fillRect(.875 * w, .8 * h, .02 * w, .03 * h);
			ctx.fillRect(.895 * w, .8 * h, .02 * w, .03 * h);
			if(troop.levelA >= 4) {
				ctx.fillStyle = 'red';
				ctx.fillRect(.915 * w, .8 * h, .02 * w, .03 * h);
				ctx.fillRect(.935 * w, .8 * h, .02 * w, .03 * h);
			}
			if(playerMoney >= 1500) {
				ctx.fillStyle = 'green';
				troop.canAffordB = true;
			}
			else {
				ctx.fillStyle = 'red';
				troop.canAffordB = false;
			}
			troop.itemBCost = 1500;
			ctx.fillText('1500', .925 * w, .9625 * h);
			break;
			
			case 4:
			ctx.font = .04 * h + 'px Arial';
			ctx.fillText('Triple', .925 * w, .88 * h);
			ctx.fillText('Shot', .925 * w, .92 * h);
			ctx.font = .03 * h + 'px Arial';
			ctx.fillStyle = 'green';
			ctx.fillRect(.875 * w, .8 * h, .02 * w, .03 * h);
			ctx.fillRect(.895 * w, .8 * h, .02 * w, .03 * h);
			ctx.fillRect(.915 * w, .8 * h, .02 * w, .03 * h);
			if(playerMoney >= 3000) {
				ctx.fillStyle = 'green';
				troop.canAffordB = true;
			}
			else {
				ctx.fillStyle = 'red';
				troop.canAffordB = false;
			}
			troop.itemBCost = 3000;
			ctx.fillText('3000', .925 * w, .9625 * h);
			break;
			
			case 5:
			ctx.font = .03 * h + 'px Arial';
			ctx.fillText('All upgrades', .925 * w, .88 * h);
			ctx.fillText('Bought', .925 * w, .92 * h);
			ctx.fillStyle = 'green';
			ctx.fillRect(.875 * w, .8 * h, .02 * w, .03 * h);
			ctx.fillRect(.895 * w, .8 * h, .02 * w, .03 * h);
			ctx.fillRect(.915 * w, .8 * h, .02 * w, .03 * h);
			ctx.fillRect(.935 * w, .8 * h, .02 * w, .03 * h);
			troop.canAffordB = false;
			break;
		}
	}
	else if(troop.type === 'ship') {
		switch(troop.levelB) {
			
			case 1:
			ctx.font = .04 * h + 'px Arial';
			ctx.fillText('Stealth', .925 * w, .88 * h);
			ctx.fillText('Detection', .925 * w, .92 * h);
			ctx.font = .03 * h + 'px Arial';
			if(playerMoney >= 500) {
				ctx.fillStyle = 'green';
				troop.canAffordB = true;
			}
			else {
				ctx.fillStyle = 'red';
				troop.canAffordB = false;
			}
			troop.itemBCost = 500;
			ctx.fillText('500', .925 * w, .9625 * h);
			break;
			
			case 2:
			ctx.font = .04 * h + 'px Arial';
			ctx.fillText('Piercing', .925 * w, .88 * h);
			ctx.fillText('Arrows', .925 * w, .92 * h);
			ctx.font = .03 * h + 'px Arial';
			ctx.fillStyle = 'green';
			ctx.fillRect(.875 * w, .8 * h, .02 * w, .03 * h);
			if(playerMoney >= 600) {
				ctx.fillStyle = 'green';
				troop.canAffordB = true;
			}
			else {
				ctx.fillStyle = 'red';
				troop.canAffordB = false;
			}
			troop.itemBCost = 600;
			ctx.fillText('600', .925 * w, .9625 * h);
			break;
			
			case 3:
			ctx.font = .04 * h + 'px Arial';
			ctx.fillText('Cannon', .925 * w, .88 * h);
			ctx.fillText('Shot', .925 * w, .92 * h);
			ctx.font = .03 * h + 'px Arial';
			ctx.fillStyle = 'green';
			ctx.fillRect(.875 * w, .8 * h, .02 * w, .03 * h);
			ctx.fillRect(.895 * w, .8 * h, .02 * w, .03 * h);
			if(troop.levelA >= 4) {
				ctx.fillStyle = 'red';
				ctx.fillRect(.915 * w, .8 * h, .02 * w, .03 * h);
				ctx.fillRect(.935 * w, .8 * h, .02 * w, .03 * h);
			}
			if(playerMoney >= 1500) {
				ctx.fillStyle = 'green';
				troop.canAffordB = true;
			}
			else {
				ctx.fillStyle = 'red';
				troop.canAffordB = false;
			}
			troop.itemBCost = 1500;
			ctx.fillText('1500', .925 * w, .9625 * h);
			break;
			
			case 4:
			ctx.font = .025 * h + 'px Arial';
			ctx.fillText('Increased', .925 * w, .88 * h);
			ctx.fillText('Blast Radius', .925 * w, .92 * h);
			ctx.font = .03 * h + 'px Arial';
			ctx.fillStyle = 'green';
			ctx.fillRect(.875 * w, .8 * h, .02 * w, .03 * h);
			ctx.fillRect(.895 * w, .8 * h, .02 * w, .03 * h);
			ctx.fillRect(.915 * w, .8 * h, .02 * w, .03 * h);
			if(playerMoney >= 2500) {
				ctx.fillStyle = 'green';
				troop.canAffordB = true;
			}
			else {
				ctx.fillStyle = 'red';
				troop.canAffordB = false;
			}
			troop.itemBCost = 2500;
			ctx.fillText('2500', .925 * w, .9625 * h);
			break;
			
			case 5:
			ctx.font = .03 * h + 'px Arial';
			ctx.fillText('All upgrades', .925 * w, .88 * h);
			ctx.fillText('Bought', .925 * w, .92 * h);
			ctx.fillStyle = 'green';
			ctx.fillRect(.875 * w, .8 * h, .02 * w, .03 * h);
			ctx.fillRect(.895 * w, .8 * h, .02 * w, .03 * h);
			ctx.fillRect(.915 * w, .8 * h, .02 * w, .03 * h);
			ctx.fillRect(.935 * w, .8 * h, .02 * w, .03 * h);
			troop.canAffordB = false;
			break;
		}
	}
	else if(troop.type === 'sniper') {
		switch(troop.levelB) {
			
			case 1:
			ctx.font = .04 * h + 'px Arial';
			ctx.fillText('Increased', .925 * w, .88 * h);
			ctx.fillText('Speed', .925 * w, .92 * h);
			ctx.font = .03 * h + 'px Arial';
			if(playerMoney >= 800) {
				ctx.fillStyle = 'green';
				troop.canAffordB = true;
			}
			else {
				ctx.fillStyle = 'red';
				troop.canAffordB = false;
			}
			troop.itemBCost = 800;
			ctx.fillText('800', .925 * w, .9625 * h);
			break;
			
			case 2:
			ctx.font = .04 * h + 'px Arial';
			ctx.fillText('Increased', .925 * w, .88 * h);
			ctx.fillText('Speed', .925 * w, .92 * h);
			ctx.font = .03 * h + 'px Arial';
			ctx.fillStyle = 'green';
			ctx.fillRect(.875 * w, .8 * h, .02 * w, .03 * h);
			if(playerMoney >= 1300) {
				ctx.fillStyle = 'green';
				troop.canAffordB = true;
			}
			else {
				ctx.fillStyle = 'red';
				troop.canAffordB = false;
			}
			troop.itemBCost = 1300;
			ctx.fillText('1300', .925 * w, .9625 * h);
			break;
			
			case 3:
			ctx.font = .04 * h + 'px Arial';
			ctx.fillText('Increased', .925 * w, .88 * h);
			ctx.fillText('Damage', .925 * w, .92 * h);
			ctx.font = .03 * h + 'px Arial';
			ctx.fillStyle = 'green';
			ctx.fillRect(.875 * w, .8 * h, .02 * w, .03 * h);
			ctx.fillRect(.895 * w, .8 * h, .02 * w, .03 * h);
			if(troop.levelA >= 4) {
				ctx.fillStyle = 'red';
				ctx.fillRect(.915 * w, .8 * h, .02 * w, .03 * h);
				ctx.fillRect(.935 * w, .8 * h, .02 * w, .03 * h);
			}
			if(playerMoney >= 2000) {
				ctx.fillStyle = 'green';
				troop.canAffordB = true;
			}
			else {
				ctx.fillStyle = 'red';
				troop.canAffordB = false;
			}
			troop.itemBCost = 2000;
			ctx.fillText('2000', .925 * w, .9625 * h);
			break;
			
			case 4:
			ctx.font = .025 * h + 'px Arial';
			ctx.fillText('Double', .925 * w, .88 * h);
			ctx.fillText('Shot', .925 * w, .92 * h);
			ctx.font = .03 * h + 'px Arial';
			ctx.fillStyle = 'green';
			ctx.fillRect(.875 * w, .8 * h, .02 * w, .03 * h);
			ctx.fillRect(.895 * w, .8 * h, .02 * w, .03 * h);
			ctx.fillRect(.915 * w, .8 * h, .02 * w, .03 * h);
			if(playerMoney >= 2500) {
				ctx.fillStyle = 'green';
				troop.canAffordB = true;
			}
			else {
				ctx.fillStyle = 'red';
				troop.canAffordB = false;
			}
			troop.itemBCost = 2500;
			ctx.fillText('2500', .925 * w, .9625 * h);
			break;
			
			case 5:
			ctx.font = .03 * h + 'px Arial';
			ctx.fillText('All upgrades', .925 * w, .88 * h);
			ctx.fillText('Bought', .925 * w, .92 * h);
			ctx.fillStyle = 'green';
			ctx.fillRect(.875 * w, .8 * h, .02 * w, .03 * h);
			ctx.fillRect(.895 * w, .8 * h, .02 * w, .03 * h);
			ctx.fillRect(.915 * w, .8 * h, .02 * w, .03 * h);
			ctx.fillRect(.935 * w, .8 * h, .02 * w, .03 * h);
			troop.canAffordB = false;
			break;
		}
	}
	else if(troop.type === 'general') {
		switch(troop.levelB) {
			
			case 1:
			ctx.font = .04 * h + 'px Arial';
			ctx.fillText('Stealth', .925 * w, .88 * h);
			ctx.fillText('Detection', .925 * w, .92 * h);
			ctx.font = .03 * h + 'px Arial';
			if(playerMoney >= 1000) {
				ctx.fillStyle = 'green';
				troop.canAffordB = true;
			}
			else {
				ctx.fillStyle = 'red';
				troop.canAffordB = false;
			}
			troop.itemBCost = 1000;
			ctx.fillText('1000', .925 * w, .9625 * h);
			break;
			
			case 2:
			ctx.font = .04 * h + 'px Arial';
			ctx.fillText('Increased', .925 * w, .88 * h);
			ctx.fillText('Speed', .925 * w, .92 * h);
			ctx.font = .03 * h + 'px Arial';
			ctx.fillStyle = 'green';
			ctx.fillRect(.875 * w, .8 * h, .02 * w, .03 * h);
			if(playerMoney >= 2000 + 10 * waveNum) {
				ctx.fillStyle = 'green';
				troop.canAffordB = true;
			}
			else {
				ctx.fillStyle = 'red';
				troop.canAffordB = false;
			}
			troop.itemBCost = 2000 + 10 * waveNum;
			ctx.fillText(2000 + 10 * waveNum, .925 * w, .9625 * h);
			break;
			
			case 3:
			ctx.font = .04 * h + 'px Arial';
			ctx.fillText('Increased', .925 * w, .88 * h);
			ctx.fillText('Speed', .925 * w, .92 * h);
			ctx.font = .03 * h + 'px Arial';
			ctx.fillStyle = 'green';
			ctx.fillRect(.875 * w, .8 * h, .02 * w, .03 * h);
			ctx.fillRect(.895 * w, .8 * h, .02 * w, .03 * h);
			if(troop.levelA >= 4) {
				ctx.fillStyle = 'red';
				ctx.fillRect(.915 * w, .8 * h, .02 * w, .03 * h);
				ctx.fillRect(.935 * w, .8 * h, .02 * w, .03 * h);
			}
			if(playerMoney >= 3000 + 10 * waveNum) {
				ctx.fillStyle = 'green';
				troop.canAffordB = true;
			}
			else {
				ctx.fillStyle = 'red';
				troop.canAffordB = false;
			}
			troop.itemBCost = 3000 + 10 * waveNum;
			ctx.fillText(3000 + 10 * waveNum, .925 * w, .9625 * h);
			break;
			
			case 4:
			ctx.font = .04 * h + 'px Arial';
			ctx.fillText('None', .925 * w, .88 * h);
			ctx.fillText('Remaining', .925 * w, .92 * h);
			ctx.font = .03 * h + 'px Arial';
			ctx.fillStyle = 'green';
			ctx.fillRect(.875 * w, .8 * h, .02 * w, .03 * h);
			ctx.fillRect(.895 * w, .8 * h, .02 * w, .03 * h);
			ctx.fillRect(.915 * w, .8 * h, .02 * w, .03 * h);
			this.canAffordB = false;
			break;
			
			case 5:
			ctx.font = .03 * h + 'px Arial';
			ctx.fillText('All upgrades', .925 * w, .88 * h);
			ctx.fillText('Bought', .925 * w, .92 * h);
			ctx.fillStyle = 'green';
			ctx.fillRect(.875 * w, .8 * h, .02 * w, .03 * h);
			ctx.fillRect(.895 * w, .8 * h, .02 * w, .03 * h);
			ctx.fillRect(.915 * w, .8 * h, .02 * w, .03 * h);
			ctx.fillRect(.935 * w, .8 * h, .02 * w, .03 * h);
			troop.canAffordB = false;
			break;
		}
	}
	else if(troop.type === 'medic') {
		switch(troop.levelB) {
			
			case 1:
			ctx.font = .04 * h + 'px Arial';
			ctx.fillText('Increased', .925 * w, .88 * h);
			ctx.fillText('Speed', .925 * w, .92 * h);
			ctx.font = .03 * h + 'px Arial';
			if(playerMoney >= 2000) {
				ctx.fillStyle = 'green';
				troop.canAffordB = true;
			}
			else {
				ctx.fillStyle = 'red';
				troop.canAffordB = false;
			}
			troop.itemBCost = 2000;
			ctx.fillText('2000', .925 * w, .9625 * h);
			break;
			
			case 2:
			ctx.font = .04 * h + 'px Arial';
			ctx.fillText('Increased', .925 * w, .88 * h);
			ctx.fillText('Speed', .925 * w, .92 * h);
			ctx.font = .03 * h + 'px Arial';
			ctx.fillStyle = 'green';
			ctx.fillRect(.875 * w, .8 * h, .02 * w, .03 * h);
			if(playerMoney >= 3000) {
				ctx.fillStyle = 'green';
				troop.canAffordB = true;
			}
			else {
				ctx.fillStyle = 'red';
				troop.canAffordB = false;
			}
			troop.itemBCost = 3000;
			ctx.fillText('3000', .925 * w, .9625 * h);
			break;
			
			case 3:
			ctx.font = .04 * h + 'px Arial';
			ctx.fillText('None', .925 * w, .88 * h);
			ctx.fillText('Remaining', .925 * w, .92 * h);
			ctx.font = .03 * h + 'px Arial';
			ctx.fillStyle = 'green';
			ctx.fillRect(.875 * w, .8 * h, .02 * w, .03 * h);
			ctx.fillRect(.895 * w, .8 * h, .02 * w, .03 * h);
			if(troop.levelA >= 4) {
				ctx.fillStyle = 'red';
				ctx.fillRect(.915 * w, .8 * h, .02 * w, .03 * h);
				ctx.fillRect(.935 * w, .8 * h, .02 * w, .03 * h);
			}
			if(playerMoney >= 2000) {
				ctx.fillStyle = 'green';
				troop.canAffordB = true;
			}
			else {
				ctx.fillStyle = 'red';
				troop.canAffordB = false;
			}
			troop.itemBCost = 2000;
			//ctx.fillText('2000', .925 * w, .9625 * h);
			troop.canAffordB = false;
			break;
			
			case 4:
			ctx.font = .04 * h + 'px Arial';
			ctx.fillText('None', .925 * w, .88 * h);
			ctx.fillText('Remaining', .925 * w, .92 * h);
			ctx.font = .03 * h + 'px Arial';
			ctx.fillStyle = 'green';
			ctx.fillRect(.875 * w, .8 * h, .02 * w, .03 * h);
			ctx.fillRect(.895 * w, .8 * h, .02 * w, .03 * h);
			ctx.fillRect(.915 * w, .8 * h, .02 * w, .03 * h);
			if(playerMoney >= 2500) {
				ctx.fillStyle = 'green';
				troop.canAffordB = true;
			}
			else {
				ctx.fillStyle = 'red';
				troop.canAffordB = false;
			}
			troop.itemBCost = 2500;
			ctx.fillText('2500', .925 * w, .9625 * h);
			break;
			
			case 5:
			ctx.font = .03 * h + 'px Arial';
			ctx.fillText('All upgrades', .925 * w, .88 * h);
			ctx.fillText('Bought', .925 * w, .92 * h);
			ctx.fillStyle = 'green';
			ctx.fillRect(.875 * w, .8 * h, .02 * w, .03 * h);
			ctx.fillRect(.895 * w, .8 * h, .02 * w, .03 * h);
			ctx.fillRect(.915 * w, .8 * h, .02 * w, .03 * h);
			ctx.fillRect(.935 * w, .8 * h, .02 * w, .03 * h);
			troop.canAffordB = false;
			break;
		}
	}
	else if(troop.type === 'rifleman') {
		switch(troop.levelB) {
			
			case 1:
			ctx.font = .04 * h + 'px Arial';
			ctx.fillText('Increased', .925 * w, .88 * h);
			ctx.fillText('Damage', .925 * w, .92 * h);
			ctx.font = .03 * h + 'px Arial';
			if(playerMoney >= 800) {
				ctx.fillStyle = 'green';
				troop.canAffordB = true;
			}
			else {
				ctx.fillStyle = 'red';
				troop.canAffordB = false;
			}
			troop.itemBCost = 800;
			ctx.fillText('800', .925 * w, .9625 * h);
			break;
			
			case 2:
			ctx.font = .04 * h + 'px Arial';
			ctx.fillText('Piercing', .925 * w, .88 * h);
			ctx.fillText('Bullets', .925 * w, .92 * h);
			ctx.font = .03 * h + 'px Arial';
			ctx.fillStyle = 'green';
			ctx.fillRect(.875 * w, .8 * h, .02 * w, .03 * h);
			if(playerMoney >= 1300) {
				ctx.fillStyle = 'green';
				troop.canAffordB = true;
			}
			else {
				ctx.fillStyle = 'red';
				troop.canAffordB = false;
			}
			troop.itemBCost = 1300;
			ctx.fillText('1300', .925 * w, .9625 * h);
			break;
			
			case 3:
			ctx.font = .04 * h + 'px Arial';
			ctx.fillText('Increased', .925 * w, .88 * h);
			ctx.fillText('Damage', .925 * w, .92 * h);
			ctx.font = .03 * h + 'px Arial';
			ctx.fillStyle = 'green';
			ctx.fillRect(.875 * w, .8 * h, .02 * w, .03 * h);
			ctx.fillRect(.895 * w, .8 * h, .02 * w, .03 * h);
			if(troop.levelA >= 4) {
				ctx.fillStyle = 'red';
				ctx.fillRect(.915 * w, .8 * h, .02 * w, .03 * h);
				ctx.fillRect(.935 * w, .8 * h, .02 * w, .03 * h);
			}
			if(playerMoney >= 2000) {
				ctx.fillStyle = 'green';
				troop.canAffordB = true;
			}
			else {
				ctx.fillStyle = 'red';
				troop.canAffordB = false;
			}
			troop.itemBCost = 2000;
			ctx.fillText('2000', .925 * w, .9625 * h);
			break;
			
			case 4:
			ctx.font = .025 * h + 'px Arial';
			ctx.fillText('Slow Enemy', .925 * w, .88 * h);
			ctx.fillText('Down', .925 * w, .92 * h);
			ctx.font = .03 * h + 'px Arial';
			ctx.fillStyle = 'green';
			ctx.fillRect(.875 * w, .8 * h, .02 * w, .03 * h);
			ctx.fillRect(.895 * w, .8 * h, .02 * w, .03 * h);
			ctx.fillRect(.915 * w, .8 * h, .02 * w, .03 * h);
			if(playerMoney >= 3000) {
				ctx.fillStyle = 'green';
				troop.canAffordB = true;
			}
			else {
				ctx.fillStyle = 'red';
				troop.canAffordB = false;
			}
			troop.itemBCost = 3000;
			ctx.fillText('3000', .925 * w, .9625 * h);
			break;
			
			case 5:
			ctx.font = .03 * h + 'px Arial';
			ctx.fillText('All upgrades', .925 * w, .88 * h);
			ctx.fillText('Bought', .925 * w, .92 * h);
			ctx.fillStyle = 'green';
			ctx.fillRect(.875 * w, .8 * h, .02 * w, .03 * h);
			ctx.fillRect(.895 * w, .8 * h, .02 * w, .03 * h);
			ctx.fillRect(.915 * w, .8 * h, .02 * w, .03 * h);
			ctx.fillRect(.935 * w, .8 * h, .02 * w, .03 * h);
			troop.canAffordB = false;
			break;
		}
	}
	else if(troop.type === 'wizard') {
		switch(troop.levelB) {
			
			case 1:
			ctx.font = .04 * h + 'px Arial';
			ctx.fillText('Increased', .925 * w, .88 * h);
			ctx.fillText('Speed', .925 * w, .92 * h);
			ctx.font = .03 * h + 'px Arial';
			if(playerMoney >= 1000) {
				ctx.fillStyle = 'green';
				troop.canAffordB = true;
			}
			else {
				ctx.fillStyle = 'red';
				troop.canAffordB = false;
			}
			troop.itemBCost = 1000;
			ctx.fillText('1000', .925 * w, .9625 * h);
			break;
			
			case 2:
			ctx.font = .04 * h + 'px Arial';
			ctx.fillText('Increased', .925 * w, .88 * h);
			ctx.fillText('Damage', .925 * w, .92 * h);
			ctx.font = .03 * h + 'px Arial';
			ctx.fillStyle = 'green';
			ctx.fillRect(.875 * w, .8 * h, .02 * w, .03 * h);
			if(playerMoney >= 1400) {
				ctx.fillStyle = 'green';
				troop.canAffordB = true;
			}
			else {
				ctx.fillStyle = 'red';
				troop.canAffordB = false;
			}
			troop.itemBCost = 1400;
			ctx.fillText('1400', .925 * w, .9625 * h);
			break;
			
			case 3:
			ctx.font = .04 * h + 'px Arial';
			ctx.fillText('Super', .925 * w, .88 * h);
			ctx.fillText('Speed', .925 * w, .92 * h);
			ctx.font = .03 * h + 'px Arial';
			ctx.fillStyle = 'green';
			ctx.fillRect(.875 * w, .8 * h, .02 * w, .03 * h);
			ctx.fillRect(.895 * w, .8 * h, .02 * w, .03 * h);
			if(troop.levelA >= 4) {
				ctx.fillStyle = 'red';
				ctx.fillRect(.915 * w, .8 * h, .02 * w, .03 * h);
				ctx.fillRect(.935 * w, .8 * h, .02 * w, .03 * h);
			}
			if(playerMoney >= 3000) {
				ctx.fillStyle = 'green';
				troop.canAffordB = true;
			}
			else {
				ctx.fillStyle = 'red';
				troop.canAffordB = false;
			}
			troop.itemBCost = 3000;
			ctx.fillText('3000', .925 * w, .9625 * h);
			break;
			
			case 4:
			ctx.font = .04 * h + 'px Arial';
			ctx.fillText('Triple', .925 * w, .88 * h);
			ctx.fillText('Shot', .925 * w, .92 * h);
			ctx.font = .03 * h + 'px Arial';
			ctx.fillStyle = 'green';
			ctx.fillRect(.875 * w, .8 * h, .02 * w, .03 * h);
			ctx.fillRect(.895 * w, .8 * h, .02 * w, .03 * h);
			ctx.fillRect(.915 * w, .8 * h, .02 * w, .03 * h);
			if(playerMoney >= 4000) {
				ctx.fillStyle = 'green';
				troop.canAffordB = true;
			}
			else {
				ctx.fillStyle = 'red';
				troop.canAffordB = false;
			}
			troop.itemBCost = 4000;
			ctx.fillText('4000', .925 * w, .9625 * h);
			break;
			
			case 5:
			ctx.font = .03 * h + 'px Arial';
			ctx.fillText('All upgrades', .925 * w, .88 * h);
			ctx.fillText('Bought', .925 * w, .92 * h);
			ctx.fillStyle = 'green';
			ctx.fillRect(.875 * w, .8 * h, .02 * w, .03 * h);
			ctx.fillRect(.895 * w, .8 * h, .02 * w, .03 * h);
			ctx.fillRect(.915 * w, .8 * h, .02 * w, .03 * h);
			ctx.fillRect(.935 * w, .8 * h, .02 * w, .03 * h);
			troop.canAffordB = false;
			break;
		}
	}
	
	ctx.restore();
}

function displayUpgradesA(troop) {
	ctx.save();
	
	ctx.beginPath();
	ctx.lineJoin = 'round';
	ctx.fillStyle = 'gold';
	ctx.fillRect(.8 * w, .9325 * h, .05 * w, .03 * h);
	ctx.fillRect(.9 * w, .9325 * h, .05 * w, .03 * h);
	ctx.closePath();
	
	ctx.fillStyle = '#201B98';
	ctx.fillRect(.775 * w, .83 * h, .1 * w, .1 * h);
	ctx.fillStyle = '#56B210';
	ctx.fillRect(.875 * w, .83 * h, .1 * w, .1 * h);
	ctx.fillStyle = 'black';
	ctx.textAlign = 'center';
	
	if(troop.type === 'romanSoldier') {
		
		switch(troop.levelA) {
			
			case 1:
			ctx.font = .04 * h + 'px Arial';
			ctx.fillText('Longer', .825 * w, .88 * h);
			ctx.fillText('Range', .825 * w, .92 * h);
			ctx.font = .03 * h + 'px Arial';
			if(playerMoney >= 200) {
				ctx.fillStyle = 'green';
				troop.canAffordA = true;
			}
			else {
				ctx.fillStyle = 'red';
				troop.canAffordA = false;
			}
			troop.itemACost = 200;
			ctx.fillText('200', .825 * w, .9625 * h);
			break;
			
			case 2: 
			ctx.font = .03 * h + 'px Arial';
			ctx.fillText('Even Longer', .825 * w, .88 * h);
			ctx.fillText('Range', .825 * w, .92 * h);
			ctx.fillStyle = 'green';
			ctx.fillRect(.775 * w, .8 * h, .02 * w, .03 * h);
			if(playerMoney >= 300) {
				ctx.fillStyle = 'green';
				troop.canAffordA = true;
			}
			else {
				ctx.fillStyle = 'red';
				troop.canAffordA = false;
			}
			troop.itemACost = 300;
			ctx.fillText('300', .825 * w, .9625 * h);
			break;
			
			case 3:
			ctx.font = .04 * h + 'px Arial';
			ctx.fillText('Stealth', .825 * w, .88 * h);
			ctx.fillText('Detection', .825 * w, .92 * h);
			ctx.fillStyle = 'green';
			ctx.fillRect(.775 * w, .8 * h, .02 * w, .03 * h);
			ctx.fillRect(.795 * w, .8 * h, .02 * w, .03 * h);
			if(troop.levelB >= 4) {
				ctx.fillStyle = 'red';
				ctx.fillRect(.815 * w, .8 * h, .02 * w, .03 * h);
				ctx.fillRect(.835 * w, .8 * h, .02 * w, .03 * h);
			}
				
			if(playerMoney >= 500) {
				ctx.fillStyle = 'green';
				troop.canAffordA = true;
			}
			else {
				ctx.fillStyle = 'red';
				troop.canAffordA = false;
			}
			troop.itemACost = 500;
			ctx.fillText('500', .825 * w, .9625 * h);
			break;
			
			case 4: 
			ctx.font = .025 * h + 'px Arial';
			ctx.fillText('All Upgrades', .825 * w, .88 * h);
			ctx.fillText('Bought', .825 * w, .92 * h);
			ctx.fillStyle = 'green';
			ctx.fillRect(.775 * w, .8 * h, .02 * w, .03 * h);
			ctx.fillRect(.795 * w, .8 * h, .02 * w, .03 * h);
			ctx.fillRect(.815 * w, .8 * h, .02 * w, .03 * h);
			troop.canAffordA = false;
			break;
			
			case 5: 
			ctx.font = .025 * h + 'px Arial';
			ctx.fillText('All Upgrades', .825 * w, .88 * h);
			ctx.fillText('Bought', .825 * w, .92 * h);
			ctx.fillStyle = 'green';
			ctx.fillRect(.775 * w, .8 * h, .02 * w, .03 * h);
			ctx.fillRect(.795 * w, .8 * h, .02 * w, .03 * h);
			ctx.fillRect(.815 * w, .8 * h, .02 * w, .03 * h);
			break;
		}
	}
	else if(troop.type === 'archer') {
		switch(troop.levelA) {
			
			case 1:
			ctx.font = .04 * h + 'px Arial';
			ctx.fillText('Longer', .825 * w, .88 * h);
			ctx.fillText('Range', .825 * w, .92 * h);
			ctx.font = .03 * h + 'px Arial';
			if(playerMoney >= 300) {
				ctx.fillStyle = 'green';
				troop.canAffordA = true;
			}
			else {
				ctx.fillStyle = 'red';
				troop.canAffordA = false;
			}
			troop.itemACost = 300;
			ctx.fillText('300', .825 * w, .9625 * h);
			break;
			
			case 2:
			ctx.font = .04 * h + 'px Arial';
			ctx.fillText('Longer', .825 * w, .88 * h);
			ctx.fillText('Range', .825 * w, .92 * h);
			ctx.font = .03 * h + 'px Arial';
			ctx.fillStyle = 'green';
			ctx.fillRect(.775 * w, .8 * h, .02 * w, .03 * h);
			if(playerMoney >= 500) {
				ctx.fillStyle = 'green';
				troop.canAffordA = true;
			}
			else {
				ctx.fillStyle = 'red';
				troop.canAffordA = false;
			}
			troop.itemACost = 500;
			ctx.fillText('500', .825 * w, .9625 * h);
			break;
			
			case 3:
			ctx.font = .04 * h + 'px Arial';
			ctx.fillText('Stealth', .825 * w, .88 * h);
			ctx.fillText('Detection', .825 * w, .92 * h);
			ctx.font = .03 * h + 'px Arial';
			ctx.fillStyle = 'green';
			ctx.fillRect(.775 * w, .8 * h, .02 * w, .03 * h);
			ctx.fillRect(.795 * w, .8 * h, .02 * w, .03 * h);
			if(troop.levelB >= 4) {
				ctx.fillStyle = 'red';
				ctx.fillRect(.815 * w, .8 * h, .02 * w, .03 * h);
				ctx.fillRect(.835 * w, .8 * h, .02 * w, .03 * h);
			}
			if(playerMoney >= 700) {
				ctx.fillStyle = 'green';
				troop.canAffordA = true;
			}
			else {
				ctx.fillStyle = 'red';
				troop.canAffordA = false;
			}
			troop.itemACost = 700;
			ctx.fillText('700', .825 * w, .9625 * h);
			break;
			
			case 4:
			ctx.font = .04 * h + 'px Arial';
			ctx.fillText('Triple', .825 * w, .88 * h);
			ctx.fillText('Shot', .825 * w, .92 * h);
			ctx.fillStyle = 'green';
			ctx.fillRect(.775 * w, .8 * h, .02 * w, .03 * h);
			ctx.fillRect(.795 * w, .8 * h, .02 * w, .03 * h);
			ctx.fillRect(.815 * w, .8 * h, .02 * w, .03 * h);
			ctx.font = .03 * h + 'px Arial';
			if(playerMoney >= 1100) {
				ctx.fillStyle = 'green';
				troop.canAffordA = true;
			}
			else {
				ctx.fillStyle = 'red';
				troop.canAffordA = false;
			}
			troop.itemACost = 1100;
			ctx.fillText('1100', .825 * w, .9625 * h);
			break;
			
			case 5:
			ctx.font = .025 * h + 'px Arial';
			ctx.fillText('All Upgrades', .825 * w, .88 * h);
			ctx.fillText('Bought', .825 * w, .92 * h);
			ctx.fillStyle = 'green';
			ctx.fillRect(.775 * w, .8 * h, .02 * w, .03 * h);
			ctx.fillRect(.795 * w, .8 * h, .02 * w, .03 * h);
			ctx.fillRect(.815 * w, .8 * h, .02 * w, .03 * h);
			ctx.fillRect(.835 * w, .8 * h, .02 * w, .03 * h);
			troop.canAffordA = false;
			break;
		}
	}
	else if(troop.type === 'calvary') {
		switch(troop.levelA) {
			
			case 1:
			ctx.font = .04 * h + 'px Arial';
			ctx.fillText('Longer', .825 * w, .88 * h);
			ctx.fillText('Range', .825 * w, .92 * h);
			ctx.font = .03 * h + 'px Arial';
			if(playerMoney >= 300) {
				ctx.fillStyle = 'green';
				troop.canAffordA = true;
			}
			else {
				ctx.fillStyle = 'red';
				troop.canAffordA = false;
			}
			troop.itemACost = 300;
			ctx.fillText('300', .825 * w, .9625 * h);
			break;
			
			case 2:
			ctx.font = .04 * h + 'px Arial';
			ctx.fillText('Multi', .825 * w, .88 * h);
			ctx.fillText('Target', .825 * w, .92 * h);
			ctx.font = .03 * h + 'px Arial';
			ctx.fillStyle = 'green';
			ctx.fillRect(.775 * w, .8 * h, .02 * w, .03 * h);
			if(playerMoney >= 700) {
				ctx.fillStyle = 'green';
				troop.canAffordA = true;
			}
			else {
				ctx.fillStyle = 'red';
				troop.canAffordA = false;
			}
			troop.itemACost = 700;
			ctx.fillText('700', .825 * w, .9625 * h);
			break;
			
			case 3:
			ctx.font = .04 * h + 'px Arial';
			ctx.fillText('Stun', .825 * w, .88 * h);
			ctx.fillText('Ability', .825 * w, .92 * h);
			ctx.font = .03 * h + 'px Arial';
			ctx.fillStyle = 'green';
			ctx.fillRect(.775 * w, .8 * h, .02 * w, .03 * h);
			ctx.fillRect(.795 * w, .8 * h, .02 * w, .03 * h);
			if(troop.levelB >= 4) {
				ctx.fillStyle = 'red';
				ctx.fillRect(.815 * w, .8 * h, .02 * w, .03 * h);
				ctx.fillRect(.835 * w, .8 * h, .02 * w, .03 * h);
			}
			if(playerMoney >= 1100) {
				ctx.fillStyle = 'green';
				troop.canAffordA = true;
			}
			else {
				ctx.fillStyle = 'red';
				troop.canAffordA = false;
			}
			troop.itemACost = 1100;
			ctx.fillText('1100', .825 * w, .9625 * h);
			break;
			
			case 4:
			ctx.font = .04 * h + 'px Arial';
			ctx.fillText('Upgrade', .825 * w, .88 * h);
			ctx.fillText('Stun', .825 * w, .92 * h);
			ctx.fillStyle = 'green';
			ctx.fillRect(.775 * w, .8 * h, .02 * w, .03 * h);
			ctx.fillRect(.795 * w, .8 * h, .02 * w, .03 * h);
			ctx.fillRect(.815 * w, .8 * h, .02 * w, .03 * h);
			if(playerMoney >= 2000) {
				ctx.fillStyle = 'green';
				troop.canAffordA = true;
			}
			else {
				ctx.fillStyle = 'red';
				troop.canAffordA = false;
			}
			troop.itemACost = 2000;
			ctx.fillText('2000', .825 * w, .9625 * h);
			break;
			
			case 5:
			ctx.font = .025 * h + 'px Arial';
			ctx.fillText('All Upgrades', .825 * w, .88 * h);
			ctx.fillText('Bought', .825 * w, .92 * h);
			ctx.fillStyle = 'green';
			ctx.fillRect(.775 * w, .8 * h, .02 * w, .03 * h);
			ctx.fillRect(.795 * w, .8 * h, .02 * w, .03 * h);
			ctx.fillRect(.815 * w, .8 * h, .02 * w, .03 * h);
			ctx.fillRect(.835 * w, .8 * h, .02 * w, .03 * h);
			troop.canAffordA = false;
			break;
		}
	}
	else if(troop.type === 'cannon') {
		switch(troop.levelA) {
			
			case 1:
			ctx.font = .04 * h + 'px Arial';
			ctx.fillText('Longer', .825 * w, .88 * h);
			ctx.fillText('Range', .825 * w, .92 * h);
			ctx.font = .03 * h + 'px Arial';
			if(playerMoney >= 400) {
				ctx.fillStyle = 'green';
				troop.canAffordA = true;
			}
			else {
				ctx.fillStyle = 'red';
				troop.canAffordA = false;
			}
			troop.itemACost = 400;
			ctx.fillText('400', .825 * w, .9625 * h);
			break;
			
			case 2:
			ctx.font = .04 * h + 'px Arial';
			ctx.fillText('Longer', .825 * w, .88 * h);
			ctx.fillText('Range', .825 * w, .92 * h);
			ctx.font = .03 * h + 'px Arial';
			ctx.fillStyle = 'green';
			ctx.fillRect(.775 * w, .8 * h, .02 * w, .03 * h);
			if(playerMoney >= 700) {
				ctx.fillStyle = 'green';
				troop.canAffordA = true;
			}
			else {
				ctx.fillStyle = 'red';
				troop.canAffordA = false;
			}
			troop.itemACost = 700;
			ctx.fillText('700', .825 * w, .9625 * h);
			break;
			
			case 3:
			ctx.font = .025 * h + 'px Arial';
			ctx.fillText('Increased', .825 * w, .88 * h);
			ctx.fillText('Explosion Radius', .825 * w, .92 * h);
			ctx.font = .03 * h + 'px Arial';
			ctx.fillStyle = 'green';
			ctx.fillRect(.775 * w, .8 * h, .02 * w, .03 * h);
			ctx.fillRect(.795 * w, .8 * h, .02 * w, .03 * h);
			if(troop.levelB >= 4) {
				ctx.fillStyle = 'red';
				ctx.fillRect(.815 * w, .8 * h, .02 * w, .03 * h);
				ctx.fillRect(.835 * w, .8 * h, .02 * w, .03 * h);
			}
			if(playerMoney >= 1200) {
				ctx.fillStyle = 'green';
				troop.canAffordA = true;
			}
			else {
				ctx.fillStyle = 'red';
				troop.canAffordA = false;
			}
			troop.itemACost = 1200;
			ctx.fillText('1200', .825 * w, .9625 * h);
			break;
			
			case 4:
			ctx.font = .025 * h + 'px Arial';
			ctx.fillText('Increased', .825 * w, .88 * h);
			ctx.fillText('Explosion Radius', .825 * w, .92 * h);
			ctx.fillStyle = 'green';
			ctx.fillRect(.775 * w, .8 * h, .02 * w, .03 * h);
			ctx.fillRect(.795 * w, .8 * h, .02 * w, .03 * h);
			ctx.fillRect(.815 * w, .8 * h, .02 * w, .03 * h);
			if(playerMoney >= 1900) {
				ctx.fillStyle = 'green';
				troop.canAffordA = true;
			}
			else {
				ctx.fillStyle = 'red';
				troop.canAffordA = false;
			}
			troop.itemACost = 1900;
			ctx.fillText('1900', .825 * w, .9625 * h);
			break;
			
			case 5:
			ctx.font = .025 * h + 'px Arial';
			ctx.fillText('All Upgrades', .825 * w, .88 * h);
			ctx.fillText('Bought', .825 * w, .92 * h);
			ctx.fillStyle = 'green';
			ctx.fillRect(.775 * w, .8 * h, .02 * w, .03 * h);
			ctx.fillRect(.795 * w, .8 * h, .02 * w, .03 * h);
			ctx.fillRect(.815 * w, .8 * h, .02 * w, .03 * h);
			ctx.fillRect(.835 * w, .8 * h, .02 * w, .03 * h);
			troop.canAffordA = false;
			break;
		}
	}
	else if(troop.type === 'ship') {
		switch(troop.levelA) {
			
			case 1:
			ctx.font = .04 * h + 'px Arial';
			ctx.fillText('Longer', .825 * w, .88 * h);
			ctx.fillText('Range', .825 * w, .92 * h);
			ctx.font = .03 * h + 'px Arial';
			if(playerMoney >= 400) {
				ctx.fillStyle = 'green';
				troop.canAffordA = true;
			}
			else {
				ctx.fillStyle = 'red';
				troop.canAffordA = false;
			}
			troop.itemACost = 400;
			ctx.fillText('400', .825 * w, .9625 * h);
			break;
			
			case 2:
			ctx.font = .04 * h + 'px Arial';
			ctx.fillText('Longer', .825 * w, .88 * h);
			ctx.fillText('Range', .825 * w, .92 * h);
			ctx.font = .03 * h + 'px Arial';
			ctx.fillStyle = 'green';
			ctx.fillRect(.775 * w, .8 * h, .02 * w, .03 * h);
			if(playerMoney >= 700) {
				ctx.fillStyle = 'green';
				troop.canAffordA = true;
			}
			else {
				ctx.fillStyle = 'red';
				troop.canAffordA = false;
			}
			troop.itemACost = 700;
			ctx.fillText('700', .825 * w, .9625 * h);
			break;
			
			case 3:
			ctx.font = .04* h + 'px Arial';
			ctx.fillText('Increased', .825 * w, .88 * h);
			ctx.fillText('Speed', .825 * w, .92 * h);
			ctx.font = .03 * h + 'px Arial';
			ctx.fillStyle = 'green';
			ctx.fillRect(.775 * w, .8 * h, .02 * w, .03 * h);
			ctx.fillRect(.795 * w, .8 * h, .02 * w, .03 * h);
			if(troop.levelB >= 4) {
				ctx.fillStyle = 'red';
				ctx.fillRect(.815 * w, .8 * h, .02 * w, .03 * h);
				ctx.fillRect(.835 * w, .8 * h, .02 * w, .03 * h);
			}
			if(playerMoney >= 1000) {
				ctx.fillStyle = 'green';
				troop.canAffordA = true;
			}
			else {
				ctx.fillStyle = 'red';
				troop.canAffordA = false;
			}
			troop.itemACost = 1000;
			ctx.fillText('1000', .825 * w, .9625 * h);
			break;
			
			case 4:
			ctx.font = .04 * h + 'px Arial';
			ctx.fillText('Super', .825 * w, .88 * h);
			ctx.fillText('Speed', .825 * w, .92 * h);
			ctx.fillStyle = 'green';
			ctx.fillRect(.775 * w, .8 * h, .02 * w, .03 * h);
			ctx.fillRect(.795 * w, .8 * h, .02 * w, .03 * h);
			ctx.fillRect(.815 * w, .8 * h, .02 * w, .03 * h);
			ctx.font = .03 * h + 'px Arial';
			if(playerMoney >= 2000) {
				ctx.fillStyle = 'green';
				troop.canAffordA = true;
			}
			else {
				ctx.fillStyle = 'red';
				troop.canAffordA = false;
			}
			troop.itemACost = 2000;
			ctx.fillText('2000', .825 * w, .9625 * h);
			break;
			
			case 5:
			ctx.font = .025 * h + 'px Arial';
			ctx.fillText('All Upgrades', .825 * w, .88 * h);
			ctx.fillText('Bought', .825 * w, .92 * h);
			ctx.fillStyle = 'green';
			ctx.fillRect(.775 * w, .8 * h, .02 * w, .03 * h);
			ctx.fillRect(.795 * w, .8 * h, .02 * w, .03 * h);
			ctx.fillRect(.815 * w, .8 * h, .02 * w, .03 * h);
			ctx.fillRect(.835 * w, .8 * h, .02 * w, .03 * h);
			troop.canAffordA = false;
			break;
		}
	}
	else if(troop.type === 'sniper') {
		switch(troop.levelA) {
			
			case 1:
			ctx.font = .04 * h + 'px Arial';
			ctx.fillText('Longer', .825 * w, .88 * h);
			ctx.fillText('Range', .825 * w, .92 * h);
			ctx.font = .03 * h + 'px Arial';
			if(playerMoney >= 500) {
				ctx.fillStyle = 'green';
				troop.canAffordA = true;
			}
			else {
				ctx.fillStyle = 'red';
				troop.canAffordA = false;
			}
			troop.itemACost = 500;
			ctx.fillText('500', .825 * w, .9625 * h);
			break;
			
			case 2:
			ctx.font = .04 * h + 'px Arial';
			ctx.fillText('Longer', .825 * w, .88 * h);
			ctx.fillText('Range', .825 * w, .92 * h);
			ctx.font = .03 * h + 'px Arial';
			ctx.fillStyle = 'green';
			ctx.fillRect(.775 * w, .8 * h, .02 * w, .03 * h);
			if(playerMoney >= 700) {
				ctx.fillStyle = 'green';
				troop.canAffordA = true;
			}
			else {
				ctx.fillStyle = 'red';
				troop.canAffordA = false;
			}
			troop.itemACost = 700;
			ctx.fillText('700', .825 * w, .9625 * h);
			break;
			
			case 3:
			ctx.font = .04* h + 'px Arial';
			ctx.fillText('Stealth', .825 * w, .88 * h);
			ctx.fillText('Detection', .825 * w, .92 * h);
			ctx.font = .03 * h + 'px Arial';
			ctx.fillStyle = 'green';
			ctx.fillRect(.775 * w, .8 * h, .02 * w, .03 * h);
			ctx.fillRect(.795 * w, .8 * h, .02 * w, .03 * h);
			if(troop.levelB >= 4) {
				ctx.fillStyle = 'red';
				ctx.fillRect(.815 * w, .8 * h, .02 * w, .03 * h);
				ctx.fillRect(.835 * w, .8 * h, .02 * w, .03 * h);
			}
			if(playerMoney >= 1000) {
				ctx.fillStyle = 'green';
				troop.canAffordA = true;
			}
			else {
				ctx.fillStyle = 'red';
				troop.canAffordA = false;
			}
			troop.itemACost = 1000;
			ctx.fillText('1000', .825 * w, .9625 * h);
			break;
			
			case 4:
			ctx.font = .04 * h + 'px Arial';
			ctx.fillText('Flaming', .825 * w, .88 * h);
			ctx.fillText('Arrows', .825 * w, .92 * h);
			ctx.fillStyle = 'green';
			ctx.fillRect(.775 * w, .8 * h, .02 * w, .03 * h);
			ctx.fillRect(.795 * w, .8 * h, .02 * w, .03 * h);
			ctx.fillRect(.815 * w, .8 * h, .02 * w, .03 * h);
			if(playerMoney >= 2000) {
				ctx.fillStyle = 'green';
				troop.canAffordA = true;
			}
			else {
				ctx.fillStyle = 'red';
				troop.canAffordA = false;
			}
			troop.itemACost = 2000;
			ctx.fillText('2000', .825 * w, .9625 * h);
			break;
			
			case 5:
			ctx.font = .025 * h + 'px Arial';
			ctx.fillText('All Upgrades', .825 * w, .88 * h);
			ctx.fillText('Bought', .825 * w, .92 * h);
			ctx.fillStyle = 'green';
			ctx.fillRect(.775 * w, .8 * h, .02 * w, .03 * h);
			ctx.fillRect(.795 * w, .8 * h, .02 * w, .03 * h);
			ctx.fillRect(.815 * w, .8 * h, .02 * w, .03 * h);
			ctx.fillRect(.835 * w, .8 * h, .02 * w, .03 * h);
			troop.canAffordA = false;
			break;
		}
	}
	else if(troop.type === 'general') {
		switch(troop.levelA) {
			
			case 1:
			ctx.font = .04 * h + 'px Arial';
			ctx.fillText('Longer', .825 * w, .88 * h);
			ctx.fillText('Range', .825 * w, .92 * h);
			ctx.font = .03 * h + 'px Arial';
			if(playerMoney >= 700 + 10 * waveNum) {
				ctx.fillStyle = 'green';
				troop.canAffordA = true;
			}
			else {
				ctx.fillStyle = 'red';
				troop.canAffordA = false;
			}
			troop.itemACost = 700 + 10 * waveNum;
			ctx.fillText(700 + 10 * waveNum, .825 * w, .9625 * h);
			break;
			
			case 2:
			ctx.font = .04 * h + 'px Arial';
			ctx.fillText('Longer', .825 * w, .88 * h);
			ctx.fillText('Range', .825 * w, .92 * h);
			ctx.font = .03 * h + 'px Arial';
			ctx.fillStyle = 'green';
			ctx.fillRect(.775 * w, .8 * h, .02 * w, .03 * h);
			if(playerMoney >= 900 + 10 * waveNum) {
				ctx.fillStyle = 'green';
				troop.canAffordA = true;
			}
			else {
				ctx.fillStyle = 'red';
				troop.canAffordA = false;
			}
			troop.itemACost = 900 + 10 * waveNum;
			ctx.fillText(900 + 10 * waveNum, .825 * w, .9625 * h);
			break;
			
			case 3:
			ctx.font = .04* h + 'px Arial';
			ctx.fillText('Pro', .825 * w, .88 * h);
			ctx.fillText('Soldiers', .825 * w, .92 * h);
			ctx.font = .03 * h + 'px Arial';
			ctx.fillStyle = 'green';
			ctx.fillRect(.775 * w, .8 * h, .02 * w, .03 * h);
			ctx.fillRect(.795 * w, .8 * h, .02 * w, .03 * h);
			if(troop.levelB >= 4) {
				ctx.fillStyle = 'red';
				ctx.fillRect(.815 * w, .8 * h, .02 * w, .03 * h);
				ctx.fillRect(.835 * w, .8 * h, .02 * w, .03 * h);
			}
			if(playerMoney >= 2000 + 10 * waveNum) {
				ctx.fillStyle = 'green';
				troop.canAffordA = true;
			}
			else {
				ctx.fillStyle = 'red';
				troop.canAffordA = false;
			}
			troop.itemACost = 2000 + 10 * waveNum;
			ctx.fillText(2000 + 10 * waveNum, .825 * w, .9625 * h);
			break;
			
			case 4:
			ctx.font = .04 * h + 'px Arial';
			ctx.fillText('None', .825 * w, .88 * h);
			ctx.fillText('Remaining', .825 * w, .92 * h);
			ctx.fillStyle = 'green';
			ctx.fillRect(.775 * w, .8 * h, .02 * w, .03 * h);
			ctx.fillRect(.795 * w, .8 * h, .02 * w, .03 * h);
			ctx.fillRect(.815 * w, .8 * h, .02 * w, .03 * h);
			if(playerMoney >= 3000) {
				ctx.fillStyle = 'green';
				troop.canAffordA = true;
			}
			else {
				ctx.fillStyle = 'red';
				troop.canAffordA = false;
			}
			troop.itemACost = 3000;
			//ctx.fillText('3000', .825 * w, .9625 * h);
			this.canAffordA = false;
			break;
			
			case 5:
			ctx.font = .025 * h + 'px Arial';
			ctx.fillText('All Upgrades', .825 * w, .88 * h);
			ctx.fillText('Bought', .825 * w, .92 * h);
			ctx.fillStyle = 'green';
			ctx.fillRect(.775 * w, .8 * h, .02 * w, .03 * h);
			ctx.fillRect(.795 * w, .8 * h, .02 * w, .03 * h);
			ctx.fillRect(.815 * w, .8 * h, .02 * w, .03 * h);
			ctx.fillRect(.835 * w, .8 * h, .02 * w, .03 * h);
			troop.canAffordA = false;
			break;
		}
	}
	else if(troop.type === 'medic') {
		switch(troop.levelA) {
			
			case 1:
			ctx.font = .04 * h + 'px Arial';
			ctx.fillText('Longer', .825 * w, .88 * h);
			ctx.fillText('Range', .825 * w, .92 * h);
			ctx.font = .03 * h + 'px Arial';
			if(playerMoney >= 1000) {
				ctx.fillStyle = 'green';
				troop.canAffordA = true;
			}
			else {
				ctx.fillStyle = 'red';
				troop.canAffordA = false;
			}
			troop.itemACost = 1000;
			ctx.fillText('1000', .825 * w, .9625 * h);
			break;
			
			case 2:
			ctx.font = .04 * h + 'px Arial';
			ctx.fillText('Longer', .825 * w, .88 * h);
			ctx.fillText('Range', .825 * w, .92 * h);
			ctx.font = .03 * h + 'px Arial';
			ctx.fillStyle = 'green';
			ctx.fillRect(.775 * w, .8 * h, .02 * w, .03 * h);
			if(playerMoney >= 1300) {
				ctx.fillStyle = 'green';
				troop.canAffordA = true;
			}
			else {
				ctx.fillStyle = 'red';
				troop.canAffordA = false;
			}
			troop.itemACost = 1300;
			ctx.fillText('1300', .825 * w, .9625 * h);
			break;
			
			case 3:
			ctx.font = .04* h + 'px Arial';
			ctx.fillText('None', .825 * w, .88 * h);
			ctx.fillText('Remaining', .825 * w, .92 * h);
			ctx.font = .03 * h + 'px Arial';
			ctx.fillStyle = 'green';
			ctx.fillRect(.775 * w, .8 * h, .02 * w, .03 * h);
			ctx.fillRect(.795 * w, .8 * h, .02 * w, .03 * h);
			if(troop.levelB >= 4) {
				ctx.fillStyle = 'red';
				ctx.fillRect(.815 * w, .8 * h, .02 * w, .03 * h);
				ctx.fillRect(.835 * w, .8 * h, .02 * w, .03 * h);
			}
			if(playerMoney >= 2000) {
				ctx.fillStyle = 'green';
				troop.canAffordA = true;
			}
			else {
				ctx.fillStyle = 'red';
				troop.canAffordA = false;
			}
			troop.itemACost = 2000;
			//ctx.fillText('2000', .825 * w, .9625 * h);
			troop.canAffordA = false;
			break;
			
			case 4:
			ctx.font = .04 * h + 'px Arial';
			ctx.fillText('None', .825 * w, .88 * h);
			ctx.fillText('Remaining', .825 * w, .92 * h);
			ctx.fillStyle = 'green';
			ctx.fillRect(.775 * w, .8 * h, .02 * w, .03 * h);
			ctx.fillRect(.795 * w, .8 * h, .02 * w, .03 * h);
			ctx.fillRect(.815 * w, .8 * h, .02 * w, .03 * h);
			if(playerMoney >= 3000) {
				ctx.fillStyle = 'green';
				troop.canAffordA = true;
			}
			else {
				ctx.fillStyle = 'red';
				troop.canAffordA = false;
			}
			troop.itemACost = 3000;
			ctx.fillText('3000', .825 * w, .9625 * h);
			//this.canAffordA = false;
			break;
			
			case 5:
			ctx.font = .025 * h + 'px Arial';
			ctx.fillText('All Upgrades', .825 * w, .88 * h);
			ctx.fillText('Bought', .825 * w, .92 * h);
			ctx.fillStyle = 'green';
			ctx.fillRect(.775 * w, .8 * h, .02 * w, .03 * h);
			ctx.fillRect(.795 * w, .8 * h, .02 * w, .03 * h);
			ctx.fillRect(.815 * w, .8 * h, .02 * w, .03 * h);
			ctx.fillRect(.835 * w, .8 * h, .02 * w, .03 * h);
			troop.canAffordA = false;
			break;
		}
	}
	else if(troop.type === 'rifleman') {
		switch(troop.levelA) {
			
			case 1:
			ctx.font = .04 * h + 'px Arial';
			ctx.fillText('Longer', .825 * w, .88 * h);
			ctx.fillText('Range', .825 * w, .92 * h);
			ctx.font = .03 * h + 'px Arial';
			if(playerMoney >= 800) {
				ctx.fillStyle = 'green';
				troop.canAffordA = true;
			}
			else {
				ctx.fillStyle = 'red';
				troop.canAffordA = false;
			}
			troop.itemACost = 800;
			ctx.fillText('800', .825 * w, .9625 * h);
			break;
			
			case 2:
			ctx.font = .04 * h + 'px Arial';
			ctx.fillText('Longer', .825 * w, .88 * h);
			ctx.fillText('Range', .825 * w, .92 * h);
			ctx.font = .03 * h + 'px Arial';
			ctx.fillStyle = 'green';
			ctx.fillRect(.775 * w, .8 * h, .02 * w, .03 * h);
			if(playerMoney >= 1000) {
				ctx.fillStyle = 'green';
				troop.canAffordA = true;
			}
			else {
				ctx.fillStyle = 'red';
				troop.canAffordA = false;
			}
			troop.itemACost = 1000;
			ctx.fillText('1000', .825 * w, .9625 * h);
			break;
			
			case 3:
			ctx.font = .04* h + 'px Arial';
			ctx.fillText('Increased', .825 * w, .88 * h);
			ctx.fillText('Speed', .825 * w, .92 * h);
			ctx.font = .03 * h + 'px Arial';
			ctx.fillStyle = 'green';
			ctx.fillRect(.775 * w, .8 * h, .02 * w, .03 * h);
			ctx.fillRect(.795 * w, .8 * h, .02 * w, .03 * h);
			if(troop.levelB >= 4) {
				ctx.fillStyle = 'red';
				ctx.fillRect(.815 * w, .8 * h, .02 * w, .03 * h);
				ctx.fillRect(.835 * w, .8 * h, .02 * w, .03 * h);
			}
			if(playerMoney >= 1500) {
				ctx.fillStyle = 'green';
				troop.canAffordA = true;
			}
			else {
				ctx.fillStyle = 'red';
				troop.canAffordA = false;
			}
			troop.itemACost = 1500;
			ctx.fillText('1500', .825 * w, .9625 * h);
			break;
			
			case 4:
			ctx.font = .04 * h + 'px Arial';
			ctx.fillText('Super', .825 * w, .88 * h);
			ctx.fillText('Speed', .825 * w, .92 * h);
			ctx.fillStyle = 'green';
			ctx.fillRect(.775 * w, .8 * h, .02 * w, .03 * h);
			ctx.fillRect(.795 * w, .8 * h, .02 * w, .03 * h);
			ctx.fillRect(.815 * w, .8 * h, .02 * w, .03 * h);
			if(playerMoney >= 4000) {
				ctx.fillStyle = 'green';
				troop.canAffordA = true;
			}
			else {
				ctx.fillStyle = 'red';
				troop.canAffordA = false;
			}
			troop.itemACost = 4000;
			ctx.fillText('4000', .825 * w, .9625 * h);
			break;
			
			case 5:
			ctx.font = .025 * h + 'px Arial';
			ctx.fillText('All Upgrades', .825 * w, .88 * h);
			ctx.fillText('Bought', .825 * w, .92 * h);
			ctx.fillStyle = 'green';
			ctx.fillRect(.775 * w, .8 * h, .02 * w, .03 * h);
			ctx.fillRect(.795 * w, .8 * h, .02 * w, .03 * h);
			ctx.fillRect(.815 * w, .8 * h, .02 * w, .03 * h);
			ctx.fillRect(.835 * w, .8 * h, .02 * w, .03 * h);
			troop.canAffordA = false;
			break;
		}
	}
	else if(troop.type === 'wizard') {
		switch(troop.levelA) {
			
			case 1:
			ctx.font = .04 * h + 'px Arial';
			ctx.fillText('Longer', .825 * w, .88 * h);
			ctx.fillText('Range', .825 * w, .92 * h);
			ctx.font = .03 * h + 'px Arial';
			if(playerMoney >= 900) {
				ctx.fillStyle = 'green';
				troop.canAffordA = true;
			}
			else {
				ctx.fillStyle = 'red';
				troop.canAffordA = false;
			}
			troop.itemACost = 900;
			ctx.fillText('900', .825 * w, .9625 * h);
			break;
			
			case 2:
			ctx.font = .04 * h + 'px Arial';
			ctx.fillText('Longer', .825 * w, .88 * h);
			ctx.fillText('Range', .825 * w, .92 * h);
			ctx.font = .03 * h + 'px Arial';
			ctx.fillStyle = 'green';
			ctx.fillRect(.775 * w, .8 * h, .02 * w, .03 * h);
			if(playerMoney >= 1100) {
				ctx.fillStyle = 'green';
				troop.canAffordA = true;
			}
			else {
				ctx.fillStyle = 'red';
				troop.canAffordA = false;
			}
			troop.itemACost = 1100;
			ctx.fillText('1100', .825 * w, .9625 * h);
			break;
			
			case 3:
			ctx.font = .04* h + 'px Arial';
			ctx.fillText('Stun', .825 * w, .88 * h);
			ctx.fillText('Ability', .825 * w, .92 * h);
			ctx.font = .03 * h + 'px Arial';
			ctx.fillStyle = 'green';
			ctx.fillRect(.775 * w, .8 * h, .02 * w, .03 * h);
			ctx.fillRect(.795 * w, .8 * h, .02 * w, .03 * h);
			if(troop.levelB >= 4) {
				ctx.fillStyle = 'red';
				ctx.fillRect(.815 * w, .8 * h, .02 * w, .03 * h);
				ctx.fillRect(.835 * w, .8 * h, .02 * w, .03 * h);
			}
			if(playerMoney >= 1500) {
				ctx.fillStyle = 'green';
				troop.canAffordA = true;
			}
			else {
				ctx.fillStyle = 'red';
				troop.canAffordA = false;
			}
			troop.itemACost = 1500;
			ctx.fillText('1500', .825 * w, .9625 * h);
			break;
			
			case 4:
			ctx.font = .04 * h + 'px Arial';
			ctx.fillText('Teleport', .825 * w, .88 * h);
			ctx.fillText('Enemies', .825 * w, .92 * h);
			ctx.fillStyle = 'green';
			ctx.fillRect(.775 * w, .8 * h, .02 * w, .03 * h);
			ctx.fillRect(.795 * w, .8 * h, .02 * w, .03 * h);
			ctx.fillRect(.815 * w, .8 * h, .02 * w, .03 * h);
			if(playerMoney >= 3000) {
				ctx.fillStyle = 'green';
				troop.canAffordA = true;
			}
			else {
				ctx.fillStyle = 'red';
				troop.canAffordA = false;
			}
			troop.itemACost = 3000;
			ctx.fillText('3000', .825 * w, .9625 * h);
			break;
			
			case 5:
			ctx.font = .025 * h + 'px Arial';
			ctx.fillText('All Upgrades', .825 * w, .88 * h);
			ctx.fillText('Bought', .825 * w, .92 * h);
			ctx.fillStyle = 'green';
			ctx.fillRect(.775 * w, .8 * h, .02 * w, .03 * h);
			ctx.fillRect(.795 * w, .8 * h, .02 * w, .03 * h);
			ctx.fillRect(.815 * w, .8 * h, .02 * w, .03 * h);
			ctx.fillRect(.835 * w, .8 * h, .02 * w, .03 * h);
			troop.canAffordA = false;
			break;
		}
	}
	ctx.restore();
}

function drawTroopPlacement() {
	ctx.save();
	
	ctx.globalAlpha = .5;
	
	let check = checkForWaterPlacement();		
	if(check) {
		ctx.fillStyle = 'gray';
	}			
	else {
		ctx.fillStyle = 'red';
	}
	
	if(itemNumSelected === 0) {
	
		ctx.drawImage(romanSprite, romanSpriteArray[0].x, romanSpriteArray[0].y, romanSpriteArray[0].width, romanSpriteArray[0].height, 
		mousePos.x - .02 * w, mousePos.y - .02 * w, .04 * w, .04 * w);
		
		ctx.beginPath();
		ctx.arc(mousePos.x, mousePos.y, .05 * w, 0, 2 * Math.PI);
		ctx.fill();
		ctx.closePath();
	}
	else if(itemNumSelected === 1) {
		
		ctx.drawImage(archerSprite, archerSpriteArray[0].x, archerSpriteArray[0].y, archerSpriteArray[0].width, archerSpriteArray[0].height,
		mousePos.x - .015 * w, mousePos.y - 1.267 * (.015 * w), .03 * w, 1.267 * .03 * w);
		
		ctx.beginPath();
		ctx.arc(mousePos.x, mousePos.y, .1 * w, 0, 2 * Math.PI);
		ctx.fill();
		ctx.closePath();
	}
	else if(itemNumSelected === 2) {
		
		ctx.drawImage(calvarySprite, calvarySpriteArray[0].x, calvarySpriteArray[0].y, calvarySpriteArray[0].width, calvarySpriteArray[0].height, 
		mousePos.x - .02 * w, mousePos.y - .02 * w, .04 * w, .04 * w);
		
		ctx.beginPath();
		ctx.arc(mousePos.x, mousePos.y, .1 * w, 0, 2 * Math.PI);
		ctx.fill();
		ctx.closePath();
	}
	else if(itemNumSelected === 3) {
		
		ctx.drawImage(cannonImage, 0, 0, 62, 52, mousePos.x - .02 * w, mousePos.y - .02 * w, .04 * w, .04 * w);
		
		ctx.beginPath();
		ctx.arc(mousePos.x, mousePos.y, .07 * w, 0, 2 * Math.PI);
		ctx.fill();
		ctx.closePath();
	}
	else if(itemNumSelected === 4) {
		
		ctx.drawImage(shipImage, 0, 0, 1125, 1125, mousePos.x - .03 * w, mousePos.y - .03 * w, .06 * w, .06 * w);
		
		ctx.beginPath();
		ctx.arc(mousePos.x, mousePos.y, .1 * w, 0, 2 * Math.PI);
		ctx.fill();
		ctx.closePath();
	}
	else if(itemNumSelected === 5) {
		
		ctx.drawImage(sniperSprite, sniperSpriteArray[0].x, sniperSpriteArray[0].y, sniperSpriteArray[0].width, sniperSpriteArray[0].height, 
		mousePos.x - .015 * w, mousePos.y - (.015 * w) * (740/400), .03 * w, (.03 * w) * (740/400));
		
		ctx.beginPath();
		ctx.arc(mousePos.x, mousePos.y, .2 * w, 0, 2 * Math.PI);
		ctx.fill();
		ctx.closePath();
	}
	else if(itemNumSelected === 6) {
		
		ctx.drawImage(generalImage, 0, 0, 432, 720, mousePos.x - .015 * w, mousePos.y - 1.67 * .015 * w, .03 * w, 1.67 * .03 * w);
		
		ctx.beginPath();
		ctx.arc(mousePos.x, mousePos.y, .05 * w, 0, 2 * Math.PI);
		ctx.fill();
		ctx.closePath();
	}
	else if(itemNumSelected === 7) {
		
		ctx.drawImage(medicImage, 0, 0, 380, 512, mousePos.x - .015 * w, mousePos.y - 1.35 * .015 * w, .03 * w, 1.35 * .03 * w);
		
		ctx.beginPath();
		ctx.arc(mousePos.x, mousePos.y, .05 * w, 0, 2 * Math.PI);
		ctx.fill();
		ctx.closePath();
	}
	else if(itemNumSelected === 8) {
		
		ctx.drawImage(riflemanSprite, riflemanSpriteArray[0].x, riflemanSpriteArray[0].y, riflemanSpriteArray[0].width, riflemanSpriteArray[0].height, 
		mousePos.x - .02 * w, mousePos.y - .02 * w, .04 * w, .04 * w);
		
		ctx.beginPath();
		ctx.arc(mousePos.x, mousePos.y, .13 * w, 0, 2 * Math.PI);
		ctx.fill();
		ctx.closePath();
	}
	else if(itemNumSelected === 9) {
		
		ctx.drawImage(wizardSprite, wizardSpriteArray[0].x, wizardSpriteArray[0].y, wizardSpriteArray[0].width, wizardSpriteArray[0].height,
		mousePos.x - .02 * w, mousePos.y - .02 * w, .04 * w, .04 * w);
		
		ctx.beginPath();
		ctx.arc(mousePos.x, mousePos.y, .1 * w, 0, 2 * Math.PI);
		ctx.fill();
		ctx.closePath();
	}
	
	ctx.restore();
}

function drawTrackMap(track) {
	ctx.save();
	
	if(track === 1) {
		ctx.drawImage(image4, 0, 0, 1230, 615, 0, 0, w, h);
		ctx.drawImage(image3, 0, 0, 100, 500, .75 * w, 0, .25 * w, h);
		
		let pattern = ctx.createPattern(image5, 'repeat');
		ctx.strokeStyle = pattern;
		ctx.lineWidth = w/30;
		ctx.beginPath();
		ctx.moveTo(.05 * w, h);
		ctx.lineTo(.05 * w, .1 * h);
		ctx.lineTo(.7 * w, .1 * h);
		ctx.lineTo(.35 * w, .5 * h);
		ctx.lineTo(.6 * w, .5 * h);
		ctx.lineTo(.35 * w, .8 * h);
		ctx.lineTo(.2 * w, .8 * h);
		ctx.lineTo(.2 * w, h);
		ctx.stroke();
		ctx.closePath();
		
		ctx.drawImage(image7, 0, 0, 721, 720, .95 * w, 0, .05 * w, .05 * w);
		ctx.drawImage(image8, 0, 0, 240, 210, .88 * w, 0, .05 * w, .05 * w);
		if(fastForward) {
			ctx.beginPath();
			ctx.fillStyle = 'gold';
			ctx.arc(.95 * w, .04 * w, .01 * w, 0, 2 * Math.PI);
			ctx.fill();
			ctx.closePath();
		}
		ctx.drawImage(image12, 0, 0, 192, 192, .94 * w, .03 * w, .02 * w, .02 * w);
		
		ctx.font = .03 * w + 'px Arial';
		ctx.textAlign = 'center';
		ctx.fillStyle = 'black';
		ctx.fillText(playerHealth, .905 * w, .03 * w);
		
		ctx.drawImage(image9, 0, 0, 637, 646, .81 * w, 0, .05 * w, .05 * w);
		ctx.font = .015 * w + 'px Arial';
		ctx.fillText(playerMoney, .835 * w, .03 * w);
		
		ctx.fillText(waveNum, .975 * w, .03 * w);
		
		ctx.drawImage(image10, 0, 0, 512, 512, .75 * w, 0, .05 * w, .05 * w);
		
		drawCharacterSelection();
	}
	else if(track === 2) {
		ctx.drawImage(image13, 0, 0, 1406, 1025, 0, 0, w, h);
		ctx.drawImage(image3, 0, 0, 100, 500, .75 * w, 0, .25 * w, h);
		//ctx.drawImage(image14, 0, 0, 290, 706, .75 * w, 0, .25 * w, h);
	
		ctx.save();
		ctx.globalAlpha = .4;
		
		let pattern = ctx.createPattern(image5, 'repeat');
		ctx.strokeStyle = pattern;
		ctx.lineWidth = w/30;
		ctx.beginPath();
		ctx.moveTo(0, .05 * h);
		ctx.lineTo(.7 * w, .05 * h);
		ctx.lineTo(.1 * w, .4 * h);
		ctx.lineTo(.7 * w, .4 * h);
		ctx.lineTo(.45 * w, .78 * h);
		ctx.lineTo(.1 * w, .78 * h);
		ctx.lineTo(.1 * w, h);
		ctx.stroke();
		ctx.closePath();
		
		ctx.restore();
		
		ctx.save();
		ctx.globalAlpha = .7;
		
		ctx.strokeStyle = 'red';
		ctx.lineWidth = .002 * w;
		ctx.beginPath();
		ctx.moveTo(0, .05 * h - w/60);
		ctx.lineTo(.81 * w, .05 * h - w/60);
		ctx.lineTo(.22 * w, .4 * h - w/60);
		ctx.lineTo(.745 * w, .4 * h - w/60);
		ctx.lineTo(.455 * w, .78 * h + w/60);
		ctx.lineTo(.1 * w + w/60, .78 * h + w/60);
		ctx.lineTo(.1 * w + w/60, h);
		ctx.stroke();
		ctx.closePath();
		
		ctx.beginPath();
		ctx.moveTo(0, .05 * h + w/60);
		ctx.lineTo(.58 * w, .05 * h + w/60);
		ctx.lineTo(0, .4 * h + w/70);
		ctx.lineTo(.655 * w, .4 * h + w/70);
		ctx.lineTo(.445 * w, .78 * h - w/60);
		ctx.lineTo(.1 * w - w/60, .78 * h - w/60);
		ctx.lineTo(.1 * w - w/60, h);
		ctx.stroke();
		ctx.closePath();
		
		ctx.restore();
		
		ctx.drawImage(image7, 0, 0, 721, 720, .95 * w, 0, .05 * w, .05 * w);
		ctx.drawImage(image8, 0, 0, 240, 210, .88 * w, 0, .05 * w, .05 * w);
		if(fastForward) {
			ctx.beginPath();
			ctx.fillStyle = 'gold';
			ctx.arc(.95 * w, .04 * w, .01 * w, 0, 2 * Math.PI);
			ctx.fill();
			ctx.closePath();
		}
		ctx.drawImage(image12, 0, 0, 192, 192, .94 * w, .03 * w, .02 * w, .02 * w);
		
		ctx.font = .03 * w + 'px Arial';
		ctx.textAlign = 'center';
		ctx.fillStyle = 'black';
		ctx.fillText(playerHealth, .905 * w, .03 * w);
		
		ctx.drawImage(image9, 0, 0, 637, 646, .81 * w, 0, .05 * w, .05 * w);
		ctx.font = .015 * w + 'px Arial';
		ctx.fillText(playerMoney, .835 * w, .03 * w);
		
		ctx.fillText(waveNum, .975 * w, .03 * w);
		
		ctx.drawImage(image10, 0, 0, 512, 512, .75 * w, 0, .05 * w, .05 * w);
		
		drawCharacterSelection();
	}
	else if(track === 3) {
		ctx.drawImage(image16, 0, 0, 852, 480, 0, 0, w, h);
		ctx.drawImage(image3, 0, 0, 100, 500, .75 * w, 0, .25 * w, h);
		
		ctx.save();
		ctx.globalAlpha = .4;
		let pattern = ctx.createPattern(image5, 'repeat');
		ctx.strokeStyle = pattern;
		ctx.lineWidth = w/30;
		ctx.beginPath();
		ctx.moveTo(.1 * w, 0);
		ctx.lineTo(.1 * w, .95 * h);
		ctx.lineTo(.7 * w, .95 * h);
		ctx.lineTo(.7 * w, .4 * h);
		ctx.lineTo(.4 * w, .4 * h);
		ctx.lineTo(.4 * w, .7 * h);
		ctx.lineTo(.6 * w, .7 * h);
		ctx.lineTo(.6 * w, 0);
		ctx.stroke();
		ctx.closePath();
		ctx.restore();
		
		ctx.save();
		ctx.globalAlpha = .7;
		
		ctx.strokeStyle = 'red';
		ctx.lineWidth = .002 * w;
		ctx.beginPath();
		ctx.moveTo(.1 * w - w/60, 0);
		ctx.lineTo(.1 * w - w/60, .95 * h + w/60);
		ctx.lineTo(.7 * w + w/60, .95 * h + w/60);
		ctx.lineTo(.7 * w + w/60, .4 * h - w/60);
		ctx.lineTo(.6 * w + w/60, .4 * h - w/60);
		ctx.moveTo(.6 * w - w/60, .4 * h - w/60);
		ctx.lineTo(.4 * w - w/60, .4 * h - w/60);
		ctx.lineTo(.4 * w - w/60, .7 * h + w/60);
		ctx.lineTo(.6 * w + w/60, .7 * h + w/60);
		ctx.lineTo(.6 * w + w/60, .4 * h + w/60);
		ctx.moveTo(.6 * w + w/60, .4 * h - w/60);
		ctx.lineTo(.6 * w + w/60, 0);
		ctx.stroke();
		ctx.closePath();
		
		ctx.beginPath();
		ctx.moveTo(.1 * w + w/60, 0);
		ctx.lineTo(.1 * w + w/60, .95 * h - w/60);
		ctx.lineTo(.7 * w - w/60, .95 * h - w/60);
		ctx.lineTo(.7 * w - w/60, .4 * h + w/60);
		ctx.lineTo(.6 * w + w/60, .4 * h + w/60);
		ctx.moveTo(.6 * w - w/60, .4 * h + w/60);
		ctx.lineTo(.4 * w + w/60, .4 * h + w/60);
		ctx.lineTo(.4 * w + w/60, .7 * h - w/60);
		ctx.lineTo(.6 * w - w/60, .7 * h - w/60);
		ctx.lineTo(.6 * w - w/60, .4 * h + w/60);
		ctx.moveTo(.6 * w - w/60, .4 * h - w/60);
		ctx.lineTo(.6 * w - w/60, 0);
		ctx.stroke();
		ctx.closePath();
		
		ctx.restore();
		
		ctx.drawImage(image7, 0, 0, 721, 720, .95 * w, 0, .05 * w, .05 * w);
		ctx.drawImage(image8, 0, 0, 240, 210, .88 * w, 0, .05 * w, .05 * w);
		if(fastForward) {
			ctx.beginPath();
			ctx.fillStyle = 'gold';
			ctx.arc(.95 * w, .04 * w, .01 * w, 0, 2 * Math.PI);
			ctx.fill();
			ctx.closePath();
		}
		ctx.drawImage(image12, 0, 0, 192, 192, .94 * w, .03 * w, .02 * w, .02 * w);
		
		ctx.font = .03 * w + 'px Arial';
		ctx.textAlign = 'center';
		ctx.fillStyle = 'black';
		ctx.fillText(playerHealth, .905 * w, .03 * w);
		
		ctx.drawImage(image9, 0, 0, 637, 646, .81 * w, 0, .05 * w, .05 * w);
		ctx.font = .015 * w + 'px Arial';
		ctx.fillText(playerMoney, .835 * w, .03 * w);
		
		ctx.fillText(waveNum, .975 * w, .03 * w);
		
		ctx.drawImage(image10, 0, 0, 512, 512, .75 * w, 0, .05 * w, .05 * w);
		
		drawCharacterSelection();
	}
	
	ctx.restore();
}

function drawCharacterSelection() {
	ctx.save();
	
	ctx.fillStyle = 'black';
	ctx.fillRect(.75 * w, .75 * h, .25 * w, .01 * h);
	
	ctx.drawImage(romanHead, 0, 0, 55, 52, .8 * w, .15 * h, .025 * w, .025 * w);
	ctx.font = .025 * h + 'px Arial';
	ctx.textAlign = 'center';
	ctx.strokeStyle = 'black';
	ctx.lineWidth = .001 * w;
	if(playerMoney >= romanSoldierCost) {
		ctx.fillStyle = 'green';
	}
	else {
		ctx.fillStyle = 'red';
	}
	ctx.fillText(romanSoldierCost, .8125 * w, .225 * h);
	ctx.strokeRect(.8 * w, .15 * h, .025 * w, .04 * w);
	
	ctx.drawImage(archerHead, 0, 0, 96, 88, .8375 * w, .15 * h, .025 * w, .025 * w);
	if(playerMoney >= archerCost) {
		ctx.fillStyle = 'green';
	}
	else {
		ctx.fillStyle = 'red';
	}
	ctx.fillText(archerCost, .85 * w, .225 * h);
	ctx.strokeRect(.8375 * w, .15 * h, .025 * w, .04 * w);
	
	ctx.drawImage(calvaryHead, 0, 0, 70, 60, .875 * w, .15 * h, .025 * w, .025 * w);
	if(playerMoney >= calvaryCost) {
		ctx.fillStyle = 'green';
	}
	else {
		ctx.fillStyle = 'red';
	}
	ctx.fillText(calvaryCost, .8875 * w, .225 * h);
	ctx.strokeRect(.875 * w, .15 * h, .025 * w, .04 * w);
	
	ctx.drawImage(cannonImage, 0, 0, 62, 52, .9125 * w, .15 * h, .025 * w, .025 * w);
	if(playerMoney >= cannonCost) {
		ctx.fillStyle = 'green';
	}
	else {
		ctx.fillStyle = 'red';
	}
	ctx.fillText(cannonCost, .925 * w, .225 * h);
	ctx.strokeRect(.9125 * w, .15 * h, .025 * w, .04 * w);
	
	ctx.drawImage(shipImage, 0, 0, 1125, 1125, .8 * w, .255 * h, .025 * w, .025 * w);
	if(playerMoney >= shipCost) {
		ctx.fillStyle = 'green';
	}
	else {
		ctx.fillStyle = 'red';
	}
	ctx.fillText(shipCost, .8125 * w, .33 * h);
	ctx.strokeRect(.8 * w, .255 * h, .025 * w, .04 * w);
	
	ctx.drawImage(sniperHead, 0, 0, 383, 317, .8375 * w, .255 * h, .025 * w, .025 * w);
	if(playerMoney >= sniperCost) {
		ctx.fillStyle = 'green';
	}
	else {
		ctx.fillStyle = 'red';
	}
	ctx.font = .02 * h + 'px Arial';
	ctx.fillText(sniperCost, .85 *  w, .33 * h);
	ctx.strokeRect(.8375 * w, .255 * h, .025 * w, .04 * w);
	
	ctx.drawImage(generalHead, 0, 0, 295, 253, .875 * w, .255 * h, .025 * w, .025 * w);
	if(playerMoney >= generalCost) {
		ctx.fillStyle = 'green';
	}
	else {
		ctx.fillStyle = 'red';
	}
	ctx.fillText(generalCost, .8875 * w, .33 * h);
	ctx.strokeRect(.875 * w, .255 * h, .025 * w, .04 * w);
	
	ctx.drawImage(medicHead, 0, 0, 218, 205, .9125 * w, .255 * h, .025 * w, .025 * w);
	if(playerMoney >= medicCost) {
		ctx.fillStyle = 'green';
	}
	else {
		ctx.fillStyle = 'red';
	}
	ctx.fillText(medicCost, .925 * w, .33 * h);
	ctx.strokeRect(.9125 * w, .255 * h, .025 * w, .04 * w);
	
	if(waveNum > 24) {
		ctx.drawImage(riflemanHead, 0, 0, 64, 48, .8 * w, .36 * h, .025 * w, .025 * w);
		if(playerMoney >= riflemanCost) {
			ctx.fillStyle = 'green';
		}
		else {
			ctx.fillStyle = 'red';
		}
		ctx.fillText(riflemanCost, .8125 * w, .435 * h);
		ctx.strokeRect(.8 * w, .36 * h, .025 * w, .04 * w);
	}
	else {
		ctx.fillStyle = 'black';
		ctx.font = .015 * h + 'px Arial';
		ctx.fillText('Unlock', .8125 * w, .385 * h);
		ctx.fillText('Wave', .8125 * w, .41 * h);
		ctx.font = .02 * h + 'px Arial';
		ctx.fillStyle = 'blue';
		ctx.fillText('25', .8125 * w, .435 * h);
		ctx.strokeRect(.8 * w, .36 * h, .025 * w, .04 * w);
	}
	
	if(waveNum > 30) {
		ctx.drawImage(wizardHead, 0, 0, 92, 81, .8375 * w, .36 * h, .025 * w, .025 * w);
		if(playerMoney >= wizardCost) {
			ctx.fillStyle = 'green';
		}
		else {
			ctx.fillStyle = 'red';
		}
		ctx.fillText(wizardCost, .85 * w, .435 * h);
		ctx.strokeRect(.8375 * w, .36 * h, .025 * w, .04 * w);
	}
	else {
		ctx.fillStyle = 'black';
		ctx.font = .015 * h + 'px Arial';
		ctx.fillText('Unlock', .85 * w, .385 * h);
		ctx.fillText('Wave', .85 * w, .41 * h);
		ctx.font = .02 * h + 'px Arial';
		ctx.fillStyle = 'blue';
		ctx.fillText('31', .85 * w, .435 * h);
		ctx.strokeRect(.8375 * w, .36 * h, .025 * w, .04 * w);
	}
	
	ctx.restore();
}

function prepareNextWave() {
	beginNextWave = false;
	enemySpawnCounter = 0;
	
	if(waveNum === 1) {
		playerMoney += 200;
		for(let i = 0, j = 60; i < 30; i++, j += 120) {
			enemyArray.push({type: 1, time: j});
		}
		
		infoDiv.innerHTML = "Might be a bit more barbarians coming...";
	}
	else if(waveNum === 2) {
		playerMoney += 200;
		for(let i = 0, j = 60; i < 10; i++, j += 100) {
			enemyArray.push({type: 1, time: j});
		}
		enemyArray.push({type: 2, time: 1000});
		
		infoDiv.innerHTML = "Watch out for the upgraded one... lots of health ... may attack if you get too close...";
	}
	else if(waveNum === 3) {
		playerMoney += 300;
		for(let i = 0, j = 60; i < 40; i++, j += 120) {
			enemyArray.push({type: 1, time: j});
		}
		for(let i = 0, j = 160; i < 5; i++, j += 300) {
			enemyArray.push({type: 2, time: j});
		} 
		
		infoDiv.innerHTML = "Spend that bonus wisely....";
	}
	else if(waveNum === 4) {
		playerMoney += 200;
		for(let i = 0, j = 60; i < 5; i++, j += 60) {
			enemyArray.push({type: 1, time: j});
		}
		for(let i = 0, j = 601; i < 5; i++, j += 60) {
			enemyArray.push({type: 1, time: j});
		} 
		for(let i = 0, j = 1202; i < 5; i++, j += 60) {
			enemyArray.push({type: 1, time: j});
		} 
		for(let i = 0, j = 63; i < 5; i++, j += 200) {
			enemyArray.push({type: 2, time: j});
		} 
		
		infoDiv.innerHTML = "Get ready....";
	}	
	else if(waveNum === 5) {
		playerMoney += 300;
		for(let i = 0, j = 60; i < 40; i++, j += 60) {
			enemyArray.push({type: 1, time: j});
		}
		for(let i = 0, j = 91; i< 10; i++, j += 200) {
			enemyArray.push({type: 2, time: j});
		}
		
		infoDiv.innerHTML = "Maybe something to pierce through enemy lines would help...";
	}
	else if(waveNum === 6) {
		playerMoney += 200;
		for(let i = 0, j = 60; i < 50; i++, j += 80) {
			enemyArray.push({type: 1, time: j});
		}
		for(let i = 0, j = 401; i < 9; i++, j += 400) {
			enemyArray.push({type: 2, time: j});
		}
		for(let i = 0, j = 102; i < 20; i++, j += 150) {
			enemyArray.push({type: 3, time: j});
		}
		
		infoDiv.innerHTML = "Some fast barbs with a ferocious swing approaching....";
	}
	else if(waveNum === 7) {
		playerMoney += 200;
		for(let i = 0, j = 60; i < 50; i++, j += 60) {
			enemyArray.push({type: 1, time: j});
		}
		for(let i = 0, j = 61; i < 5; i++, j += 500) {
			enemyArray.push({type: 2, time: j});
		}
		for(let i = 0, j = 1002; i < 10; i++, j += 100) {
			if(i % 2 === 0) {
				enemyArray.push({type: 3, time: j});
			}
			else {
				enemyArray.push({type: 4, time: j});
			}
		}
		
		infoDiv.innerHTML = "Nicely done, but you haven't met the blue barbs...";
	}
	else if(waveNum === 8) {
		playerMoney += 200;
		for(let i = 0, j = 60; i < 100; i++, j += 30) {
			enemyArray.push({type: 1, time: j});
		}
		for(let i = 0, j = 61; i < 50; i++, j += 60) {
			enemyArray.push({type: 3, time: j});
		}
		for(let i = 0, j = 85; i < 33; i++, j += 90) {
			enemyArray.push({type: 4, time: j});
		}
		
		infoDiv.innerHTML = "The more the merrier...";
	}
	else if(waveNum === 9) {
		playerMoney += 200;
		for(let i = 0, j = 60; i < 100; i++, j += 60) {
			if(i % 2 === 0) enemyArray.push({type: 1, time: j});
			else enemyArray.push({type: 3, time: j});
		}
		
		infoDiv.innerHTML = "Hope you upgraded your archer's damage last round...";
	}
	else if(waveNum === 10) {
		playerMoney += 500;
		for(let i = 0, j = 60; i < 100; i++, j += 30) {
			enemyArray.push({type: 1, time: j});
		}
		for(let i = 0, j = 85; i < 80; i++, j += 70) {
			enemyArray.push({type: 3, time: j});
		}
		
		infoDiv.innerHTML = "That wave was too easy... right?";
	}
	else if(waveNum === 11) {
		playerMoney += 200;
		for(let i = 0, j = 60; i < 10; i++, j += 40) {
			enemyArray.push({type: 2, time: j});
		}
		for(let i = 0, j = 461; i < 10; i++, j += 40) {
			enemyArray.push({type: 3, time: j});
		}
		for(let i = 0, j = 862; i < 10; i++, j += 40) {
			enemyArray.push({type: 4, time: j});
		}
		for(let i = 0, j = 1263; i < 10; i++, j += 40) {
			enemyArray.push({type: 5, time: j});
		}
		
		infoDiv.innerHTML = "And then the green barbs came...";
	}
	/*
	else if(waveNum === 12) {
		playerMoney += 200;
		for(let i = 0, j = 60; i < 100; i++, j += 60) {
			if(i % 2 === 0) enemyArray.push({type: 1, time: j});
			else enemyArray.push({type: 3, time: j});
		}
		
		infoDiv.innerHTML = "Hope you upgraded your archer's damage last round...";
	}
	else if(waveNum === 9) {
		playerMoney += 300;
		for(let i = 0, j = 60; i < 100; i++, j += 60) {
			enemyArray.push({type: 1, time: j});
		}
		for(let i = 0, j = 61; i < 100; i++, j += 60) {
			enemyArray.push({type: 2, time: j});
		}
		
		infoDiv.innerHTML = "Swarm of barbs incoming...";
	}
	else if(waveNum === 13) {
		playerMoney += 200;
		for(let i = 0, j = 60; i < 20; i++, j += 60) {
			enemyArray.push({type: 4, time: j});
		}
		for(let i = 0, j = 1501; i < 20; i++, j += 60) {
			enemyArray.push({type: 4, time: j});
		}
		for(let i = 0, j = 3002; i < 20; i++, j += 60) {
			enemyArray.push({type: 4, time: j});
		}
		
		infoDiv.innerHTML = "Wonder if that sharpshooter can help you cover the map...";
	}
	else if(waveNum === 14) {
		playerMoney += 200;
		for(let i = 0, j = 60; i < 75; i++, j += 45) {
			enemyArray.push({type: 1, time: j});
		}
		for(let i = 0, j = 61; i < 15; i++, j += 135) {
			enemyArray.push({type: 3, time: j});
		}
		for(let i = 0, j = 73; i < 5; i++, j += 300) {
			enemyArray.push({type: 4, time: j});
		}
		
		infoDiv.innerHTML = "It only takes one upgrade to get a ship to spot stealth...";
	}
	else if(waveNum === 15) {
		playerMoney += 200;
		for(let i = 0, j = 30; i < 100; i++, j += 50) {
			enemyArray.push({type: 1, time: j});
		}
		for(let i = 0, j = 61; i < 50; i++, j += 150) {
			enemyArray.push({type: 3, time: j});
		}
		for(let i = 0, j = 102; i < 50; i++, j += 200) {
			enemyArray.push({type: 4, time: j});
		}
		
		infoDiv.innerHTML = "And you thought that round was tough...";
	}
	else if(waveNum === 11) {
		playerMoney += 500;
		for(let i = 0, j = 60; i < 100; i++, j += 50) {
			enemyArray.push({type: 1, time: j});
		}
		for(let i = 0, j = 85; i < 100; i++, j += 100) {
			enemyArray.push({type: 4, time: j});
		}
		
		infoDiv.innerHTML = "Might want that archer's damage to be pretty good...";
	}
	else if(waveNum === 16) {
		playerMoney += 200;
		for(let i = 0, j = 60; i < 10; i++, j += 40) {
			enemyArray.push({type: 2, time: j});
		}
		for(let i = 0, j = 461; i < 10; i++, j += 40) {
			enemyArray.push({type: 3, time: j});
		}
		for(let i = 0, j = 862; i < 10; i++, j += 40) {
			enemyArray.push({type: 4, time: j});
		}
		for(let i = 0, j = 1263; i < 10; i++, j += 40) {
			enemyArray.push({type: 5, time: j});
		}
		
		infoDiv.innerHTML = "And then the green barbs came...";
	}
	else if(waveNum === 17) {
		playerMoney += 200;
		for(let i = 0, j = 60; i < 100; i++, j += 50) {
			enemyArray.push({type: 1, time: j});
		}
		for(let i = 0, j = 61; i < 25; i++, j += 120) {
			enemyArray.push({type: 3, time: j});
		}
		for(let i = 0, j = 82; i < 33; i++, j += 120) {
			enemyArray.push({type: 4, time: j});
		}
		for(let i = 0, j = 4003; i < 10; i++, j += 180) {
			enemyArray.push({type: 5, time: j});
		}
		
		infoDiv.innerHTML = "The greens are coming...";
	}
	else if(waveNum === 18) {
		playerMoney += 200;
		for(let i = 0, j = 60; i < 100; i++, j += 50) {
			enemyArray.push({type: 1, time: j});
		}
		for(let i = 0, j = 61; i < 25; i++, j += 80) {
			enemyArray.push({type: 3, time: j});
		}
		for(let i = 0, j = 82; i < 33; i++, j += 80) {
			enemyArray.push({type: 4, time: j});
		}
		for(let i = 0, j = 4003; i < 10; i++, j += 180) {
			enemyArray.push({type: 5, time: j});
		}
		
		infoDiv.innerHTML = "Last round but harder...."
	}
	else if(waveNum === 19) {
		playerMoney += 200;
		for(let i = 0, j = 60; i < 100; i++, j += 80) {
			enemyArray.push({type: 5, time: j});
		}
		
		infoDiv.innerHTML = "The blues are coming...";
	}
	else if(waveNum === 20) {
		playerMoney += 200;
		for(let i = 0, j = 60; i < 100; i++, j += 40) {
			enemyArray.push({type: 1, time: j});
		}
		for(let i = 0, j = 61; i < 25; i++, j += 80) {
			enemyArray.push({type: 3, time: j});
		}
		for(let i = 0, j = 85; i < 33; i++, j += 80) {
			enemyArray.push({type: 4, time: j});
		}
		for(let i = 0, j = 1003; i < 10; i++, j += 180) {
			enemyArray.push({type: 5, time: j});
		}
		
		infoDiv.innerHTML = "Lots of Chaos...";
	}
	*/
	else if(waveNum === 12) {
		playerMoney += 500;
		for(let i = 0, j = 60; i < 10; i++, j += 60) {
			enemyArray.push({type: 3, time: j, stealth: true});
		}
		
		infoDiv.innerHTML = "Hope you see what's coming next...";
	}
	else if(waveNum === 13) {
		playerMoney += 200;
		for(let i = 0, j = 60; i < 100; i++, j += 30) {
			enemyArray.push({type: 1, time: j, stealth: true});
		}
		for(let i = 0, j = 201; i < 10; i++, j += 40) {
			enemyArray.push({type: 4, time: j, stealth: true});
		}
		
		infoDiv.innerHTML = "Don't say I didn't warn you...";
	}
	else if(waveNum === 14) {
		playerMoney += 200;
		for(let i = 0, j = 60; i < 100; i++, j += 60) {
			enemyArray.push({type: 1, time: j});
		}
		for(let i = 0, j = 101; i < 100; i++, j += 70) {
			if(i % 2 === 0) enemyArray.push({type: 3, time: j});
			else enemyArray.push({type: 2, time: j});
		}
		for(let i = 0, j = 2002; i < 5; i++, j += 20) {
			enemyArray.push({type: 7, time: j});
		}
		for(let i = 0, j = 5003; i < 5; i++, j += 20) {
			enemyArray.push({type: 7, time: j});
		}
		
		infoDiv.innerHTML = "Some troops lose speed as they move through the track...";
	}
	else if(waveNum === 15) {
		playerMoney += 300;
		for(let i = 0, j = 60; i < 10; i++, j += 20) {
			enemyArray.push({type: 7, time: j});
		}
		for(let i = 0, j = 401; i < 10; i++, j += 20) {
			enemyArray.push({type: 7, time: j});
		}
		for(let i = 0, j = 703; i < 10; i++, j += 20) {
			enemyArray.push({type: 7, time: j});
		}
		for(let i = 0, j = 59; i < 100; i++, j += 30) {
			enemyArray.push({type: 1, time: j});
		}
		
		infoDiv.innerHTML = "Cannon has triple shot?";
	}
	else if(waveNum === 16) {
		playerMoney += 500;
		for(let i = 0, j = 60; i < 100; i++, j += 50) {
			enemyArray.push({type: 1, time: j});
		}
		for(let i = 0, j = 61; i < 50; i++, j += 70) {
			enemyArray.push({type: 5, time: j});
		}
		
		infoDiv.innerHTML = "How fast can that ship really shoot...";
	}
	else if(waveNum === 17) {
		playerMoney += 200;
		for(let i = 0, j = 60; i < 100; i++, j += 60) {
			enemyArray.push({type: 3, time: j});
		}
		for(let i = 0, j = 61; i < 50; i++, j += 120) {
			enemyArray.push({type: 6, time: j});
		}
		for(let i = 0, j = 3002; i < 25; i++, j += 120) {
			enemyArray.push({type: 4, time: j});
		}
		
		infoDiv.innerHTML = "Thinking about buying some riflemen? ... oh wait you can't";
	}
	else if(waveNum === 18) {
		playerMoney += 200;
		for(let i = 0, j = 60; i < 200; i++, j += 30) {
			enemyArray.push({type: 1, time: j});
		}
		for(let i = 0, j = 62; i < 50; i++, j += 120) {
			enemyArray.push({type: 5, time: j, stealth: true});
		}
		for(let i = 0, j = 61; i < 100; i++, j += 60) {
			enemyArray.push({type: 6, time: j});
		}
		
		infoDiv.innerHTML = "Generals can help your troops spot stealth...";
	}
	else if(waveNum === 19) {
		playerMoney += 200;
		for(let i = 0, j = 60; i < 200; i++, j += 30) {
			enemyArray.push({type: 3, time: j});
		}
		for(let i = 0, j = 61; i < 100; i++, j += 60) {
			enemyArray.push({type: 5, time: j});
		}
		for(let i = 0, j = 62; i < 50; i++, j += 120) {
			enemyArray.push({type: 7, time: j});
		}
		for(let i = 0, j = 4003; i < 30; i++, j += 30) {
			enemyArray.push({type: 6, time: j});
		}
		
		infoDiv.innerHTML = "Repoted 380 troops approaching...";
	}
	else if(waveNum === 20) {
		playerMoney += 200;
		for(let i = 0, j = 60; i < 200; i++, j += 30) {
			enemyArray.push({type: 4, time: j});
		}
		for(let i = 0, j = 1002; i < 50; i++, j += 60) {
			enemyArray.push({type: 6, time: j});
			enemyArray.push({type: 7, time: j + 1});
		}
		for(let i = 0, j = 61; i < 50; i++, j+= 15) {
			enemyArray.push({type: 2, time: j});
		}
		
		infoDiv.innerHTML = "Got any sharpshooters?";
	}
	else if(waveNum === 21) {
		playerMoney += 200;
		for(let i = 0, j = 60; i < 100; i++, j += 30) {
			enemyArray.push({type: 5, time: j});
		}
		for(let i = 0, j = 3001; i < 50; i++, j += 30) {
			enemyArray.push({type: 7, time: j});
			enemyArray.push({type: 2, time: j + 1});
		}
		
		infoDiv.innerHTML = "The next wave might pass you by...";
	}
	else if(waveNum === 22) {
		playerMoney += 1000;
		for(let i = 0, j = 60; i < 100; i++, j += 60) {
			enemyArray.push({type: 2, time: j, stealth: true});
		}
		for(let i = 0, j = 301; i < 100; i++, j += 20) {
			enemyArray.push({type: 7, time: j});
			enemyArray.push({type: 5, time: j + 1});
		}
		for(let i = 0, j = 1003; i < 200; i++, j+= 10) {
			enemyArray.push({type: 6, time: j});
		}
		for(let i = 0, j = 5006; i < 50; i++, j += 10) {
			enemyArray.push({type: 7, time: j});
		}
		
		infoDiv.innerHTML = "Next round will test your stealth skills...";
	}
	else if(waveNum === 23) {
		playerMoney += 200;
		for(let i = 0, j = 60; i < 100; i++, j += 30) {
			enemyArray.push({type: 7, time: j, stealth: true});
		}
		for(let i = 0, j = 1501; i < 100; i++, j += 10) {
			enemyArray.push({type: 6, time: j, stealth: true});
		}
	
		infoDiv.innerHTML = "Stealth up ahead :( .... "
	}
	else if(waveNum === 24) {
		playerMoney += 200;
		for(let i = 0, j = 60; i < 300; i++, j += 10) {
			enemyArray.push({type: 5, time: j});
		}
		for(let i = 0, j = 61; i < 100; i++, j += 30) {
			enemyArray.push({type: 6, time: j, stealth: true});
		}
		for(let i = 0, j = 3002; i < 100; i++, j += 30) {
			enemyArray.push({type: 7, time: j});
		}
		for(let i = 0, j = 3003; i < 50; i++, j += 60) {
			enemyArray.push({type: 8, time: j});
		}
		
		infoDiv.innerHTML = "New quick barb with more HP and faster speed approaching...";
	}
	else if(waveNum === 25) {
		playerMoney += 200;
		for(let i = 0, j = 60; i < 200; i++, j += 20) {
			enemyArray.push({type: 7, time: j});
		}
		for(let i = 0, j = 61; i < 20; i++, j += 10) {
			enemyArray.push({type: 8, time: j});
		}
		for(let i = 0, j = 501; i < 50; i++, j += 10) {
			enemyArray.push({type: 5, time: j});
		}
		for(let i = 0, j = 2003; i < 50; i++, j += 30) {
			enemyArray.push({type: 7, time: j, stealth: true});
		}
		
		infoDiv.innerHTML = "Quantity over quality...";
	}
	else if(waveNum === 26) {
		playerMoney += 200;
		for(let i = 0, j = 60; i < 100; i++, j += 30) {
			enemyArray.push({type: 8, time: j});
		}
		for(let i = 0, j = 1001; i < 100; i++, j += 10) {
			enemyArray.push({type: 6, time: j});
		}
		for(let i = 0, j = 2002; i < 100; i++, j += 10) {
			enemyArray.push({type: 5, time: j});
			enemyArray.push({type: 4, time: j + 1});
		}
		
		infoDiv.innerHTML = "Got any wizards yet? ....";
	}
	else if(waveNum === 27) {
		playerMoney += 200;
		for(let i = 0, j = 60; i < 100; i++, j += 30) {
			enemyArray.push({type: 8, time: j});
			enemyArray.push({type: 5, time: j + 4, stealth: true});
		}
		for(let i = 0, j = 1002; i < 100; i++, j += 10) {
			enemyArray.push({type: 6, time: j, stealth: true});
		}
		for(let i = 0, j = 2003; i < 20; i++, j += 10) {
			enemyArray.push({type: 7, time: j});
		}
		
		infoDiv.innerHTML = "Too easy...";
	}
	else if(waveNum === 28) {
		playerMoney += 200;
		for(let i = 0, j = 60; i < 100; i++, j += 30) {
			enemyArray.push({type: 8, time: j});
			enemyArray.push({type: 6, time: j + 1});
		}
		for(let i = 0, j = 62; i < 20; i++, j += 15) {
			enemyArray.push({type: 9, time: j});
		}
		for(let i = 0, j = 1003; i < 20; i++, j+= 10) {
			enemyArray.push({type: 7, time: j});
		}
		for(let i = 0, j = 2004; i < 20; i++, j+= 15) {
			enemyArray.push({type: 9, time: j});
		}
		
		infoDiv.innerHTML = "Those troops you thought were safe... not anymore...";
	}
	else if(waveNum === 29) {
		playerMoney += 200;
		for(let i = 0, j = 60; i < 200; i++, j += 20) {
			enemyArray.push({type: 2, time: j});
			enemyArray.push({type: 6, time: j + 1});
		}
		for(let i = 0, j = 1003; i < 50; i++, j += 10) {
			enemyArray.push({type: 7, time: j});
		}
		for(let i = 0, j = 1504; i < 40; i++, j += 15) {
			enemyArray.push({type: 9, time: j});
		}
		for(let i = 0, j = 2005; i < 50; i++, j += 10) {
			enemyArray.push({type: 8, time: j});
		}
		
		infoDiv.innerHTML = "Why don't you invest in some medics...";
	}
	else if(waveNum === 30) {
		playerMoney += 200;
		for(let i = 0, j = 60; i < 100; i++, j += 30) {
			enemyArray.push({type: 8, time: j, stealth: true});
		}
		for(let i = 0, j = 1001; i < 50; i++, j += 15) {
			enemyArray.push({type: 7, time: j});
		}
		for(let i = 0, j = 2002; i < 50; i++, j += 10) {
			enemyArray.push({type: 9, time: j});
		}
		
		infoDiv.innerHTML = "Impressive, but not good enough...";
	}
	else if(waveNum === 31) {
		playerMoney += 200;
		for(let i = 0, j = 60; i < 100; i++, j += 10) {
			enemyArray.push({type: 11, time: j});
		}
		
		infoDiv.innerHTML = "Some troops won't cost you health, but money...";
	}
	else if(waveNum === 32) {
		playerMoney += 200;
		for(let i = 0, j = 60; i < 300; i++, j += 10) {
			enemyArray.push({type: 7, time: j, stealth: true});
		}
		for(let i = 0, j = 501; i < 100; i++, j += 10) {
			enemyArray.push({type: 6, time: j});
		}
		for(let i = 0, j = 1502; i < 100; i++, j += 10) {
			enemyArray.push({type: 8, time: j, stealth: true});
		}
		for(let i = 0, j = 2503; i < 50; i++, j += 10) {
			enemyArray.push({type: 9, time: j});
		}
		
		infoDiv.innerHTML = "Stealth again...";
	}
	else if(waveNum === 33) {
		playerMoney += 200;
		for(let i = 0, j = 60; i < 300; i++, j += 20) {
			enemyArray.push({type: 9, time: j});
		}
		for(let i = 0, j = 1001; i < 100; i++, j += 30) {
			enemyArray.push({type: 8, time: j, stealth: true});
		}
		for(let i = 0, j = 3002; i < 100; i++, j+= 20) {
			enemyArray.push({type: 11, time: j});
		}
		
		infoDiv.innerHTML = "How're your medics doing...";
	}
	else if(waveNum === 34) {
		playerMoney += 200;
		for(let i = 0, j = 60; i < 300; i++, j += 10) {
			enemyArray.push({type: 9, time: j, stealth: true});
		}
		for(let i = 0, j = 1001; i < 50; i++, j += 30) {
			enemyArray.push({type: 10, time: j});
		}
		for(let i = 0, j = 2002; i < 50; i++, j += 10) {
			enemyArray.push({type: 6, time: j, stealth: true});
		}
		
		infoDiv.innerHTML = "New enemy approaching.... 25 health....";
	}
	else if(waveNum === 35) {
		playerMoney += 200;
		for(let i = 0, j = 60; i < 100; i++, j += 30) {
			enemyArray.push({type: 10, time: j, stealth: true});
		}
		for(let i = 0, j = 1001; i < 100; i++, j += 10) {
			enemyArray.push({type: 8, time: j, stealth: true});
			enemyArray.push({type: 11, time: j + 1, stealth: true});
		}
		for(let i = 0, j = 2003; i < 100; i++, j += 5) {
			enemyArray.push({type: 9, time: j, stealth: true});
		}
		
		infoDiv.innerHTML = "Stealth spotted...";
	}
	else if(waveNum === 36) {
		playerMoney += 200;
		for(let i = 0, j = 60; i < 300; i++, j += 10) {
			enemyArray.push({type: 10, time: j, stealth: true});
		}
		for(let i = 0, j = 1001; i < 200; i++, j += 5) {
			enemyArray.push({type: 8, time: j, stealth: true});
			enemyArray.push({type: 11, time: j + 1, stealth: true});
		}
		for(let i = 0, j = 2003; i < 100; i++, j += 5) {
			enemyArray.push({type: 9, time: j, stealth: true});
		}
		
		infoDiv.innerHTML = "gg2ez";
	}
	else if(waveNum === 37) {
		infoDiv.innerHTML = "fine you won";
	}
	
	troopArray.forEach(function(troop) {
		troop.health += 5;
		if(troop.health > troop.maxHealth) troop.health = troop.maxHealth;
	});
	
	addEventListener('mousedown', event4);
}




























